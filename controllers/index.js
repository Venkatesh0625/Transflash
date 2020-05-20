module.exports = (req, res) => {
    
	res.render('home.ejs',{
        user: 'Login',
        LoginOut: 'Signup',
        login_link: '/login',
        error:''
    });
};
