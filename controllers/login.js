module.exports = (req,res) => {
    
    if(req.session.loggedin != true) {
        res.render('login.ejs',{
            post_link: '/auth',
            error: ''});
    } else {
        res.redirect('/home');
    }
}