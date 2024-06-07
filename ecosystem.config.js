module.exports = {
  apps: [
    {
      name: 'webserver',
      script: './dist/index.js',
      instances: 7,
      exec_mode: 'cluster'
    }
  ]
};
