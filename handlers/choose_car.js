const mysql = require('mysql');
const schedule = require('node-schedule');
const fs = require('fs');

var ride_schedule = (data) => {
    connection = mysql.createConnection(database_auth);
    connection.connect((err) => {
        var query_prc = `insert into rides values("${data.username}","${data.booking_id}", "${data.vehicle_id}", "${data.from_station}", "${data.to_station}", "${data.start_time}","${data.end_time}")`;
        connection.query(query_prc, (err, result, fields) =>{
            return console.log('Scheduled Job done!!')
        });
    });
}

var pop_ride = (booking_id) => {
    connection = mysql.createConnection(database_auth);
    connection.connect((err) => {
        var query_prc = Array(`delete from rides where booking_id = '${booking_id}`,
                                `delete from booking where booking_id = '${booking_id}`);
        
        connection.query(query_prc[0], (err, result, field) => {
            console.log('Scheduled Job done!!')
        });

        connection.query(query_prc[1], (err, result, field) => {
            return console.log('Scheduled Job done!!')
        });
    });
}


module.exports = (req, res) => {
    console.log('Choose_car')
    console.log(req.session, req.body)
    if(req.session.booking) {
        
        console.log('Entered cars ', req.session.booking);
        var db_result;
        
        var startDate = req.session.booking.startDate;
        var endDate = req.session.booking.endDate;
        var database_auth = require('../public/config').database;

        query_prc = `SELECT vehicle_id, car_id, number_plate FROM vehicles WHERE ( avail = "1" AND station_id = '${req.session.booking.start}' ) OR vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY end_time DESC) row_num FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' ))) AS tablet WHERE row_num = 1 AND to_station = '${req.session.booking.startLocation}' AND ( vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY start_time)row_num FROM booking WHERE start_time > '${endDate}') AS freq WHERE row_num = 1 AND from_station = '${req.session.booking.endLocation}' ) OR vehicle_id IN (SELECT table1.vehicle_id FROM (SELECT vehicle_id, Count(*) AS count FROM booking GROUP BY vehicle_id) AS table1, (SELECT vehicle_id, Count(*) AS count FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' )) GROUP BY vehicle_id) AS table2 WHERE table1.vehicle_id = table2.vehicle_id AND table1.count = table2.count) ))`;
        
        var connection = mysql.createConnection(database_auth);
        var car_id;

        connection.query(`select car_id from cars where car_model = 'Mahindra Verito'`, (err, result, fields) => {
            if(err) {
                //res.render('choose_car.ejs',{error: "server unreacheable"});
                return res.send("server error1");
            } else {
                car_id = result[0].car_id;
                connection.query(query_prc, (err, result, fields) => {
                    if(err) {
                        //res.render('choose_car.ejs',{error: "server unreacheable"});
                        return res.send("server error2");
                    } else {
                        console.log(result);
                        for(i in result) {
                            
                            if (result[i].car_id === car_id) {
                                req.session.booking.vehicle_id = result[i].vehicle_id;
                                req.session.booking.number_plate = result[i].number_plate;
                                console.log(result[i]);
                                break;
                            }
                        }
        
                        var keys = fs.readFileSync('keys.json');
                        
                        keys = JSON.parse(keys);
                        console.log(keys.booking_id);
                        req.session.booking.booking_id = String(keys.booking_id);
                        keys.booking_id = keys.booking_id + 1;
                        fs.writeFileSync('keys.json', JSON.stringify(keys, undefined, 4));
                        query_prc = `insert into booking values("${req.session.booking.booking_id}", "${req.session.booking.vehicle_id}", "${req.session.username}", "${req.session.booking.startLocation}", "${req.session.booking.endStation_id}", "${req.session.booking.startDate}", "${req.session.booking.endDate}")`
                        connection.query(query_prc, (err, result, fields) => {
                            if(err) {
                                console.log(err);
                                res.render('booking.ejs', {error: "server error"});
                            } else {
                                res.send(`<h3>Booking Successful Track your order with the booking id : </h3>`) 
                                setTimeout(() => {
                                    //res.render('home.ejs',{error: "", login_link: "", LoginOut: "Logout", user: req.session.username});
                                }, 2000);

                                data = {
                                    username : req.session.username,
                                    booking_id : req.session.booking.booking_id,
                                    vehicle_id : req.session.booking.vehicle_id,
                                    from_station : req.session.booking.startStation_id,
                                    to_station : req.session.booking.endStation_id,
                                    start_time : req.session.booking.startDate,
                                    end_time : req.session.booking.endDate
                                }
                                
                                schedule.scheduleJob(data.start_time, ride_schedule.bind(null, data));
                                schedule.scheduleJob(data.end_time, pop_ride.bind(null, data.booking_id));
                            }
                        });
                    }
                });
            }
        });
        
    } else {
        res.redirect('/booking')
    }
}