module.exports = (req,res) => {
    
    if(!req.session.adminlogin) {
        res.render('adminLogin.ejs',{error: ''});
    } else {
        res.redirect('admin');
    }
}