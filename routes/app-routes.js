const express = require('express');
const router = express.Router();
const controller = require('../controller/app-handlers');
const {requireAuth,withoutAuth, logoutMid} = require('../middleware/authMiddleware');


//Main page



//add new note get
router.get('/',requireAuth,controller.getAddNote);

// add new note post
router.post('/add-note',requireAuth,controller.postAddNote);


// add new user-Register
router.post('/register',withoutAuth,controller.postRegister);

router.get('/register',withoutAuth,controller.getRegister);



//login

router.post('/login',logoutMid,controller.postLogin);
router.get('/login',logoutMid,controller.getLogin);



//logout
router.get('/logout',controller.logout);


// note view
router.get('/note/:note_id',requireAuth,controller.getNoteViews);




// note edit
router.get('/note/edit/:note_id',requireAuth,controller.getNoteEdit);
router.post('/note/edit/:note_id',requireAuth,controller.postNoteEdit)




//reset password
router.get('/reset-password',logoutMid,controller.getResetPassword);
router.post('/reset-password',logoutMid,controller.postResetPassword);

// email sent link
router.get('/reset/:token/:id',logoutMid,controller.getResetLink);
router.post('/reset/:token/:id',logoutMid,controller.postResetLink);


module.exports = router;