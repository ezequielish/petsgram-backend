

//Estructura de respuesta para cualquier cliente.
exports.success = function (res, data, status) {
    let statusCode = status;
    if (!status) {
        statusCode = 200;
    }

    res.status(statusCode).send({ 
        error: '',
        body: data,
        code: statusCode
    });
}

exports.error = function (res, err, status) {
    console.error("[response error] " + err)
    res.status(status || 500).send({
        error: err,
        body: "",
        code: status
    })
}