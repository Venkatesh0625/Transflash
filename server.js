const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const app = express();

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



app.get('/', require('./handlers'));

app.get('/home',require('./handlers/home'));

app.get('/login', require('./handlers/login'));

app.get('/signup', require('./handlers/signup'));

app.post('/auth', require('./handlers/login_form'));

app.post('/signup',require('./handlers/signup_form'));

app.get('/booking',require('./handlers/booking'));

app.get('/track_booking',require('./handlers/track_booking'));

app.post('/booking', require('./handlers/booking_form'));

app.post('/choose_car', require('./handlers/choose_car'));


app.listen(3000);
