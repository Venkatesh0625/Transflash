const mysql = require('mysql');
const fs = require('fs');

module.exports = (req, res) => {
    var { car_id, station_id, number_plate } = req.body;
    var query;
    console.log(req.body);

    var database_auth = require('../public/config').database;

    var keys = JSON.parse(fs.readFileSync('./keys.json'));
    var vehicle_id = keys.vehicle_id;
    keys.vehicle_id++;
    fs.writeFileSync('keys.json', JSON.stringify(keys, undefined, 4));

    var connection = mysql.createConnection(database_auth);
    console.log('f');
    connection.connect((err) => {
        if(err) {
            res.render('addVehicle.ejs',{ error:'Server Unreachable' });
        } else {``
            query = `select * from cars where car_id = '${car_id}'`;
            connection.query(query, (err, rows, fields)=> {
                if(err) {
                    res.render('addVehicle.ejs', { error: 'Server error1'});
                    return;
                } else if(rows[0]) {
                    query = `select * from stations where station_id = '${station_id}'`;
                    connection.query(query, (err, rows, fields)=> {
                        if(err) {
                            console.log(err);
                            res.render('addVehicle.ejs', { error: 'Server error2'});
                            return;
                        } else if(rows[0]) {
                            query = `insert into vehicles values ('${vehicle_id}','${car_id}','${station_id}','${number_plate}','1')`;
                            connection.query(query, (err, rows, fields) => {
                                if(err) {
                                    res.render('addVehicle.ejs', { error: 'Server error3'});
                                    return;
                                } else {
                                    console.log(rows);
                                    res.render('agentHome.ejs', {
                                        user: 'Admin',
                                        error: ''
                                    });
                                }
                            })
                        } else {
                            res.render('addVehicle.ejs', { error: 'Station doesnt exist' });
                            return;
                        }
                    });
                } else {
                    res.render('addVehicle.ejs', { error: 'Car doesnt exist' });
                }
            });
        }       
    });
}