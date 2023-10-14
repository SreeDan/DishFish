// import { NextRequest, NextResponse } from 'next/server'


const { User } = require( '../models/user');
// define routes here
// const connectDB = require('../db/conn')
const crypto = require('crypto')
const express = require('express');
const basicAuth = require('express-basic-auth')
const {Storage} = require('@google-cloud/storage');
const formidable = require('formidable')


const jwt = require('jsonwebtoken');
const uuid4 = require('uuid4');
const { Restaurant } = require('../models/restaurant');
const { Food } = require('../models/food');
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

router.post('/upload', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
          res.status(500).json({ error: 'File upload failed.' });
          return;
        }
    
        // Process the uploaded file (e.g., save it, handle it, etc.)
        // Access the uploaded file using `files` object.
        // Example: files.myFile.path
    
        res.status(200).json({ success: 'File uploaded successfully.' });
      });
    
})

// Define the home page route
router.get('/', function(req, res) {
    res.send('the user default route');
});


router.get('/food', async (req, res) => {
    var lat = req.body.latitude
    var long = req.body.longitude
    var maxDistance = req.body.maxDistance
    var budget = req.body.budget

    const restaurants = await Restaurant.find(
        {
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lat, long]
                    },
                    $maxDistance: maxDistance
                }
            }
        },
        {
            id: 1, 
            _id: 0
        }
        ).toArray()

    console.log(restaurants)
    res.send(200)
    
})

router.post('/food', async (req, res) => {
    const id = uuid4()
    var name = req.body.name
    var restaurantId = req.body.restaurantId
    var description = req.body.description
    var price = req.body.price

    const newFood = new Food({
        id: id,
        name: name,
        restaurantId: restaurantId,
        description: description,
        price: price
    })

    const insertedFood = await newFood.save()
    console.log(insertedFood)
    res.send(insertedFood)
})


router.post('/restaurant', async (req, res) => {
    var id = req.body.id
    var name = req.body.name
    var hours = req.body.hours
    var long = req.body.long
    var lat = req.body.lat

    const newRestaurant = new Restaurant({
        id: id,
        name: name,
        hours: hours,
        location: {
            type: 'Point',
            coordinates: [lat, long]
        }
    })


    const insertedRestaurant = await newRestaurant.save()
    console.log(insertedRestaurant)
    return res.send(201)
})

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

    console.log(authenticated)

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