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
           utils.getProfile(user._id, res);
        } else {
            res.send({
                status: 400,
                message: 'Invalid token, please try again.'
            })
        }
    } catch (error) {
        console.log(error)
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
        if(currentUser){
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

// unblock user from posting

router.put('/unblockUser/:userId', (req, res)=>{
    try {
        const currentUser = utils.getData(req.headers.authorization.split(" ")[1]);
        if(currentUser){
            utils.unblockUser(currentUser, req.params.userId, res);
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

// make admin

// router.post('/admin', (req,res)=>{
//     try{
//         const currentUser = utils.getData(req.headers.authorization.split(" ")[1]);
//         if(currentUser){
//             utils.makeAdministrator(currentUser, res);
//         }
//     } catch (error) {
//         res.send({
//             status: 400,
//             message: 'Invalid token or not provided, please try again.'
//         });
//     }
// })




module.exports = router;