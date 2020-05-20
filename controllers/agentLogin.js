module.exports = (req,res) => {
    
    if(!req.session.agentlogin) {
        res.render('login.ejs',{
            post_link: '/agent_login',
            error: ''});
    } else {
        res.redirect('/agent');
    }
}