const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');
const ejs = require('ejs');
const sha256 = require('sha256');
const fs = require('fs');
//const getArray = require('./utils/readasArray')
/*
    Username: w7pcpfou2D
        Database name: w7pcpfou2D
            Password: K5SRNk9rx1
                Server: remotemysql.com
                    Port: 3306
*/

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



console.log("added");

const validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

var auth_str = fs.readFileSync('database_auth.json');
var database_auth = JSON.parse(auth_str);

var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/script'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret:'o856y4h7h46y7',
    resave: true,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    console.log(req.headers);
    console.log('Entered /');
	res.render('home.ejs',{
        user: 'Login',
        LoginOut: 'Signup',
        login_link: '/login',
        error:'hello'
    });
});

app.get('/login',(req,res) => {
    console.log('Entered login');
    if(req.session.loggedin != true) {
        res.render('login.ejs',{error: ''});
    } else {
        res.redirect('home');
    }
});

app.get('/signup',(req,res) => {
    console.log(req.session)
    if(req.session.loggedin) {
        req.session.loggedin = false;
        res.redirect('/home');
    } else {
        res.render('signup.ejs',{error: ''});
    }
});

app.get('/forgot_password',(req,res) => {
    console.log('Entered forgot');
    res.render('forgot_password.ejs',{error:''});
})


app.post('/auth',(req,res) => {

    console.log("Entered auth");
    var username = req.body.user;
    var password = req.body.pass;//sha256(req.body.pass);
    console.log(username,password);
    var connection = mysql.createConnection(database_auth);
    connection.connect((err) => {
        if(err) {
            console.error('Error:',err.message);
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

});

app.post('/signup',(req,res) => {
    var username = req.body.user;
    var name = req.body.name;
    var email = req.body.email;

    var password = req.body.pass;
    var hashedPassword = password; //sha256(password);

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
                    } if(results.length > 0) {
                        res.render('signup.ejs',{
                            error: 'Username already exists'
                        });
                    } else {
                        query_prc = `insert into accounts values ("${name}","${username}","${email}","${hashedPassword}")`;
                        connection.query(query_prc,(err,results,fields) => {
                            if(err) {
                                console.log(err.message);
                            }
                            console.log('results');
                            req.session.username = username;
                            req.session.loggedin = true;
                            res.redirect('/home');
                        });
                    }
                });
            }
            
            connection.end(() => {
                if(err) {
                    return console.log(err.message);
                }
                console.log('Connection Ended');
            });
        });
    }
    
});

app.get('/track_booking', (req, res) => {
    if(req.session.loggedin) {
        res.render('track_booking.ejs',{error: ""});
    } else {
        redirect('/home');
    }
});

app.post('/track_booking', (req, res) => {
    var booking_id = req.body.booking_id;
    var query_prc;
    var connection = mysql.createConnection(database_auth)
    connection.connect((err) => {
        if(err) {
            res.render('track_booking.ejs',{error:"Server unreacheable"});
        } else {
            query_prc = `select * from booking where booking_id = '${booking_id}' and username = '${req.session.username}`;
            connection.query(query_prc, (err, result, fields) => {
                if(err) {
                    res.render('track_booking.ejs',{error:"Server unreacheable"});
                } else if(results.length === 0) {
                    res.render('track_booking.ejs', {error:'Booking is invalid or expired '})
                } else {
                    var data = result[0];
                    query_prc = `select name from stations where station_id = '${data.from_station}'`;
                    connection.query(query_prc, (err, result, fields) => {
                        if(err) {
                            res.render('track_booking.ejs',{error:"Server unreacheable"});
                        } else {
                            data.from_station = result.name;
                            query_prc = `select name from stations where station_id = '${data.to_station}'`;
                            connection.query(query_prc, (err, result, fields) => {
                                if(err) {
                                    res.render('track_booking.ejs',{error:"Server unreacheable"});
                                } else {
                                    data.to_station = result.name;
                                    res.render('display_booking.ejs', data);
                                }
                            });
                        }
                    });
                }
            });   
        }
    });
});


app.get('/home',(req,res) => {
    console.log("Enterd home",req.session.loggedin,req.session.username);
    if(req.session.loggedin) {
        res.render('home.ejs',{user: req.session.username,LoginOut: 'Logout',user_link: "",error: 'hello'
        });
    } else {
        res.render('home.ejs',{
            user:'Login',
            LoginOut:'Signup',
            user_link: '/login',
            error: 'hello'
        });
    }
});
/*
app.get('/forgot_password',(req,res) => {
    console.log('Entered forgot');
    var rand = paseInt(Math.random()*10**6);
    res.render('forgot_password.ejs',{
        interface : Enter OTP;
    })
});*/

// app.get('/booking', (req,res) => {
//     console.log('booking get')
//     if(req.session.loggedin) { 
//         res.render('booking.ejs',{error:""});
//     } else {
//         res.render('home.ejs',{error:"Login before signup", user : "Login", LoginOut : "Signup", user_link: ''});
//     }
// });

app.get('/choose_car', (req, res) => {
    if(req.session.booking) {
        res.render('choose_car.ejs',{error: ""});
    } else {
        res.redirect('/booking');
    }
});

