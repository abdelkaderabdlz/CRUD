
const asyncWrrapper = require('../midelweare/asyncWrrapper');
const Users = require('../models/users.model');
const appError = require('../utils/app.error');
const httpStatusText = require('../utils/httpStatusText');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generate.token');

const getAllUsers = asyncWrrapper(
    async(req , res) => {
        const query = req.query;
        const limit = Number(query.limit) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * limit;
        const users = await Users.find({},{'__v' : false ,password : false}).limit(limit).skip(skip);
        const totalUsers = await Users.countDocuments(); // yehsab 3adad elmostakhdimin

        res.status(200).json({status : httpStatusText.SUCCESS , 
             data : {users ,
                     pagination :  {total: totalUsers,
                                    page,
                                    limit 
                                   }
                    }
                });
    })

    // register : 

    const register = asyncWrrapper(
        async(req,res,next) => {
          
            const {firstName,lastName,email,password,role,avatar} = req.body;
            const userExisteDeja = await Users.findOne({email : email});
            if(userExisteDeja){
                const error = appError.create('this email is already exists',400,httpStatusText.ERROR);
                return next(error);
            }
            console.log(req.file)
            
            //hash password:
            const hashedpassword = await bcrypt.hash(password,10);
            const newUser = new Users({firstName,
                                        lastName,
                                        email,
                                        password : hashedpassword,
                                        role,
                                        avatar : req.file.filename}
                                    );
            await newUser.save(); 

            const token = generateToken({id : newUser._id , email : newUser.email , role : newUser.role});
            newUser.token = token;  

           return res.status(201).json({status : httpStatusText.SUCCESS , data : {newUser}});                    
    });

    // login :

    const login = asyncWrrapper(
        async(req ,res ,next) => {
            const {email,password,role} = req.body;
            const userExiste = await Users.findOne({email : email});
            if(!userExiste){
               const error = appError.create('this email is not register',400,httpStatusText.ERROR);
               return next(error);
            }

            const decode = await bcrypt.compare(password,userExiste.password);
            
            if(!decode){
                const error = appError.create('password wrong',400,httpStatusText.ERROR);
               return next(error);
            }
            const token = generateToken({id : userExiste._id , email : userExiste.email , role : userExiste.role});

            return res.status(200).json({status : httpStatusText.SUCCESS , data : {token}});
        } 
    )


    module.exports = {
        getAllUsers,
        register,
        login
    }
