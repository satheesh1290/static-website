const express = require('express');
const router = express.Router();
const usercontroller=require('../controllers/usercontroller');
const passport = require('passport');
const catchAsync = require('../errorHandlers/catchAsync');
const {validateUser, storeReturnTo}=require('../models/middleware');
const User = require('../models/user');
const ExpressError=require('../errorHandlers/expresserror');


router.get('/register', usercontroller.registerForm);

router.post('/register', validateUser, catchAsync(usercontroller.newregisteredUser));

router.get('/login', usercontroller.loginForm);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usercontroller.loggedinUser)

router.get('/logout', usercontroller.logout); 

module.exports = router;