const moment = require('moment');
const mysql = require('mysql');

module.exports =  (req, res) => {
    if(req.session.loggedin) {
        var query_prc;
        var database_auth = require('../public/config').database;

        var connection = mysql.createConnection(database_auth);
        
        connection.connect((err) => {
            if(err) {
                res.render('track_booking.ejs',{error:"Server unreacheable"});
            } else {
                query_prc = `select booking.vehicle_id, car_model, from_station, to_station, start_time, end_time , number_plate from booking inner join vehicles on vehicles.vehicle_id = booking.vehicle_id inner join cars on cars.car_id = vehicles.car_id where username='${req.session.username}'`;
                connection.query(query_prc, (err, result, fields) => {
                    if(err) {
                        res.render('track_booking.ejs',{error:"Server unreacheable"});
                    } else if(result.length === 0) {
                        res.render('track_booking.ejs', {error:'No booking still now'});
                    } else {
                        var data = result;
                        query_prc = `select station_id, name from stations`;
                        connection.query(query_prc, (err, result, fields) => {
                            if(err) {
                                res.render('track_booking.ejs',{error:"Server unreacheable"});
                            } else {
                                var stations = {};
                                for(var i=0;i < result.length; i++) {
                                    stations[result[i].station_id] = result[i].name;
                                }
                                console.log("in-here", stations);
                                for(var i=0;i < data.length; i++) {
                                    data[i].from_station = stations[data[i].from_station];
                                    data[i].to_station = stations[data[i].to_station];
                                    data[i].start_time = moment(String(data[i].start_time).slice(0,10)).format('ll');
                                    data[i].end_time  = moment(String(data[i].end_time).slice(0,10)).format('ll');
                                }
                                res.render('track_booking.ejs',{data});
                            }
                        });
                    }
                });   
            }
        });
    } else {
        res.render('home.ejs',{
            user: 'Login',
            LoginOut: 'Signup',
            login_link: '/login',
            error:'Login to view booking details'
        })
    }
}