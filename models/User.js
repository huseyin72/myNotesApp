const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:[true,'Bu kullanıcı adı mevcut'],

    },
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        unique:[true,'Bu email zaten kayıtlı'],
        lowercase:true,
        validate: [isEmail,'please enter a valid email' ]

    },
    password:{
        type:String, 
        required:true,
        minLength:6

    },
    resetToken:{
        type:String
    },
    resetTokenExpires:{
        type:Date
    }
    

})

userSchema.statics.login = async function(email,password){
   const user = await this.findOne({email});
   if(user){ 
    const auth = await bcrypt.compare(password,user.password)
    if(auth){
        return user;
    }
    throw Error('incorrect password');

   }else{
    throw Error('incorrect Email');

   }
}


userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);

    next();

})


module.exports = mongoose.model('User',userSchema);