function err(message, code) {
    let e = new Error(message);//creamos una variable con el error

    if (code) {
        e.statusCode = code; // si existe el code se lo agregamos 
    }

    return e;
}

module.exports = err;
