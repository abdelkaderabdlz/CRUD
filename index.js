
const express = require('express');
const app = express();

const appError = require('./utils/app.error');

const path = require ('path');


require('dotenv').config();


app.use(express.json()) // bash ye9der ye9ra req.body bi sighat json





const mongoose = require('mongoose');
async function main(){
    const url = process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log('connected');
}    
main().catch(err =>  console.log('err',err));

// courses routes:
const coursesRoute = require('./routes/courses-routes');
app.use('/api/courses',coursesRoute);

// users routes :
const usersRoute = require('./routes/users-routes')
app.use('/api/users',usersRoute);

// photo routes :
app.use('/uploads',express.static(path.join(__dirname,'uploads'))) // li idhar sora 


const httpStatusText = require('./utils/httpStatusText');
// global midelweare for not founde routes:
app.all(/.*/,(req,res,next)=>{
   return res.status(404).json({status : httpStatusText.ERROR , data: null , message : 'this ressourse is not available' });
  })

// global error handler:
app.use((error,req,res,next)=>{
 return res.status(error.statusCode||500).json({status : error.statusText || httpStatusText.ERROR , message : error.message});
})  


app.listen(process.env.PORT || 4000, ()=>{
    console.log('port : ',process.env.PORT );
});