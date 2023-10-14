const { User } = require( '../models/user');

// define routes here
// const connectDB = require('../db/conn')
const crypto = require('crypto')
const express = require('express');
const basicAuth = require('express-basic-auth')

const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const uuid4 = require('uuid4')
var router = express.Router();

// router.use((req, res, next) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

// })

// Define the home page route
router.get('/', function(req, res) {
    res.send('the user default route');
});

router.post('/signin', async (req, res) => {
    var username = req.body.username
    var password = req.body.password

    let user = await User.find({
        
    }).exec()

    console.log(user.password)

    if (user === undefined) {
        res.status(400).json({
            message: "invalid username/password"
        })
        return
    }

    // let authenticated = isCorrectPassword(user.password, password, user.salt)

    // if (!authenticated) {
    //     res.status(400).json({
    //         message: "invalid username/password"
    //     })
    //     return
    // }



    // let jwt = generateAccessToken(user.id)



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
        username: "username9"
    })
    
    return res.status(201).json(checkUser)
    
    // let jwtToken = generateAccessToken(id)

    // res.status(201).json({
    //     success: true,
    //     // data: {id: id, token, jwtToken}
    // })
    
})

function generateAccessToken(id) {
    return jwt.sign(id, process.env.JWT_TOKEN_KEY, { expiresIn: '1800s' });
}

function isCorrectPassword(correctPassword, inputtedPassword, salt) {
    hashedInput = crypto.pbkdf2Sync(inputtedPassword, salt, 1000, 64, `sha256`).toString(`hex`)
    return hashedInput == correctPassword
}

module.exports = router;