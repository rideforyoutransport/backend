module.exports = {
    apps: [
      {
        name: 'nodejs-app',
        script: './bin/www',
        watch: true,
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'pocketbase',
        script: './pocketbase/pocketbase',
        args: 'serve',
        watch: false
      }
    ]
  };