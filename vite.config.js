import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/server.js',
      formats: ['es'],
      fileName: 'server'
    },
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      external: ['express','peer']
    }
  }
})