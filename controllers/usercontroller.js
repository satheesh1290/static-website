const User = require('../models/user');


module.exports.registerForm=(req, res) => {
    const ns='Welcome you to Build better Tomorrow';
    res.render('user/register', {n: ns});
}

module.exports.newregisteredUser=async (req, res, next) => {
    try{
        const { password, email, username, phone, DOB} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err){
                return next(err);
            } 
            req.flash('success', 'Welcome to SKill Institute!');
            res.redirect('/login');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm=(req, res) => {
    res.render('user/login');
}

module.exports.loggedinUser= (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}