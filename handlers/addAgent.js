const mysql = require('mysql');
const sha256 = require('sha256');

module.exports = (req, res) => {
    console.log('addagent', req.body);

    var { name, agent_id, contact, pass } = req.body
    var query_prc = `insert into agents values ('${name}','${agent_id}','${contact}','${pass}')`;

    var database_auth = require('../public/config').database;
    
    var connection = mysql.createConnection(database_auth);
    connection.connect((err) => {
        if(err) {
            res.render('adminHome.ejs',{
                user:'Admin',
                error:'Server Unreachable'
            });
        } else {
            connection.query(query_prc, (err, result, fields) => {
                if(err) {
                    console.log(err);
                    res.render('addAgent.ejs',{ error:'Server error' }); 
                } else {
                    res.render('adminHome',{
                        user: 'Admin',
                        error: ''
                    });
                }
            }); 
        }
    });
};


