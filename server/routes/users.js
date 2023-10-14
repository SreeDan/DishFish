const { User } = require( '../models/user');

// define routes here
// const connectDB = require('../db/conn')
const crypto = require('crypto')
const express = require('express');
const basicAuth = require('express-basic-auth')

const jwt = require('jsonwebtoken');
const uuid4 = require('uuid4')
var router = express.Router();

const cookieConfig = {
    httpOnly: true,
    secure: false, // enable this true if both server and website are https, otherwise it wont work
    maxAge: 1800,
    signed: false  
}


router.use((req, res, next) => {
    const token = req.cookies.token
    
    if (req.originalUrl !== '/api/v1/users/signin' && req.originalUrl !== '/api/v1/users/signup') {
        if (token == null) return res.status(401).send()

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, any) => {
            if (err != null) {
                return res.status(403).send()
            }
        })
    }
    next()

})

// Define the home page route
router.get('/', function(req, res) {
    res.send('the user default route');
});

router.post('/signin', async (req, res) => {
    var username = req.body.username
    var password = req.body.password

    const user = await User.findOne({
        username: username
    })

    if (user === undefined) {
        return res.status(400).json({
            message: "invalid username/password"
        })   
    }
    
    let authenticated = isCorrectPassword(user.password, password, user.salt)

    if (!authenticated) {
        return res.status(400).json({
            message: "invalid username/password"
        })
    }

    let jwtToken = generateAccessToken(user.id)

    // res.cookie('token', jwtToken, cookieConfig)

    return res.status(201)
    .cookie('token', jwtToken, cookieConfig)
    .json({
        success: true,
        id: user.id
    })    

})

router.post('/signup', async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    console.log(username)
    console.log(password)

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha256`).toString(`hex`);
    const id = uuid4();
    
    const newUser = new User({
        id: id,
        username: username,
        password: hash,
        salt: salt,
        tag: []
    })
        
    const insertedUser = await newUser.save()

    const checkUser = await User.find({
        username: insertedUser.username
    })

    let jwtToken = generateAccessToken(id)

    res.cookie('token', jwtToken, cookieConfig)

    return res.status(201).json({
        success: true,
        id: checkUser.id
    })    
    
    
})

function generateAccessToken(id) {
    return jwt.sign({id: id}, process.env.JWT_TOKEN_KEY, { expiresIn: 1800 });
}

function isCorrectPassword(correctPassword, inputtedPassword, salt) {
    hashedInput = crypto.pbkdf2Sync(inputtedPassword, salt, 1000, 64, `sha256`).toString(`hex`)
    return hashedInput == correctPassword
}

module.exports = router;