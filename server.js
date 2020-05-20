const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/script'));

app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

app.use(session({
    secret:'o856y4h7h46y7',
    resave: true,
    saveUninitialized: true
}));



app.get('/', require('./controllers'));

app.get('/home',require('./controllers/home'));

app.get('/admin',require('./controllers/admin'));

app.get('/agent', require('./controllers/agent'));

app.get('/login', require('./controllers/login'));

app.get('/signup', require('./controllers/signup'));

app.post('/auth', require('./controllers/login_form'));

app.post('/signup',require('./controllers/signup_form'));

app.get('/booking',require('./controllers/booking'));

app.get('/add_car', require('./controllers/addCar'));

app.post('/add_car', require('./controllers/addCarform'));

app.get('/admin_login', require('./controllers/adminLogin'));

app.post('/admin_auth', require('./controllers/adminLoginform'));

app.get('/agent_login', require('./controllers/agentLogin'));

app.get('/track_booking',require('./controllers/track_booking'));

app.post('/booking', require('./controllers/booking_form'));

app.post('/choose_car', require('./controllers/choose_car'));

app.post('/add_agent', require('./controllers/addAgentform'));

app.get('/add_agent', require('./controllers/addAgent'));

app.post('/add_vehicle', require('./controllers/addVehicleform'));

app.get('/add_vehicle', require('./controllers/addVehicle'));

app.post('/agent_login', require('./controllers/agentLoginform'));

app.listen(port, () => {
    console.log('App is up on port',port);
});
