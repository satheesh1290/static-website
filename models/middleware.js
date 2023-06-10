const Play=require('../models/play');
const Review = require('../models/review');
const User=require('../models/user');
const sanitizeHtml = require('sanitize-html');

const { playSchema, reviewSchema, userSchema } = require('../schemas.js');

const catchAsync = require('../errorHandlers/catchAsync');
const ExpressError=require('../errorHandlers/expresserror');

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatePlay = (req, res, next) => {
    const { error } = playSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const play = await Play.findById(id);
    if (!play.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/plays/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/plays/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => { 
    // console.log(req.body);
    const value=req.body.username;
    const clean = sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
    });
    if(clean !== value)
    {
        req.flash('error', "Please Don't enter HTML Tags in input field");
        return res.redirect('/register');
    }else
        next();

}

