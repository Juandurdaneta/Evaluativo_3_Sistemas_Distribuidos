// jwt
const jwt = require('jsonwebtoken')

// dotenv config
require('dotenv').config();

// schema's
const postSchemas = require("./models");
const Post = postSchemas.getPost();
const Comment = postSchemas.getComment();


// decode token

exports.getData = function(token){
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded
}

// create post

exports.createPost = function(user, data, res){

    const newPost = new Post({
        data, 
        author: user._id
    });

    if(user.allowedToPost){
        newPost.save((err)=>{
            if(!err){
                res.send({
                    status: 200,
                    message: "Post created successfully"
                })
            } else {
                res.send({
                    status: 400,
                    message: "an error has occurred."
                })
            }
        })
    } else {
        res.send({
            status: 403,
            message: "You're not allowed to post."
        })
    }

}

// get every post

exports.getPosts = function(res){
    Post.find({}, (err, posts)=>{
        if(!err){
            res.send({
                posts
            });
        }
    });
};