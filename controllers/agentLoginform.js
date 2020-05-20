const sha256 = require('sha256');
const mysql = require('mysql');

module.exports = (req,res) => {
    console.log('Entered');
    var username = req.body.user;
    var password = sha256(req.body.pass);
    
    var database_auth = require('../public/config').database;
    
    var connection = mysql.createConnection(database_auth);
    console.log(username, password);
    connection.connect((err) => {
        if(err) {
            res.render('login.ejs',{
                post_link:'/admin_login',
                error:'Server Unreachable'
            });
        } else {

            console.log('Connection Established');
            let query_prc = `select * from agents where agent_id="${username}" and password="${password}"`;
            connection.query(query_prc,(err,results,fields) => {
                console.log(results);
                if(err) {
                    console.log('error');
                    res.render('login.ejs',{
                        post_link:'/agent_login',
                        error:'Server error'
                    });
                } else if(results.length > 0) {
                    req.session.agentlogin = true;
                    req.session.agentName = results[0].name;
                    res.redirect('/agent');
                } else {
                    res.render('login.ejs',{
                        post_link:'/agent_link',
                        error:'Server Unreachable'});
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