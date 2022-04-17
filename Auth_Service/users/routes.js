const express = require('express');
const router = express.Router();

// utils
const utils = require('./utils');

// routes
// create new user
router.post('/register', (req, res)=>{
    utils.validateEmail(req.body.email) ? utils.createUser(req.body, res) : res.send({ status: 400, message: "Please enter a valid email" });
});

// authenticate user
router.post('/login', (req, res) =>{
    utils.authenticateUser(req.body, res);
});

// get user data from token
router.get('/', (req, res)=>{
    try {
        const user = utils.getData(req.headers.authorization.split(" ")[1]);
        if(user){
            res.send({
                status: 200,
                data: user
            })
        } else {
            res.send({
                status: 400,
                message: 'Invalid token, please try again.'
            })
        }
    } catch (error) {
        res.send({
            status: 400,
            message: 'Invalid token or not provided, please try again.'
        })
    }
});

// get user profile
router.get("/:userId", (req, res)=>{
    utils.getProfile(req.params.userId, res);
});

// add friend
router.put("/addFriend/:userId", (req, res)=>{
   
    try {
        const currentUser = utils.getData(req.headers.authorization.split(" ")[1]);
        if(user){
                utils.addFriend(currentUser,req.params.userId, res);
           
        } else {
            res.send({
                status: 400,
                message: 'Invalid token, please try again.'
            })
        }
    } catch (error) {
        res.send({
            status: 400,
            message: 'Invalid token or not provided, please try again.'
        })
    }

});

// block user from posting (admin)

router.put('/blockUser/:userId', (req, res)=>{
    try {
        const currentUser = utils.getData(req.headers.authorization.split(" ")[1]);
        if(currentUser){
            utils.blockUser(currentUser, req.params.userId, res);
        } else {
            res.send({
                status: 400,
                message: 'Invalid token, please try again.'
            })
        }
    } catch (error) {
        res.send({
            status: 400,
            message: 'Invalid token or not provided, please try again.'
        });
    }
});

// delete account (admin)

router.delete('/deleteUser/:userId', (req, res)=>{
    try {
        const currentUser = utils.getData(req.headers.authorization.split(" ")[1]);
        if(currentUser){
            utils.deleteUser(currentUser, req.params.userId, res);
        } else {
            res.send({
                status: 400,
                message: 'Invalid token, please try again.'
            })
        }
    } catch (error) {
        res.send({
            status: 400,
            message: 'Invalid token or not provided, please try again.'
        });
    }
})




module.exports = router;