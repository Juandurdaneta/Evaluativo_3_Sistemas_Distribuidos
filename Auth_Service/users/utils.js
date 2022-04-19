// jwt
const jwt = require('jsonwebtoken')

// dotenv config
require('dotenv').config();

// bcrypt config
const bcrypt = require('bcrypt');
const saltRounds = 10;

// user schema's
const userSchema = require('./models.js');
const User = userSchema.getUser();

// creating a new user

exports.createUser = function(data, res) {
    const { username, email, password } = data;
    

    const newUser = new User({
        username,
        email,
        password : password && bcrypt.hashSync(password, saltRounds)
    });


    newUser.save((err)=>{

        if(!err){
            res.send({
                status: 200,
                message: "User created successfully!"
            });
        } else {
            res.send({
                status: 400,
                message: "An error has occurred while creating your user. Please try again."
            });
        }

    });


};

// auth user with email and password

exports.authenticateUser = function(data, res){
    const { email, password } = data;

    User.findOne({email: email}, (err, user)=>{
        if(!err){
            if(user && bcrypt.compareSync(password, user.password)){
                signUser(user._doc, res);
            } else {
                res.send({
                    status: 400,
                    message: "Failed to authenticate, please check your credentials and try again."
                })
            }
        } 
    });
}

// validate email

exports.validateEmail = function(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      {
        return (true)
      }
        return (false)
}

// decode token

exports.getData = function(token){
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded
}

// get the profile of a user

exports.getProfile = function(userId, res){
    User.findOne({_id: userId}, {password:0}, (err, user)=>{
        if(!err && user){
            res.send({
                user
            });
        } else {
            res.send({
                status: 404,
                message: "Not found."
            });
        }
    })
}

// add a new friend

exports.addFriend = function(user, friendId, res){

    const areFriends = user.friendList.includes(friendId);



    if(user && !areFriends){
        User.findOneAndUpdate({_id: friendId}, {$push: {friendList: user._id}}, {new: true}, (err, user)=>{
            if(!err){
                console.log(user);
            } else {
                console.log(err);
            }
        } );

        User.findOneAndUpdate({_id: user._id}, {$push: {friendList: friendId}}, {new: true}, (err, user)=>{
            if(!err && user){
                signUser(user._doc, res);
            } else {
                res.send({
                    status: 400,
                    message: "An error has occurred, please try again."
                })
            }
        })


    } else if(areFriends){
        res.send({
            status: 400,
            message: "User are already friends."
        })
    }

    else {
        res.send({
            status: 403,
            message: "Invalid token or not provided. Please try again."
        })
    }

}

// block user from posting

exports.blockUser = function(currentUser, userId, res){
    const isAdmin = currentUser.isAdministrator;

    if(isAdmin){
        User.findOneAndUpdate({_id: userId}, {allowedToPost: false}, (err, user) =>{
            if(!err){
                res.send({
                    status: 200,
                    message: `Blocked user ${user._id} from posting`
                })
            } else {
                res.send({
                    status: 400,
                    message: 'An error has occurred.'
                })
            }
        })
    } else {
        res.send({
            status: 403,
            message: "You're not allowed to do that."
        })
    }
    
};

// delete user (admin only function)

exports.deleteUser = function(currentUser, userId, res){
    const isAdmin = currentUser.isAdministrator;
    if(isAdmin){
        User.findByIdAndDelete(userId, (err, user)=>{
            if(!err){
                res.send({
                    status: 200,
                    message: `User ${userId} successfully deleted.`
                });
            } else {
                res.send({
                    status: 500,
                    message: `An error has occourred. Log : ${err}`
                })
            }
        })
    } else {
        res.send({
            status: 403,
            message: "You're not authorized to do that.."
        })
    }
}


function signUser(userDoc, res){
    jwt.sign(userDoc, process.env.SECRET_KEY, (err, token)=>{
        if(!err){
            res.send({
                status: 200,
                token: token
            })
        } else {
            res.send(JSON.stringify(err));
        }
    })
}