const mysql = require('mysql');

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = (req,res) => {
    var username = req.body.user;
    var name = req.body.name;
    var email = req.body.email;

    var password = req.body.pass;
    var hashedPassword = password; //sha256(password);

    var database_auth = require('../public/config').database;

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
                    } else if(results.length > 0) {
                        res.render('signup.ejs',{
                            error: 'Username already exists'
                        });
                    } else {
                        query_prc = `insert into accounts values ("${name}","${username}","${email}","${hashedPassword}")`;
                        connection.query(query_prc,(err,results,fields) => {
                            if(err) {
                                console.log("Error", err);
                                res.redirect('/home');
                            } else {    
                            
                                req.session.username = username;
                                req.session.loggedin = true;
                                res.redirect('/home');
                            }
                        });
                    }
                });
            }
            
        });
    }
    
}