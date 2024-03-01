/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: "peerpulse-app",
      script: "dist/index.js",
      instances: "max",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/error.log", // Path to error log file
      out_file: "logs/out.log", // Path to standard output log file
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      combine_logs: true,
      time: true,

      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        exec_mode: "cluster_mode",
      },

      env_development: {
        NODE_ENV: "development",
        PORT: 5000,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules",
          "./public",
          "./.DS_Store",
          "./package.json",
          "./package.lock.json",
          "./src",
        ],
      },
    },
  ],
};
