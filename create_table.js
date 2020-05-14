const mysql = require('mysql');
const fs = require('fs');

/*Username: w7pcpfou2D
Database name: w7pcpfou2D
Password: K5SRNk9rx1
Server: remotemysql.com
Port: 3306*/

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'w7pcpfou2D',
    password: 'K5SRNk9rx1',
    database: 'w7pcpfou2D'
});

var commands = Array('create table if not exists accounts ( name varchar(255) not null, username varchar(255) primary key, email varchar(100) not null, passord varchar(100) not null)'

, 'create table if not exists agents ( name varchar(255) not null, agent_id varchar(10) primary key, email varchar(100) not null, contact varchar(10) not null)'

, 'create table if not exists stations ( station_id varchar(10) primary key, name varchar(255) not null, contact varchar(10) not null, agent_id varchar(10) not null, foreign key (agent_id) references agents(agent_id))'

, 'create table if not exists cars ( car_id varchar(10) primary key, car_model varchar(100) not null, url varchar(255))'

, 'create table if not exists vehicles ( vehicle_id varchar(10) primary key, car_id varchar(10) not null, station_id varchar(10) not null, number_plate varchar(20) not null, avail varchar(2) not null , foreign key (car_id) references cars(car_id), foreign key (station_id) references stations(station_id))'

, 'create table if not exists booking ( booking_id varchar(10) primary key, vehicle_id varchar(10) not null, username varchar(255), from_station varchar(10) not null, to_station varchar(10) not null, start_time date not null, end_time date, foreign key (username) references accounts(username), foreign key (from_station) references stations(station_id), foreign key (to_station) references stations(station_id), foreign key (vehicle_id) references vehicles(vehicle_id))'

, 'create table if not exists rides ( username varchar(255) not null,booking_id varchar(10) not null, vehicle_id varchar(10) not null, from_station varchar(10) not null, to_station varchar(10) not null, start_time date , end_time date , foreign key (username) references accounts(username), foreign key (from_station) references stations(station_id), foreign key (to_station) references stations(station_id),  foreign key (vehicle_id) references vehicles(vehicle_id), foreign key (booking_id) references booking(booking_id))'
);

var startDate = "2020-05-04";
var endDate = "2020-05-09";
var endStation_id = "1005";
var startStation_id = "1005";
var commands = [` SELECT car_model, Count(*) AS count, url FROM cars, (SELECT vehicle_id, car_id, number_plate FROM vehicles WHERE ( avail = "1" AND station_id = '${startStation_id}' ) OR vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY end_time DESC) row_num FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' ))) AS tablet WHERE row_num = 1 AND to_station = '${startStation_id}' AND ( vehicle_id IN (SELECT vehicle_id FROM (SELECT *, Row_number() OVER ( partition BY vehicle_id ORDER BY start_time)row_num FROM booking WHERE start_time > '${endDate}') AS freq WHERE row_num = 1 AND from_station = '${endStation_id}' ) OR vehicle_id IN (SELECT table1.vehicle_id FROM (SELECT vehicle_id, Count(*) AS count FROM booking GROUP BY vehicle_id ) AS table1, (SELECT vehicle_id, Count(*) AS count FROM booking WHERE end_time < '${startDate}' AND vehicle_id NOT IN (SELECT vehicle_id FROM booking WHERE ( start_time <= '${endDate}' AND end_time >= '${endDate}' ) OR ( start_time <= '${startDate}' AND end_time >= '${startDate}' )) GROUP BY vehicle_id ) AS table2 WHERE table1.vehicle_id = table2.vehicle_id AND table1.count = table2.count) ))) AS table4 WHERE cars.car_id = table4.car_id GROUP BY table4.car_id `]

var commands = [`select booking.vehicle_id, car_model, from_station, to_station, start_time, end_time , number_plate from booking inner join vehicles on vehicles.vehicle_id = booking.vehicle_id inner join cars on cars.car_id = vehicles.car_id where username='Faker'`]
var commands = [`select * from accounts`]
connection.connect((err) => {
    if(err) {
        return console.error('Error:',err.message);
    }
    else {
        console.log('Connection Established')
    }

    commands.forEach((command) => {
        console.log(command);
        connection.query(command, (err,results,fields) => {
            if(err) {
                console.log(err.message);
            }
            console.log(results);
        });
    });

    connection.end(() => {
        if(err) {
            return console.log(err.message);
        }
        console.log('Connection Ended');
    });
});
