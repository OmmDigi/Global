module.exports = {
  apps: [
    {
      name: "gti-frontend",
      script: "server.js",
      cwd: "/var/www/globaltechnicalinstitute/client",
      env: { PORT: 3001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-api",
      script: "dist/index.js",
      cwd: "/var/www/globaltechnicalinstitute/api",
      env: { PORT: 4001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-upload",
      script: "dist/server.js",
      cwd: "/var/www/globaltechnicalinstitute/upload",
      env: { PORT: 5001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-essl-server",
      script: "http-server.js",
      cwd: "/var/www/globaltechnicalinstitute/essl",
      env: { TCP_NET_PORT: 6001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-essl-net-server",
      script: "tcp-server.js",
      cwd: "/var/www/globaltechnicalinstitute/essl",
      env: { TCP_NET_PORT: 7001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
  ],
};
