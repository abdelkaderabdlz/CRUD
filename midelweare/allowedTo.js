const appError = require("../utils/app.error");
const httpStatusText = require('../utils/httpStatusText');

module.exports = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.currentuser.role)){
            const error = appError.create('this role is not authorized',400,httpStatusText.ERROR);
            return next(error);
        }
       next();
    }
}