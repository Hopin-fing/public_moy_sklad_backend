module.exports = {
    apps: [
        {
            name: 'MS',
            script: 'dist/index.js',
            max_memory_restart: '512M',
            autorestart: true,
            kill_timeout: 60000,
            log_date_format: 'YYYY-MM-DD HH:mm:ss SSS'
        }
    ]
};
