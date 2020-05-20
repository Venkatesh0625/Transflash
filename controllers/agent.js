module.exports = (req, res) => {
    if(req.session.agentlogin) {
        res.render('agentHome.ejs', {
            user: req.session.agentName,
            error: ''
        })
    } else {
        res.render('agentHome.ejs', {
            user: 'Login',
            error: ''
        });
    }
}