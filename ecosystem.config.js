module.exports = {
  apps: [
    {
      name: "gti-frontend",
      script: "./node_modules/.bin/next",
      args: ["start", "-p", "3001", "-H", "127.0.0.1"],
      cwd: "/var/www/Global/client",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        HOSTNAME: "127.0.0.1"
      }
    },
    {
      name: "gti-api",
      script: "dist/index.js",
      cwd: "/var/www/Global/api",
      env: { PORT: 4001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-upload",
      script: "dist/server.js",
      cwd: "/var/www/Global/upload",
      env: { PORT: 5001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    {
      name: "gti-essl-server",
      script: "http-server.js",
      cwd: "/var/www/Global/essl",
      env: { PORT: 6001, HOST: "127.0.0.1", NODE_ENV: "production" },
    },
    // {
    //   name: "gti-essl-net-server",
    //   script: "tcp-server.js",
    //   cwd: "/var/www/Global/essl",
    //   env: { TCP_NET_PORT: 7001, HOST: "127.0.0.1", NODE_ENV: "production" },
    // },
  ],
};