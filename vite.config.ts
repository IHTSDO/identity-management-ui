import { defineConfig } from 'vite';

// Extend Angular's Vite config: allow nginx fronted host and keep HMR working through proxy
export default defineConfig({
  server: {
    // Allow requests forwarded by nginx with this Host header
    allowedHosts: ['local.ihtsdotools.org'],
    // If you ever serve directly (not via nginx), uncomment the next line to bind externally
    // host: true,

    // HMR over the same origin (proxied through nginx at 8092)
    hmr: {
      host: 'local.ihtsdotools.org',
      port: 8092,
      protocol: 'wss'
    },
  },
});
