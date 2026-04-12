import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Same .env file as server/index.js (project root .env) so PORT stays in sync with the API
dotenv.config({ path: path.join(__dirname, '.env') });
const apiPort = process.env.PORT || '3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
});
