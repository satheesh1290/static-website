const Review=require('../models/review');
const Play=require('../models/play');

module.exports.reviewPost=async (req, res) => {
    
    const play = await Play.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    play.reviews.push(review);
    await review.save();
    await play.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/plays/${play._id}`);
}

module.exports.reviewDelete=async (req, res) => {
    const { id, reviewId } = req.params;
    await Play.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/plays/${id}`);
}