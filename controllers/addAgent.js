module.exports = (req, res) => {
    if(req.session.adminlogin) {
        res.render('addAgent.ejs',{ error:'' });
    } else {
        res.redirect('/admin');
    }
}