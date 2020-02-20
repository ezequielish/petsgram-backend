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
    authJwtSecret: process.env.JWT,
    apiKeyScopeAdmin: process.env.API_KEY_SCOPE_ADMIN,
    apiKeyScopePublic: process.env.API_KEY_SCOPE_PUBLIC
}

module.exports = config