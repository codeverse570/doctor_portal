const appError = require('./../utils/appError')
const handleCastError = (err) => {
    return new appError("failed", `Invalid ${err.path}: ${err.value}`)
}
const handleDuplicate = (err) => {
    const keys = Object.keys(err.keyValue)
    return new appError('failed', `duplicated entry at ${keys[0]} : ${err.keyValue[keys[0]]}`)
}
const validError = (err) => {
    const messages = Object.keys(err.errors).map(obj => {
        return err.errors[obj].message
    })
    return new appError('failed', messages.join(". "))

}
const Jwt = (err) => {
    return new appError("failed", err.message)
}
module.exports.errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.errorMessage = err.errorMessage || "error"
    if (process.env.NODE_ENV == 'production') {

        if (err.name == "CastError") {
            err = handleCastError(err)
        }
        if (err.code == 11000) {
            err = handleDuplicate(err)
        }
        if (err.name == "ValidationError") {
            err = validError(err)
        }
        if (err.name == "JsonWebTokenError") {
            err = Jwt(err)
        }
        if (err.isOperational) {
            if (req.originalUrl.startsWith("/api"))
                res.status(err.statusCode).json({
                    status: err.errorMessage,
                    message: err.message
                })
            else res.status(err.statusCode).render("error", {
                title:"error",
                err: err.message
            })
        }

        else {
            if (req.originalUrl.startsWith("/api"))
                res.status(err.statusCode).json({
                    message: "something went very wrong"
                })
            else res.status(err.statusCode).render("error", {
                title:"something went wrong",
                err: "something went very wrong"
            })
        }

    }
    else if (process.env.NODE_ENV == 'development') {
        if (req.originalUrl.startsWith("/api"))
            res.status(err.statusCode).json({
                status: err.errorMessage,
                error: err,
                message: err.message,
                stack: err.stack
            })
        else res.status(err.statusCode).render("error", {
            title: "Something went wrong",
            err
        })
    }
}
module.exports.catchAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err) => {
            next(err)
        })
    }
}