// import { NextRequest, NextResponse } from 'next/server'


const { User } = require( '../models/user');
const { Tag } = require('../models/tag');
// define routes here
// const connectDB = require('../db/conn')
const crypto = require('crypto')
const express = require('express');
const {Storage} = require('@google-cloud/storage');
const formidable = require('formidable')


const jwt = require('jsonwebtoken');
const uuid4 = require('uuid4')
var router = express.Router();
const storage = new Storage(); // GCP Storage


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

// router.get('/all', async (req, res) => {
//     const form = new formidable.IncomingForm();
//     console.log(form)
//     const users = await User.find({})
//     return res.json(users)
// })

// router.post('/upload', async (req, res) => {
//     const form = new formidable.IncomingForm();
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//           res.status(500).json({ error: 'File upload failed.' });
//           return;
//         }
    
//         // Process the uploaded file (e.g., save it, handle it, etc.)
//         // Access the uploaded file using `files` object.
//         // Example: files.myFile.path
    
//         res.status(200).json({ success: 'File uploaded successfully.' });
//       });
    
// })

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

async function addToList(tag_list, listOfTags) {
    for (const tag of listOfTags) {
        const testTagExists = await Tag.findOne({
            name: tag
        })

        if (testTagExists === null) {
            console.log("tag", tag, "is undefined")
            const newTag = new Tag({
                id: uuid4(),
                name: tag
            })
            try {
                await newTag.save()
            } catch (e) {
                res.status(500).send()
            }
            tag_list.push(newTag.id)
        } else {
            console.log("tag", tag, "is defined")
            try {
                console.log(testTagExists.id)
                tag_list.push(testTagExists.id)
            } catch (e) {
                res.status(500).send()
            }
        }
    }
}

router.post('/addPassivePreferences', async (req, res) => {
    token = req.cookies.token
    listOfTags = req.body.tags

    const parseToken = await jwt.verify(token, process.env.JWT_TOKEN_KEY)

    // console.log(parseToken)
    const userID = parseToken.id

    // console.log(userID)
    const user = await User.findOne({id: userID})

    const tag_list = [...user.tag]
    console.log("before", tag_list)

    await addToList(tag_list, listOfTags)

    console.log("after", tag_list)

    user.tag = tag_list
    await user.save()

    return res.status(201).json({
        id: userID,
        success: true
    })
})

function generateAccessToken(id) {
    return jwt.sign({id: id}, process.env.JWT_TOKEN_KEY, { expiresIn: 3600 });
}

function isCorrectPassword(correctPassword, inputtedPassword, salt) {
    hashedInput = crypto.pbkdf2Sync(inputtedPassword, salt, 1000, 64, `sha256`).toString(`hex`)
    return hashedInput == correctPassword
}

module.exports = router;