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

// get specific post

exports.getPost = function(postId, res){
    Post.findById(postId, (err, post)=>{
        if(!err && post){
            res.send({
                post
            });
        } else {
            res.send({
                status: 404,
                message: "Post not found"
            })
        }
    })
};

// update post

exports.updatePost = function(user, body, postId, res){
    if(user.allowedToPost){
        Post.findOneAndUpdate({_id: postId, author: user._id}, body,{new: true}, (err, post)=>{
            if(!err && post){
                res.send({
                    status: 200,
                    message: "Post was updated successfully!"
                })
            } else {
                res.send({
                    status: 400,
                    message: "Something went wrong.."
                });
            }
        })    
    }
}

// delete post

exports.deletePost = function(user, postId, res){
    if(!user.isAdministrator){
        Post.findOneAndDelete({_id: postId, author: user._id}, (err, post)=>{
            if(!err && post){
                res.send({
                    status:200,
                    message: "Post successfully deleted."
                })
            } else {
                res.send({
                    status: 500,
                    message: "Something went wrong",
                    error: err
                })
            }
        })
    } else {
        Post.findByIdAndDelete(postId, (err, post)=>{
            if(!err){
                res.send({
                    status: 200,
                    message: "Post successfully deleted."
                })
            } else {
                res.send({
                    status: 500,
                    message: "Something went wrong..",
                    error: err
                })
            }
        });
    }
};

// reactions to post

exports.reactToPost = function(user, postId, res){
    Post.findOneAndUpdate({_id: postId}, {$inc: {'likes': 1}, $push : {likedBy : user._id }}, (err, post) =>{
        if(!err){
            res.send({
                status: 200,
                message: 'Post liked!'
            })
        } else{
            res.send({
                status: 500,
                message: 'Something went wrong',
                error: err
            })
        }
    });
}

// post comment

exports.commentPost = function(user, postId, data, res){

    const newComment = new Comment({
        data,
        author : user._id
    });

    newComment.save((err)=>{
        if(!err){


            Post.findByIdAndUpdate(postId, {$push: {comments: newComment}}, {new: true} , (err, post)=>{
              if(!err){
                res.send({
                    status: 200,
                    message: "Comment posted successfully!"
                })
              } else {
                  res.send({
                      status: 500,
                      message: "Something went wrong..."
                  })
              }
            })


        } else {
            res.send({
                status: 500,
                message: "Something went wrong..."
            })
        }
    })

}