const path = require("path");

module.exports = {
  apps: [
    {
      name: "inframantra-web",
      cwd: __dirname,
      script: path.join(__dirname, "node_modules/next/dist/bin/next"),
      args: "start -p 3000",

      interpreter: "node",
      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      restart_delay: 5000,
      max_memory_restart: "900M",

      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
