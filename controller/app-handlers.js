const client = require('../database');
const User = require('../models/User');
const Notes = require('../models/Notes');
const jwt = require('jsonwebtoken');
const { sendResetMail } = require('../sendmail/sendmail');
const crypto = require('crypto');

 




const maxAge = 60*60*24*7;
const createToken = (id) =>{
    return jwt.sign({id},'secret_key_for_user',{
        expiresIn:maxAge
    })
}



//get add-note page Main root
exports.getAddNote = async (req,res) =>{
    try{
        userid = res.locals.user._id;
        if (userid) {
            //const titles = await Notes.find({user_id:userid},'note_title');
            const notes = await Notes.find({user_id:userid});
            
            if(req.query.content){
                
                const content = await Notes.find({noteNumber:req.query.content});
                console.log(content);

                res.render('main/index.pug',{title:'Main Page',notes:notes,content:content});
            }
            res.render('main/index.pug',{title:'Main Page',notes:notes});
            
            

        }
        
        


    }catch(err){
        return err
    }

   

}

//post add-note page
exports.postAddNote = async (req,res) =>{
    try{ 



        const note = await Notes.create({
            note_title:  req.body.note_title,
            user_id:res.locals.user._id,
            note:req.body.note
        })



 
        res.redirect('/');
        
    }catch(err){ 
        return err;
    }
   

}

//register
exports.getRegister = async (req,res) =>{
    res.render('account/register');
}


exports.postRegister = async (req,res) =>{
    try{
        const new_user = await User.create({
            username : req.body.username,
            email :req.body.email, 
            password : req.body.password           
        })
        const token = createToken(new_user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.redirect('/');
    }catch (err){
        res.render('account/register',{warning:err.message});
    }
}



// login

exports.postLogin = async (req, res ) =>{ 
    try{
        const user = await User.login(req.body.email, req.body.password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.redirect('/');

    }catch(err){
        res.render('account/login',{warning:err.message});

    }
}

exports.getLogin = async (req,res) =>{
    res.render('account/login');

}


//logout
exports.logout = async (req,res) =>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
};


// edit note
exports.getNoteEdit = async (req,res) =>{
    const noteid = req.params.note_id;
    const content = await Notes.findOne({noteNumber:noteid});
    

    res.render('details/note-edit',{content:content});


}

exports.postNoteEdit = async (req,res) =>{
    
    await Notes.findOneAndUpdate({noteNumber:req.body.note_id},{note_title:req.body.note_title,note:req.body.note,updatedAt: Date.now()});


    res.redirect('/');

}


// view note
exports.getNoteViews = async (req,res) =>{
    
    const theNote = await Notes.findOne({noteNumber:req.params.note_id});


    if(theNote.user_id.equals(res.locals.user._id)) {

        res.render('details/note-views',{note:theNote});
    }
    else{

        res.send('sayfa bulunamadı');
    }
    

    
}


//reset password
exports.getResetPassword = (req,res) =>{



    res.render('account/reset-password');
    

}
exports.postResetPassword = async (req,res) =>{
    const mailPerson = await User.findOne({email:req.body.email});


    if (mailPerson){
        const randomBuffer= crypto.randomBytes(32);
        const randomToken =  randomBuffer.toString('hex');

        const oneTimeLink = `/reset/${randomToken}/${mailPerson._id}`
    
        await User.findOneAndUpdate({email:req.body.email},{resetToken:randomToken})
        sendResetMail(req.body.email,oneTimeLink);
    }
    res.render('account/password-sent');
    

}
//reset password email link
exports.getResetLink = async (req, res) =>{
    const user  = await User.findOne({_id : req.params.id});
    if(user.resetToken == req.params.token){
        res.render('account/new-password')
    }
}
exports.postResetLink = async (req, res) =>{
    if(req.body.newPassword === req.body.confirmPassword){

        const user  = await User.findOne({_id : req.params.id});
        user.password = req.body.newPassword;
        user.save()
        res.redirect('/login')
    }else{
        res.render('account/new-password',{warning:'parola uyuşmadı'});
    }


}