app.post('/choose_car',(req, res) => {
    console.log(req.session, req.body)
    if(true) {
        console.log('Entered cars ', req.session.booking);
        var db_result;
        req.session.username = 'Faker';
        req.session.booking = {};
        req.session.booking.startStation_id = "1002";//req.session.booking.startLocation;
        req.session.booking.endStation_id = "1003";//req.session.booking.endLocation;
        req.session.booking.startDate = "2020-04-26"//req.session.booked.startDate;
        req.session.booking.endDate = "2020-05-01"//req.session.booked.endDate;
        var startDate = req.session.booking.startDate;
        var endDate = req.session.booking.endDate;

        query_prc = `SELECT vehicle_id, car_id, number_plate FROM vehicles WHERE ( avail = "1" AND station_id = '${req.session.booking.startStation_id}' ) OR vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY end_time DESC) row_num FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' ))) AS tablet WHERE row_num = 1 AND to_station = '${req.session.booking.startStation_id}' AND ( vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY start_time)row_num FROM booking WHERE start_time > '${endDate}') AS freq WHERE row_num = 1 AND from_station = '${req.session.booking.endStation_id}' ) OR vehicle_id IN (SELECT table1.vehicle_id FROM (SELECT vehicle_id, Count(*) AS count FROM booking GROUP BY vehicle_id) AS table1, (SELECT vehicle_id, Count(*) AS count FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' )) GROUP BY vehicle_id) AS table2 WHERE table1.vehicle_id = table2.vehicle_id AND table1.count = table2.count) ))`;
        
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
                        return res.send("serrver error2");
                    } else {
                        for(i in result) {
                            
                            if (result[i].car_id === car_id) {
                                req.session.booking.vehicle_id = result[i].car_id;
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
                        query_prc = `insert into booking values("${req.session.booking.booking_id}", "${req.session.booking.vehicle_id}", "${req.session.username}", "${req.session.booking.startStation_id}", "${req.session.booking.endStation_id}", "${req.session.booking.startDate}", "${req.session.booking.endDate}")`
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
});

app.post('/booking', (req,res) => {
    console.log('Entered booking', req.body);
    var startLocation = req.body.startLocation;
    var endLocation = req.body.endLocation;
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var startStation_id, endStation_id;

    req.session.booking = {
        startDate,
        endDate
    }

    var connection = mysql.createConnection(database_auth);
    
    connection.connect((err) => {
        if(err) {
            //res.render(booking.ejs, {error:'Server unreachable'});
            res.send("error");
        } else {
            
            var query_prc = `select station_id from stations where name="${startLocation}"`;

            connection.query(query_prc, (err, result, fields) => {
                if(err) {
                    
                    delete req.session.booking;
                    //res.render('booking.ejs', {error:'Server unreachable'});
                    return res.send("error");
                } else if(result.length == 0) {
                    //res.render('booking.ejs',{error: 'Stations not available'});
                    delete req.session.booking;
                    return res.send("enter valid stations")
                } else {
                    req.session.booking.startLocation = result[0].station_id; 
                    startStation_id = result[0].station_id;
                    var query_prc = `select station_id from stations where name="${endLocation}"`
                    connection.query(query_prc, (err, result, fields) => {
                        if(err) {
                            delete req.session.booking;
                            //res.render('booking.ejs', {error:'Server unreachable'});
                            return res.send("error");
                        } else if(result.length == 0) {
                            //res.render('booking.ejs',{error: 'Stations not available'});
                            return res.send("enter valid stations")
                        } else {
                            req.session.booking.endLocation = result[0].station_id;
                            endStation_id = result[0].station_id;
                            query_prc = ` SELECT car_model, Count(*) AS count, url FROM cars, (SELECT vehicle_id, car_id, number_plate FROM vehicles WHERE ( avail = "1" AND station_id = '${startStation_id}' ) OR vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY end_time DESC) row_num FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' ))) AS tablet WHERE row_num = 1 AND to_station = '${startStation_id}' AND ( vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY start_time)row_num FROM booking WHERE start_time > '${endDate}') AS freq WHERE row_num = 1 AND from_station = '${endStation_id}' ) OR vehicle_id IN (SELECT table1.vehicle_id FROM (SELECT vehicle_id, Count(*) AS count FROM booking GROUP BY vehicle_id ) AS table1, (SELECT vehicle_id, Count(*) AS count FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' )) GROUP BY vehicle_id ) AS table2 WHERE table1.vehicle_id = table2.vehicle_id AND table1.count = table2.count) ))) AS table4 WHERE cars.car_id = table4.car_id GROUP BY table4.car_id`
                            connection.query(query_prc, (err, result, fields) => {
                                if(err) {
                                    //res.render('booking.ejs',{ error: 'Server error' });
                                    res.send("server error");
                                    delete req.session.booking;
                                } else if(result.length === 0) {
                                    res.send("No cars available")
                                } else {
                                    //res.render('choose_car.ejs', results);
                                    res.send(result);
                                    console.log(req.session);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// app.post('/add_vehicle', (req, res) => {
//     var car_model = req.body.car_model;
//     var station = req.body.station;
//     var connection = mysql.createConnection('database_auth.json');
//     var query_prc = `select * from cars where car_model = '${car_model}'`;
//     connection.connect(query_prc, (req, res) => {

//     });

// });
app.listen(3000);
