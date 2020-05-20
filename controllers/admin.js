module.exports = (req, res) => {
    if(req.session.adminlogin) {
        res.render('adminHome.ejs', {
            user: 'Admin',
            error: ''
        })
    } else {
        res.render('adminHome.ejs', {
            user: 'Login',
            error: ''
        });
    }
}