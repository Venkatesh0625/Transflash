const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const sha256 = require('sha256');
const fs = require('fs');
/*
    Username: w7pcpfou2D
        Database name: w7pcpfou2D
            Password: K5SRNk9rx1
                Server: remotemysql.com
                    Port: 3306
*/

const validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var auth_str = fs.readFileSync('database_auth.json');
var database_auth = JSON.parse(auth_str);

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/script'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret:'o856y4h7h46y7',
    resave: true,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    console.log('Entered /');
	res.render('home.hbs',{
        user: 'Login',
        LoginOut: 'Signup',
        login_link: '/login'
    });
});

app.get('/login',(req,res) => {
    console.log('Entered login');
    if(req.session.loggedin != true) {
        res.render('login.hbs');
    } else {
        res.redirect('home');
    }
});

app.get('/signup',(req,res) => {
    console.log('Entered Signup');
    if(req.session.loggedin) {
        req.session.loggedin = false;
        res.redirect('home');
    }
    res.render('signup.hbs',{});
});

app.get('/forgot_password',(req,res) => {
    console.log('Entered forgot');
    res.render('forgot_password.hbs',{
        error:''
    });
})


app.post('/auth',(req,res) => {
    console.log("Entered auth");
    var username = req.body.user;
    var password = sha256(req.body.pass);
    console.log(username,password);
    if(username && password) {
        var connection = mysql.createConnection(database_auth);
        connection.connect((err) => {
            if(err) {
                console.error('Error:',err.message);
                res.render('login.hbs',{
                    error:'Server Unreachable'
                });
            } else {

                console.log('Connection Established');
                let query_prc = `select * from accounts where username="${username}" and passord="${password}"`;
                console.log(query_prc);
                connection.query(query_prc,(err,results,fields) => {
                    console.log(results);
                    if(err) {
                        console.log('error');
                    }
                    if(results.length > 0) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/home');
                    } else {
                        res.render('login.hbs',{
                            error:'Server Unreachable'
                        });
                    }
                });
            
                connection.end(() => {
                    if(err) {
                        return console.log(err.message);
                    }
                    console.log('Connection Ended');
                });
            }
        });
    } else {
        res.render('login.hbs',{
            error:'Username or password incorrect '
        });
    }
});

app.post('/signup',(req,res) => {
    var username = req.body.user;
    var name = req.body.name;
    var email = req.body.email;

    var password = req.body.pass;
    var hashedPassword = sha256(password);

    console.log(username,hasgedPassword,name,email,password);
    if(username.length < 8) {
        res.render('signup.hbs',{
            error:'Username : min 8 characters '
        });
    } else if(password.length < 8) {
        res.render('signup.hbs',{
            error:'Password : min 8 characters '
        });
    } else if(validateEmail(email) === false)
    {
        res.render('signup.hbs',{
            error:'not a valid email id'
        })
    } else {
        var connection = mysql.createConnection(database_auth);
        connection.connect((err) => {
            if(err) {
                console.error('Error:',err.message);
                res.render('signup.hbs',{
                    error:'Server Unreachable'
                });
            } else {
                console.log('Connection Established');
                var query_prc = `select * from accounts where username="${username}"`;
                console.log(query_prc);
                connection.query(query_prc,(err,results,fields) => {
                    console.log(results);
                    if(err) {
                        res.render('signup.hbs',{
                            error:'Server Unreachable'
                        });
                    } if(results.length > 0) {
                        res.render('signup.hbs',{
                            error: 'Username already exists'
                        });
                    } else {
                        query_prc = `insert into accounts values ("${name}","${username}","${email}","${hashedPassword}")`;
                        connection.query(query_prc,(err,results,fields) => {
                            if(err) {
                                console.log(err.message);
                            }
                            console.log('results');
                            req.session.username = username;
                            req.session.loggedin = true;
                            res.redirect('/home');
                        });
                    }
                });
            }
            
            connection.end(() => {
                if(err) {
                    return console.log(err.message);
                }
                console.log('Connection Ended');
            });
        });
    }
    
});


app.get('/home',(req,res) => {
    console.log("Enterd home",req.session.loggedin,req.session.username);
    if(req.session.loggedin) {
        res.render('home.hbs',{
            user: req.session.username,
            LoginOut: 'Logout'

        })
    } else {
        res.render('home.hbs',{
            user:'Login',
            LoginOut:'Signup',
            user_link: '/login'
        });
    }
});

app.listen(3000);