const Play=require('../models/play');
const { cloudinary } = require("../cloudinary");

module.exports.playIndex=async (req, res) => {
    const plays = await Play.find({});
    res.render('play/index', { plays });
}

module.exports.playNew=(req, res)=>{
    res.render('play/new');
}

module.exports.playPost= async (req, res, next) => {
    const play = new Play(req.body.play);
   play.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    play.author = req.user._id;
    await play.save();
    // console.log(play);
    req.flash('success', 'Successfully made a new post!');
    res.redirect(`/plays/${play._id}`)
}

module.exports.playShow=async (req, res,) => {
    const {id} = req.params;
    const play = await Play.findById(id).populate({path: 'reviews',
    populate: {
        path: 'author'
    },
}).populate('author');

    if (!play) {
        req.flash('error', 'Cannot find that play!');
        return res.redirect('/plays');
    }
    res.render('play/show', { play });
}

module.exports.playEdit=async (req, res) => {
    const play = await Play.findById(req.params.id)
    if (!play) {
        req.flash('error', 'Cannot find that play!');
        return res.redirect('/plays');
    }
    res.render('play/edit', { play });
}
module.exports.playUpdate=async (req, res) => {
    const { id } = req.params;
    const play = await Play.findByIdAndUpdate(id, { ...req.body.play });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
   play.images.push(...imgs);
//    console.log(play);
    await play.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await play.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    
    req.flash('success', 'Successfully updated play!');
    res.redirect(`/plays/${play._id}`)
}

module.exports.playDelete=async (req, res) => {
    const { id } = req.params;
    await Play.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted play')
    res.redirect('/plays');
}

