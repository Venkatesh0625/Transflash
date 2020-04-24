const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const sha256 = require('sha256');
const fs = require('fs');
const getArray = require('./utils/readasArray')
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

app.set('view engine', 'ejs');
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
    console.log(req.headers);
    console.log('Entered /');
	res.render('home.ejs',{
        user: 'Login',
        LoginOut: 'Signup',
        login_link: '/login'
    });
});

app.get('/login',(req,res) => {
    console.log('Entered login');
    if(req.session.loggedin != true) {
        res.render('login.ejs',{
            error: ''
        });
    } else {
        res.redirect('home');
    }
});

app.get('/signup',(req,res) => {
    console.log('Entered Signup');
    if(req.session.loggedin) {
        req.session.loggedin = false;
        res.redirect('home');
    } else {
        res.render('signup.ejs',{
            error: ''
        });
    }
});

app.get('/forgot_password',(req,res) => {
    console.log('Entered forgot');
    res.render('forgot_password.ejs',{
        error:''
    });
})


app.post('/auth',(req,res) => {
    console.log("Entered auth");
    var username = req.body.user;
    var password = req.body.pass;//sha256(req.body.pass);
    console.log(username,password);
    if(username && password) {
        var connection = mysql.createConnection(database_auth);
        connection.connect((err) => {
            if(err) {
                console.error('Error:',err.message);
                res.render('login.ejs',{
                    error:'Server Unreachable'
                });
            } else {

                console.log('Connection Established');
                let query_prc = `select * from accounts where username="${username}" and passord="${password}"`;
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
                        res.render('login.ejs',{
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
        res.render('login.ejs',{
            error:'Username or password incorrect '
        });
    }
});

app.post('/signup',(req,res) => {
    var username = req.body.user;
    var name = req.body.name;
    var email = req.body.email;

    var password = req.body.pass;
    var hashedPassword = password; //sha256(password);

    console.log(username,hashedPassword,name,email,password);
    if(username.length < 8) {
        res.render('signup.ejs',{
            error:'Username : min 8 characters '
        });
    } else if(password.length < 8) {
        res.render('signup.ejs',{
            error:'Password : min 8 characters '
        });
    } else if(validateEmail(email) === false)
    {
        res.render('signup.ejs',{
            error:'not a valid email id'
        })
    } else {
        var connection = mysql.createConnection(database_auth);
        connection.connect((err) => {
            if(err) {
                console.error('Error:',err.message);
                res.render('signup.ejs',{
                    error:'Server Unreachable'
                });
            } else {
                console.log('Connection Established');
                var query_prc = `select * from accounts where username="${username}"`;
                console.log(query_prc);
                connection.query(query_prc,(err,results,fields) => {
                    console.log(results);
                    if(err) {
                        res.render('signup.ejs',{
                            error:'Server Unreachable'
                        });
                    } if(results.length > 0) {
                        res.render('signup.ejs',{
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
        res.render('home.ejs',{
            user: req.session.username,
            LoginOut: 'Logout'

        })
    } else {
        res.render('home.ejs',{
            user:'Login',
            LoginOut:'Signup',
            user_link: '/login'
        });
    }
});
/*
app.get('/forgot_password',(req,res) => {
    console.log('Entered forgot');
    var rand = paseInt(Math.random()*10**6);
    res.render('forgot_password.ejs',{
        interface : Enter OTP;
    })
});*/

app.get('/booking', (req,res) => {
    console.log('booking get')
    res.render('booking.ejs',{
        booked: true
    });
})
app.post('/booking', (req,res) => {
    console.log('Entered booking', req.body);
    var startLocation = req.body.startLocation;
    var endLocation = req.body.endLocation;
    var startDate = new Date(String(req.body.startDate));
    var endDate = new Date(String(req.body.endDate));
    var connection = mysql.createConnection(database_auth);

    var flag = true;
    connection.connect((err) => {
        if(err) {
            console.log('Error:',err.message);
            res.render(booking.ejs, {
                error:'Server unreachable'
            });
        } else {
            console.log('Connection established');
            var query_prc = Array(`select * from stations where station="${startLocation}"`,
                                `select * from stations where station="${endLocation}`);

            query_prc.forEach((_query) => {
                connection.query(_query, (err, result, fields) => {
                    console.log(results);
                    if(err) 
                        res.render('booking.ejs', {
                            error:'Server unreachable'
                        });
                    else if(result.length == 0)
                            flag = false;
                    }
                });
            }
            query_prc = `select from stations`
            query_prc = `insert into bookings values("${startLocation}", "${endLocation}", "${startDate}", "${endDate}")`;
        });
    });


})

app.listen(3000);
