module.exports = {
  apps: [
    {
      name: 'fedhybrid-client',
      script: 'npm',
      args: 'start',
      cwd: '/home/jyh/fedhybrid-client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8081
      }
    }
  ]
}; 