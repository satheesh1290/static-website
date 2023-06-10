const express = require('express');
const router = express.Router({ mergeParams: true });

const Play=require('../models/play');
const Review = require('../models/review');


const {validateReview, isLoggedIn, isReviewAuthor}=require('../models/middleware');
const catchAsync = require('../errorHandlers/catchAsync');
const ExpressError=require('../errorHandlers/expresserror');

const reviewcontroller=require('../controllers/reviewcontroller');

router.post('/', isLoggedIn, validateReview,  catchAsync(reviewcontroller.reviewPost))

router.delete('/:reviewId',  isLoggedIn, isReviewAuthor, catchAsync(reviewcontroller.reviewDelete))

module.exports = router;