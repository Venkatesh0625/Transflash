module.exports = (req,res) => {
    
    if(!req.session.adminlogin) {
        res.render('login.ejs',{
            post_link: '/admin_auth',
            error: ''});
    } else {
        res.redirect('admin');
    }
}