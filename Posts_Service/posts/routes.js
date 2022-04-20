const express = require('express');
const router = express.Router();

// utils
const utils = require('./utils');

// routes
// create new post
router.post('/create', (req, res)=>{
    try {
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.createPost(user, req.body, res);  
    } catch (error) {
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
})

// get post

router.get('/:postId', (req, res)=>{
    utils.getPost(req.params.postId, res);
})

// get all posts

router.get('/', (req, res)=>{
    utils.getPosts(res);
})

// update post
router.put('/:postId', (req, res)=>{
    try {
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.updatePost(user, req.body, req.params.postId, res);  
    } catch (error) {
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
})

// delete post
router.delete('/:postId', (req, res)=>{
    try {
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.deletePost(user, req.params.postId, res);  
    } catch (error) {
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
})

// reactions, comments

// react to post

router.put('/:postId/like', (req, res)=>{
    try{
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.reactToPost(user, req.params.postId, res);
    } catch(err){
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
})

// comment under post

router.post('/:postId/comment', (req, res)=>{
    try{
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.commentPost(user, req.params.postId, req.body, res);
    } catch(err){
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
});

// update comment

// router.put('/:postId/comment/:commentId', (req, res)=>{
//     try{
//         const user = utils.getData(req.headers.authorization.split(" ")[1]);
//         utils.updateComment(user, req.params, req.body, res);
//     } catch(err){
//         res.send({
//             status: 403,
//             message: "Token not provided or invalid. Try again later."
//         })
//     }
// })

// delete comment

router.delete('/:postId/comment/:commentId', (req, res)=>{
    try{
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        utils.deleteComment(user, req.params, res);
    } catch(err){
        console.log(err)
        res.send({
            status: 403,
            message: "Token not provided or invalid. Try again later."
        })
    }
})

module.exports = router;