
const {body} = require('express-validator');

 function  validate(){
      return [
            body('title').notEmpty().withMessage('title is required'),
            body('price').notEmpty().withMessage('price is required').isNumeric().withMessage('price must be a number')
       ]
 }

 module.exports = validate();
       