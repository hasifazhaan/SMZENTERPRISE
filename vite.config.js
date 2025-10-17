import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep the config simple — ensures .jsx files are handled and plugin is present
export default defineConfig({
  plugins: [react()],
  resolve: {
    // make sure JSX extensions resolve
    extensions: ['.js', '.jsx', '.json']
  }
})
