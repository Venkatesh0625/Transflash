module.exports = (req,res) => {
    
    if(req.session.loggedin) {
        delete req.session.loggedin;
        delete req.session.username;
        res.redirect('/home');
    } else {
        res.render('signup.ejs',{error: ''});
    }
}