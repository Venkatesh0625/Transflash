module.exports = (req,res) => {
    
    if(req.session.loggedin != true) {
        res.render('login.ejs',{error: ''});
    } else {
        res.redirect('home');
    }
}