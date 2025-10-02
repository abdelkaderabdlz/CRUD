const express = require('express');
const router = express.Router();
const verifyToken = require('../midelweare/verify.token');
const httpStatusText = require('../utils/httpStatusText');

// li idhar assora :
const multer = require('multer');
const diskStorage = multer.diskStorage({
       destination :  (req , file , cb) => {
              console.log(file);
                cb(null , 'uploads');
       },
       filename : (req , file , cb) => {
              const ext = file.mimetype.split('/')[1];
              const fileName = `user-${Date.now()}.${ext}`;
              cb(null,fileName);
       }
})
// li kay yatim idkhal sora fa9at wa la yomkin pdf aw ay chaye akhar
const fileFilter = (req , file , cb) => {
       const imageType = file.mimetype.split('/')[0];
       if(imageType === 'image'){
              return cb(null,true);
       }else {
              const error = appError.create('file must be an image',400,httpStatusText.ERROR);
              return cb (error,false);
       }
}
// li idhar wa faltarat sora:
const upload = multer({ storage: diskStorage,
                        fileFilter : fileFilter
                     });



const usersController = require ('../conrollers/users-controller');
const { now } = require('mongoose');
const appError = require('../utils/app.error');

router.route('/')
       .get(verifyToken,usersController.getAllUsers)

router.route('/register')
       .post(upload.single('avatar') , usersController.register)

router.route('/login')
      .post(usersController.login)

       module.exports = router;