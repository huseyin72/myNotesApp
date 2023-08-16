const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req,res,next) =>{ 
    const token = req.cookies.jwt;
    if(token){ 
        jwt.verify(token,'secret_key_for_user',(err,decodedToken)=>{
            if(err){
                console.log(err);
                res.redirect('/login');              
            }else{ 
                next();

            }
        });


    }else{ 
        res.redirect('/login')
    }
}


// check current user
const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'secret_key_for_user', async (err,decodedToken)=>{
            if(err){
                console.log(err);
                res.locals.user = null;
                next();             
            }else{ 
                
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();

            }
        });



    }else{
        res.locals.user = null;
        next();
    }
}

const withoutAuth = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){ 
        res.redirect('/');
        
    }else{
        next();
    }

};

const logoutMid =  (req,res,next) =>{
    res.cookie('jwt','',{maxAge:1});
    next();
}


module.exports = {requireAuth,checkUser,withoutAuth,logoutMid};