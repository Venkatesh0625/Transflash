module.exports = (req,res) => {
    console.log("Enterd home",req.session.loggedin,req.session.username);
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