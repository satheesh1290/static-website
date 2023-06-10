const express = require('express');
const router = express.Router();

const catchAsync = require('../errorHandlers/catchAsync');
const {isLoggedIn, isAuthor, validatePlay}=require('../models/middleware');
const Play=require('../models/play');

const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

const playcontroller=require('../controllers/playcontroller');

router.get('/', catchAsync(playcontroller.playIndex));

router.get('/new', isLoggedIn, playcontroller.playNew);

router.post('/',isLoggedIn,  upload.array('image'), validatePlay, catchAsync(playcontroller.playPost));

// router.post('/', upload.array('image'), (req, res)=>{
//     console.log(req.files)
//     res.send('it worked');
// })

    router.route('/:id')
    .get(catchAsync(playcontroller.playShow))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePlay, catchAsync(playcontroller.playUpdate))
    .delete(isLoggedIn, isAuthor, catchAsync(playcontroller.playDelete))

    router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(playcontroller.playEdit));





module.exports = router;