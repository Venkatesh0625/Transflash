module.exports = (req, res) => {
    if(req.session.loggedin) {
        res.render('booking.ejs',{
            error: ''
        });
    } else {
        res.render('home.ejs',{
            user:'Login',
            LoginOut:'Signup',
            user_link: '/login',
            error: 'Login before you book'
        })
    }
}