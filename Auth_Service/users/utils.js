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

exports.validateEmail = function(email){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      {
        return (true)
      }
        return (false)
}

exports.getData = function(token){
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded
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