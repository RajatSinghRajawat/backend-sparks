module.exports = {
  apps: [
    {
      name: "sparks-backend-api",
      script: "src/index.js",
      instances: 1, // Single instance recommended due to in-memory quiz socket state & background jobs
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      combine_logs: true,
      time: true,
    },
  ],
};
