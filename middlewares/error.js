
module.exports = (error, req, res, next)=>{
    error.statusCode = error.status || 500;

    if(process.env.NODE_ENV == 'development'){
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            stack: error.stack,
            error: error
        })
    }
    if(process.env.NODE_ENV == 'production'){
        let message = error.message;
        let error =new Error(message);
        if(error.name == "ValidationError"){
            message = Object.values(error.errors).map(value => value.message)
            error = new Error(message)
            error.statusCode = 400
        }
        if(error.name == 'CastError'){
            message = `Resource not found: ${error.path}`;
            error = new Error(message) 
            error.statusCode = 400      
        }
        if(error.code == 11000){
            let message = `Duplicate ${Object.keys(error.keyValue)} error`
            error = new Error(message)
            error.statusCode = 400
        }
        if(error.name == 'JSONWebTokenError'){
            let message = `JSON Web token is invalid. Try again.`;
            error = new Error(message)
            error.statusCode = 400
        }
        if(error.name == 'TokenExpiredError'){
            let message = `JSON Web token is expired. Try again.`;
            error = new Error(message)
            error.statusCode = 400
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || ' Internal Server Error',
        })
    }
}