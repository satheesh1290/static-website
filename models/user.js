const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const passportLocalMongoose=require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    email:String,
    phone: {
        type: Number
    },
    DOB:String,
    gender: {
        type:String        
    }
})


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);