module.exports = {
  apps: [
    // {
    //   name: "gti-frontend",
    //   script: "server.js",
    //   cwd: "/var/www/globaltechnicalinstitute/frontend",
    //   env: { PORT: 3001, HOST: "127.0.0.1", NODE_ENV: "production" }
    // },
    // {
    //   name: "gti-crm",
    //   script: "server.js",
    //   cwd: "/var/www/globaltechnicalinstitute/crm",
    //   env: { PORT: 3002, HOST: "127.0.0.1", NODE_ENV: "production" }
    // },
    {
      name: "gti-api",
      script: "dist/index.js",
      cwd: "/var/www/globaltechnicalinstitute/api",
      env: { PORT: 4001, HOST: "127.0.0.1", NODE_ENV: "production" }
    },
    {
      name: "gti-upload",
      script: "dist/server.js",
      cwd: "/var/www/globaltechnicalinstitute/upload",
      env: { PORT: 5001, HOST: "127.0.0.1", NODE_ENV: "production" }
    }
  ]
}