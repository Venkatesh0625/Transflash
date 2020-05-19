const sha256 = require('sha256');
const mysql = require('mysql');

module.exports = (req,res) => {
    console.log('Entered');
    var username = req.body.user;
    var password = sha256(req.body.pass);
    
    var database_auth = require('../public/config').database;
    
    var connection = mysql.createConnection(database_auth);
    console.log("Admin login");
    connection.connect((err) => {
        if(err) {
            res.render('adminLogin.ejs',{
                error:'Server Unreachable'
            });
        } else {

            console.log('Connection Established');
            let query_prc = `select * from admin where username="${username}" and password="${password}"`;
            connection.query(query_prc,(err,results,fields) => {
                console.log(results);
                if(err) {
                    console.log('error');
                    res.render('adminLogin.ejs',{
                        error:'Server error'
                    });
                } else if(results.length > 0) {
                    req.session.adminlogin = true;
                    
                    res.redirect('/admin');
                } else {
                    res.render('adminLogin.ejs',{error:'Server Unreachable'});
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