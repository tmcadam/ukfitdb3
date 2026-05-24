import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      './fit-logo.png': path.resolve(__dirname, 'src/__mocks__/image-mock.js'),
      './fk-logo.png': path.resolve(__dirname, 'src/__mocks__/image-mock.js'),
      './fortuna-logo.png': path.resolve(__dirname, 'src/__mocks__/image-mock.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
})
