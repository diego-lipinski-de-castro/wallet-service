module.exports = {
  apps: [
    {
      name: 'gomoov-wallet-service',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}