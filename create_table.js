const mysql = require('mysql');

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
, 'create table if not exists booking ( booking_id varchar(10) primary key, vehicle_id varchar(10) not null, username varchar(255), from_station varchar(10) not null, to_station varchar(10) not null, start_time varchar(20) not null, end_time varchar(20) not null, foreign key (username) references accounts(username), foreign key (from_station) references stations(station_id), foreign key (to_station) references stations(station_id), foreign key (vehicle_id) references vehicles(vehicle_id))'
, 'create table if not exists rides ( username varchar(255), vehicle_id varchar(10) not null, from_station varchar(10) not null, to_station varchar(10) not null, start_time varchar(20) not null, end_time varchar(20) not null, foreign key (username) references accounts(username), foreign key (from_station) references stations(station_id), foreign key (to_station) references stations(station_id),  foreign key (vehicle_id) references vehicles(vehicle_id))'
);

commands = ['alter table accounts rename column passord to password']
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
            console.log(results,"hel;ll");
        });
    });

    connection.end(() => {
        if(err) {
            return console.log(err.message);
        }
        console.log('Connection Ended');
    });
});

