const mysql = require('mysql');

module.exports =  (req,res) => {
    console.log('Entered booking', req.body);
    var startLocation = req.body.startLocation;
    var endLocation = req.body.endLocation;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var startStation_id, endStation_id;
    var database_auth = require('../public/config').database;

    req.session.booking = {
        startDate,
        endDate
    }

    var connection = mysql.createConnection(database_auth);
    
    connection.connect((err) => {
        if(err) {
            res.render(booking.ejs, {error:'Server unreachable'});
            res.send("error");
        } else {
            
            var query_prc = `select station_id from stations where name="${startLocation}"`;

            connection.query(query_prc, (err, result, fields) => {
                if(err) {
                    
                    delete req.session.booking;
                    res.render('booking.ejs', {error:'Server unreachable'});
                    //return res.send("error");
                } else if(result.length == 0) {
                    res.render('booking.ejs',{error: 'Stations not available'});
                    delete req.session.booking;
                    //return res.send("enter valid stations")
                } else {
                    req.session.booking.startLocation = result[0].station_id; 
                    startStation_id = result[0].station_id;
                    var query_prc = `select station_id from stations where name="${endLocation}"`
                    connection.query(query_prc, (err, result, fields) => {
                        if(err) {
                            delete req.session.booking;
                            res.render('booking.ejs', {error:'Server unreachable'});
                            //return res.send("error");
                        } else if(result.length == 0) {
                            res.render('booking.ejs',{error: 'Stations not available'});
                            //return res.send("enter valid stations")
                        } else {
                            req.session.booking.endLocation = result[0].station_id;
                            endStation_id = result[0].station_id;
                            query_prc = ` SELECT car_model, Count(*) AS count, url FROM cars, (SELECT vehicle_id, car_id, number_plate FROM vehicles WHERE ( avail = "1" AND station_id = '${startStation_id}' ) OR vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY end_time DESC) row_num FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' ))) AS tablet WHERE row_num = 1 AND to_station = '${startStation_id}' AND ( vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY start_time)row_num FROM booking WHERE start_time > '${endDate}') AS freq WHERE row_num = 1 AND from_station = '${endStation_id}' ) OR vehicle_id IN (SELECT table1.vehicle_id FROM (SELECT vehicle_id, Count(*) AS count FROM booking GROUP BY vehicle_id ) AS table1, (SELECT vehicle_id, Count(*) AS count FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' )) GROUP BY vehicle_id ) AS table2 WHERE table1.vehicle_id = table2.vehicle_id AND table1.count = table2.count) ))) AS table4 WHERE cars.car_id = table4.car_id GROUP BY table4.car_id`
                            connection.query(query_prc, (err, result, fields) => {
                                if(err) {
                                    res.render('booking.ejs',{ error: 'Server error' });
                                    //res.send("server error");
                                    delete req.session.booking;
                                } else if(result.length === 0) {
                                    res.send("No cars available");
                                } else {
                                    res.render('choose_car.ejs', {data:result});
                                    //res.send(result);
                                    console.log(req.session);
                                    console.log(result,"result mann");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}