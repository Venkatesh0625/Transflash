module.exports = (req, res) => {
    if(req.session.agentlogin) {
        res.render('addVehicle.ejs',{ error:'' });
    } else {
        res.redirect('/agent');
    }
}