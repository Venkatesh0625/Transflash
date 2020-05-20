const mysql = require('mysql');

module.exports = (req, res) => {
    console.log('addcars');
    console.log(req.body);
    var { car_id, car_model, url, amount } = req.body;
    
    var query_prc = `insert into cars values ('${car_id}','${car_model}','${url}',${amount})`

    var database_auth = require('../public/config').database;
    
    var connection = mysql.createConnection(database_auth);
    console.log("login");
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
                    res.render('addCar.ejs',{ error:'Server error' }); 
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


