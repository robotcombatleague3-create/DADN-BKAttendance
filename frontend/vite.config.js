import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        students: resolve(__dirname, 'students.html'),
        history: resolve(__dirname, 'history.html')
      }
    }
  }
});
