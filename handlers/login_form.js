const mysql = require('mysql');

module.exports = (req,res) => {

    var username = req.body.user;
    var password = req.body.pass;//sha256(req.body.pass);
    
    var database_auth = require('../public/config').database;
    
    var connection = mysql.createConnection(database_auth);
    console.log("login");
    connection.connect((err) => {
        if(err) {
            res.render('login.ejs',{
                error:'Server Unreachable'
            });
        } else {

            console.log('Connection Established');
            let query_prc = `select * from accounts where username="${username}" and password="${password}"`;
            connection.query(query_prc,(err,results,fields) => {
                console.log(results);
                if(err) {
                    console.log('error');
                    res.render('login.ejs',{
                        error:'Server error'
                    });
                } else if(results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                } else {
                    res.render('login.ejs',{error:'Server Unreachable'});
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
}