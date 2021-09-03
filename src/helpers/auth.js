const helpers = {}

helpers.isAuthenticated = (req,res,next) =>{
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg','No Autorizado');
    res.redirect('/login')
}
helpers.isNotAuthenticated = (req,res,next) =>{
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/resources')
}

module.exports = helpers;
