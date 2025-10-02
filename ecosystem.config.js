module.exports = {
  apps : [{
    name   : "whatsapp-gateway",
    script : "./server.js",
    watch: false, // Nonaktifkan watch di produksi
    max_memory_restart: '1G', // Restart jika memori > 1GB
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
