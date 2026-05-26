import dns from 'node:dns'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Set DNS servers to Google (8.8.8.8) and Cloudflare (1.1.1.1) to bypass Jio ISP DNS block
dns.setServers(['8.8.8.8', '1.1.1.1'])

// Monkey-patch dns.lookup since Node's http.request/https.get uses dns.lookup which ignores dns.setServers()
const originalLookup = dns.lookup
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  
  if (hostname.endsWith('.up.railway.app')) {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || !addresses.length) {
        return originalLookup(hostname, options, callback)
      }
      
      const ip = addresses[0]
      if (options.all) {
        return callback(null, [{ address: ip, family: 4 }])
      } else {
        return callback(null, ip, 4)
      }
    })
    return
  }
  
  return originalLookup(hostname, options, callback)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
