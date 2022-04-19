const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }
})

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy:[{
        type: Schema.Types.ObjectId,
    }],
    comments: [commentSchema]

});


exports.getPost = function() {
    return mongoose.model("Post", postSchema)
}

exports.getComment = function(){
    return mongoose.model("Comment", commentSchema);
}