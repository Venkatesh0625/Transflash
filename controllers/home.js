module.exports = (req,res) => {
    console.log("Enterd home");
    if(req.session.loggedin) {
        res.render('home.ejs',{user: req.session.username,LoginOut: 'Logout',user_link: "",error: 'hello'
        });
    } else {
        res.render('home.ejs',{
            user:'Login',
            LoginOut:'Signup',
            user_link: '/login',
            error: ''
        });
    }
}