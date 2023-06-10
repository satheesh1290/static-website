

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// cloudinary.uploader.upload(image, {timeout:60000}, function(error,result){});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'play',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

cloudinary.uploader.upload('image', {timeout:60000}, function(error,result){})

module.exports = {
    cloudinary,
    storage
}