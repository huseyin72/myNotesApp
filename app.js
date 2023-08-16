const express = require('express');
const app = express();
const routes = require('./routes/app-routes');
const bodyParser = require('body-parser')
const database = require('./database')
const mongoose = require('mongoose');
const User = require('./models/User');
const cookieParser = require('cookie-parser');
const path = require('path');
const { checkUser } = require('./middleware/authMiddleware');


async function startApp() {

    await mongoose.connect(database.uri)
        .then(() => {
            console.log('mongoose ile bağlanıldı')

        }).catch((err) => {
            console.log(err);

        });

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));



    // createUser();
    // async function createUser(){
    //     try{
    //         const user = await User.create({
    //             username:'Huseyin',
    //             email:'test@mail.com',
    //             password:'test'
    //         })
    //         session_user = user;
    //         console.log(user);

    //     }catch(err){
    //         console.log(err);

    //     }
    // }


    //middleware--------------------------

    //body parser
    app.use(bodyParser.json());

    //cookie
    app.use(cookieParser());

    //body parser
    app.use(bodyParser.urlencoded({ extended: true }));






    //app routes
    app.use('*', checkUser);
    app.use(routes)


    //Cookies
    app.get('/set-cookies', (req, res) => {
        //res.setHeader('set-cookie','newUser=true')
        res.cookie('newUser', false);
        res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
        res.send('you got the cookies');
    });


    app.get('/read-cookies', (req, res) => {
        const cookies = req.cookies;
        console.log(cookies);
        res.json(cookies);

    });




    // 404
    app.use((req, res, next) => {
        res.status(404).send("Sorry can't find that!")
    })




    const port = 3000
    app.listen(port, () => {
        console.log('connected to port');
    })
}


startApp();