// https://esbuild.github.io/getting-started/
import esbuild from 'esbuild'
const NODE_ENV = process.env.NODE_ENV

if (NODE_ENV === 'devexlopment') {
  const ctx = await esbuild.context({
    entryPoints: ['backend/src/**/*.ts'],
    format: 'esm',
    minify: false,
    outdir: 'backend/out',
    platform: 'node',
    target: ['node16']
  })
  ctx
    .watch()
    .then(() => {
      console.log('Build and watching...')
    })
    .catch((err) => {
      console.log('Build failed')
      console.log(err)
    })
} else {
  esbuild
    .build({
      entryPoints: ['backend/src/index.ts'],
      outfile: 'dist/index.cjs',
      bundle: true,
      minify: true,
      platform: 'node',
      format: 'cjs',
      target: ['node16']
      /* banner: {
        js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);'
      } */
    })
    .then(() => {
      console.log('Build successful')
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
