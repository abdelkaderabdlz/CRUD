
const jwt = require('jsonwebtoken');
const appError = require('../utils/app.error');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        const error = appError.create('token is required',401,httpStatusText.ERROR);
        return next(error);
    }

    try{
        const token = authHeader.split(' ')[1];
        const currentuser = jwt.verify(token , process.env.JWT_SECRET_KEY);
        req.currentuser = currentuser;
        next();
    }catch (err) {
        const error = appError.create('invalid token',401,httpStatusText.ERROR);
        return next(error)
    }
}
module.exports = verifyToken;