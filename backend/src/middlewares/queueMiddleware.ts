import type { Request, Response, NextFunction } from 'express'
import { SseEmitter } from '../service/SseEmitter.js'

type Task = {
  req: Request
  res: Response
  next: NextFunction
  emitter: SseEmitter
  interval?: NodeJS.Timeout
}

export class ProcessQueue {
  private queue: Task[] = []
  private running = 0
  private readonly maxConcurrent: number
  private readonly maxQueue: number

  constructor(maxConcurrent: number, maxQueue: number) {
    this.maxConcurrent = maxConcurrent
    this.maxQueue = maxQueue
  }

  add(req: Request, res: Response, next: NextFunction) {
    const emitter = new SseEmitter(res)
    emitter.init()

    // 🔹 Si ya hay demasiados en espera, rechazamos el ingreso
    if (this.queue.length >= this.maxQueue) {
      emitter.send({
        type: 'error',
        error: 'El sistema está ocupado. Por favor, intente nuevamente más tarde.'
      })
      emitter.end()
      return
    }

    const task: Task = { req, res, next, emitter }
    this.queue.push(task)

    // 🔹 Si está en espera, notificar posición dinámica
    const position = this.getPosition(task)
    if (position > 0) {
      emitter.send({
        type: 'queue',
        status: 'waiting',
        position
      })

      // Intervalo individual: actualiza posición cada 3 segundos
      task.interval = setInterval(() => {
        const currentPos = this.getPosition(task)
        if (currentPos > 0 && !emitter.closed) {
          emitter.send({
            type: 'queue',
            status: 'waiting',
            position: currentPos
          })
        }
      }, 3000)
    }

    this.runNext()
  }

  private runNext() {
    // Si no hay slots libres, no hacemos nada
    if (this.running >= this.maxConcurrent) return
    const task = this.queue.shift()
    if (!task) return

    // 🔹 Detener su intervalo de espera
    if (task.interval) clearInterval(task.interval)

    this.running++
    const { req, res, next, emitter } = task

    emitter.send({
      type: 'queue',
      status: 'started',
      position: 0
    })

    // 🔹 Cuando termina o se cierra la conexión, liberamos el slot
    const release = () => {
      this.running--
      res.removeListener('close', release)
      res.removeListener('finish', release)
      this.runNext()
    }

    res.on('close', release)
    res.on('finish', release)

    next()
  }

  // 🔹 Calcula la posición actual de un cliente en la cola
  private getPosition(task: Task): number {
    const index = this.queue.indexOf(task)
    // Si está en ejecución, posición 0
    if (index === -1) return 0
    // Si está en cola, su posición es (index + 1)
    return index + 1
  }
}

// Configuración: máximo 2 en proceso, máximo 2 esperando
const sseQueue = new ProcessQueue(2, 2)

export const queueMiddleware = (req: Request, res: Response, next: NextFunction) => {
  sseQueue.add(req, res, next)
}
