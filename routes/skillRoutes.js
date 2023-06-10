const express = require('express');
const router = express.Router();
const skillcontroller=require('../controllers/skillcontroller');
const mydata=require('../data.json');
const passport = require('passport');
const catchAsync = require('../errorHandlers/catchAsync');
const {isLoggedIn, storeReturnTo}=require('../models/middleware');
const User = require('../models/user');
const ExpressError=require('../errorHandlers/expresserror');


router.get('/', skillcontroller.home);

router.get('/rand', skillcontroller.rand);

router.get('/cats', skillcontroller.cats);

router.get('/info/:sq', skillcontroller.subreq);

module.exports = router;