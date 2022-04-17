const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdministrator: {
        type: Boolean,
        default: false
    },
    friendList : [{
        type: Schema.Types.ObjectId,
        ref: 'Friend'
    }],
    allowedToPost : {
        type: Boolean,
        default: true
    }

});


exports.getUser = function() {
    return mongoose.model("User", userSchema)
}