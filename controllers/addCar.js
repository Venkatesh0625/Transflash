module.exports = (req, res) => {
    if(req.session.adminlogin) {
        res.render('addCar.ejs',{ 
            error:'' });
    } else {
        res.redirect('/admin');
    }
}