const response = require('../network/response');

function errors(err, req, res, next) {  
    
    const message = err.message || 'Error interno';
    const status = err.statusCode || 500;

    response.error(res, message, status);
}

module.exports = errors;
