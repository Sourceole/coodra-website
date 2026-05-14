import { reactRouter } from '@react-router/dev/vite'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const dashboardBuildId = process.env.VERCEL_DEPLOYMENT_ID
  || process.env.VERCEL_URL
  || process.env.VERCEL_GIT_COMMIT_SHA
  || new Date().toISOString()

function dashboardVersionPlugin(): Plugin {
  return {
    name: 'coodra-dashboard-version',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'dashboard-version.json',
        source: `${JSON.stringify({
          version: dashboardBuildId,
          builtAt: new Date().toISOString()
        }, null, 2)}\n`
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), dashboardVersionPlugin()],
  define: {
    __COODRA_DASHBOARD_BUILD_ID__: JSON.stringify(dashboardBuildId)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    ssrEmitAssets: true,
  },
})
