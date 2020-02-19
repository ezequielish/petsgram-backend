require('dotenv').config()

const config = {
    dev: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'http://localhost',
    host_db: process.env.DB_HOST,
    name_db: process.env.DB_NAME,
    urldb: process.env.DB || '',
    port_db: process.env.DB_PORT,
    publicRoute: process.env.PUBLIC_ROUTE || 'app',
    authJwtSecret: process.env.JWT

}

module.exports = config