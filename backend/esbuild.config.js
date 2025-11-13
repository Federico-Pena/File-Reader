import esbuild from 'esbuild'

const NODE_ENV = process.env.NODE_ENV

const sharedOptions = {
  format: 'esm',
  tsconfig: './tsconfig.json',
  target: 'es2022',
  sourcemap: 'inline',
  bundle: true,
  platform: 'node',
  external: ['node-llama-cpp'],
  banner: {
    js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);'
  }
}

if (NODE_ENV === 'development') {
  const ctx = await esbuild.context({
    entryPoints: ['./src/**/*.ts'],
    outdir: './out',
    minify: false,
    ...sharedOptions
  })

  ctx
    .watch()
    .then(() => console.log('Build and watching...'))
    .catch((err) => {
      console.log('Build failed')
      console.error(err)
    })
} else {
  esbuild
    .build({
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.js',
      minify: true,
      ...sharedOptions
    })
    .then(() => console.log('Build successful'))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
