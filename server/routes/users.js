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
const uuid4 = require('uuid4');
const { Restaurant } = require('../models/restaurant');
const { Food } = require('../models/food');
const path = require('node:path'); 
var router = express.Router();
const dotenv = require('dotenv')
const util = require("util")
const { PythonShell } = require('python-shell')

dotenv.config()

const storage = new Storage({
    keyFilename: path.join(__dirname, "../../dish-fish-fdea20db28ac.json"),
    projectId: 'dish-fish'
}); // GCP Storage

const bucketName = process.env.GCP_BUCKET || '';

const cookieConfig = {
    httpOnly: true,
    secure: false, // enable this true if both server and website are https, otherwise it wont work
    maxAge: 1800,
    signed: false
}

router.use(async (req, res, next) => {
    const token = req.cookies.token
    
    if (req.originalUrl !== '/api/v1/users/signin' && req.originalUrl !== '/api/v1/users/signup') {
        if (token == null) return res.status(401).send()

        const parsedJWT = await jwt.verify(token, process.env.JWT_TOKEN_KEY)

        const user = await User.findOne({
            id: parsedJWT.id
        })

        res.locals.user = user

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, any) => {
            if (err != null) {
                return res.status(403).send()
            }
        })
    }
    next()
})

router.use('/rest/*', async (req, res, next) => {
    // const token = req.cookies.token

    const user = res.locals.user

    if (!user.roles.includes('rest')) {
        return res.status(401).json({
            message: "User is not a restaurant owner."
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
router.get('/', async (req, res) => {
    const restaurants = await Food.find({})

    res.send(restaurants);
});

router.get('/rest/', async (req, res) => {
    const restaurants = await Restaurant.find({})

    res.send(restaurants);
});

router.get('/all_food', async (req, res) => {
    const food = await Food.find({})
    res.send(food)
})

router.post('/food/get', async (req, res) => {
    var lat = req.body.latitude
    var long = req.body.longitude
    var maxDistance = req.body.maxDistance * 1609.344
    var budget = req.body.budget
    var query = req.body.query

    
    console.log(lat, long)
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
        )

        // console.log("restaurants")
        // console.log(restaurantIds)


    var restaurantIds = []

    for (let index = 0; index < restaurants.length; index++) {
        restaurantIds.push(restaurants[index].id)
    }

    const allFood = await Food.find(
        {
            restaurantId: {
                $in: restaurantIds
            },
            price: { $lte: budget }
        },
        {
            bucket: 0, pathToFile: 0
        }
    )

    const tags = res.locals.user.tag

    const userPreferences = tags.join(', ')

    // console.log("before call first functiion")

    // console.log(restaurantIds)

    // res.json(allFood)

    await furtherFilterFood(req, res, query, userPreferences, JSON.stringify(allFood), budget)
    
    
})

// filters food with the python trained model
async function furtherFilterFood(req, res, query, userPreferences, allFood, budget) {
    console.log("accessed")
    const options = {
        pythonPath: 'python3',
        scriptPath: '/home/sreekara/Projects/UpdatedDishFish/server/analysis',
        args: [query, userPreferences, allFood, budget]
    }

    PythonShell.run('analysis.py', options, (err, results) => {
        console.log("in function")
        if (err) {
            res.send(err)

        };

    }).then((value) => {
        console.log(value)
        res.send(JSON.parse(value[0]))
    })

    // res.send("exited")


    // var spawn = require("child_process").spawn

    // console.log("before call second functiion")
    
    // // server/analysis/analysis.py
    // var process = spawn('python', ['/home/sreekara/Projects/dish-fish/server/analysis/analysis.py'],
    //                     query, userPreferences, allFood, budget);

    // console.log("after call second functiion")
    
    
    
    // await process.stdout.on('data', function(data) { 
    //     console.log("reached")
    //     console.log(data)
    //     const buff = Buffer.from(data)
    //     const json = buff.toJSON()
    //     console.log(json)
    //     res.send(json); 
    // } )

    // process.stderr.on('data', (err) => {
    //     console.error(err)
    // })

    // process.on('close', (chunk) => {
    //     // var textChunk = chunk.toString('utf8');// buffer to string

    //     console.log(chunk)
    //     var textChunk = chunk.toString('utf8');// buffer to string

    //     console.log("python file closed")
    //     console.log(Buffer.from(data, 'utf-8').toString())
    //     res.json( {

    //         not: "good"
    //     }
            
    //     )
        
    // })

    // return {
    //     random: "stuf"
    // }


} 

router.post('/rest/food', async (req, res) => {
    const id = uuid4()
    var name = req.body.name
    var description = req.body.description
    var price = req.body.price
    var restaurant = req.body.restaurant
    var calories = req.body.calories
    var spicy = req.body.spicy
    var vegetarian = req.body.vegetarian
    var vegan = req.body.vegan
    var mealCategory = req.body.mealCategory
    var cuisine = req.body.cuisine

    const rest = await Restaurant.findOne({
        name: restaurant
    })

    var restaurantId = rest.id


    const newFood = new Food({
        id: id,
        name: name,
        restaurantId: restaurantId,
        description: description,
        price: price,
        bucket: bucketName,
        pathToFile: restaurantId + '/' + id + ".png",
        restaurant: restaurant,
        calories: calories,
        spicy: spicy,
        vegetarian: vegetarian,
        vegan: vegan,
        mealCategory: mealCategory,
        cuisine: cuisine
    })


    const insertedFood = await newFood.save()
    // console.log(insertedFood)
    res.send(insertedFood)
})


// router.put('/rest/food', async (req, res) => {
//     var name = req.body.name
//     var description = req.body.description
//     var price = req.body.price
//     var restaurant = req.body.restaurant
//     var calories = req.body.calories
//     var spicy = req.body.spicy
//     var vegetarian = req.body.vegetarian
//     var vegan = req.body.vegan
//     var mealCategory = req.body.mealCategory
//     var cuisine = req.body.cuisine

//     const rest = await Restaurant.findOne({
//         name: restaurant
//     })

//     var restaurantId = rest.id


//     const updatedFood = {
//         name: name,
//         restaurantId: restaurantId,
//         description: description,
//         price: price,
//         restaurant: restaurant,
//         calories: calories,
//         spicy: spicy,
//         vegetarian: vegetarian,
//         vegan: vegan,
//         mealCategory: mealCategory,
//         cuisine: cuisine
//     }


//     const insertedFood = await Food.findOneAndUpdate({name: name}, updatedFood)
//     // console.log(insertedFood)
//     res.send(insertedFood)
// })


// This is really bad. We are only doing this becuase the # of foods in the database is small, its a hackathon, and we wont need to regenerate hese url's
router.get('/rest/populate_signed_url_images', async (req, res) => {
    const allFood = await Food.find({})
    console.log(allFood)
    for (let index = 0; index < allFood.length; index++) {
        const food = allFood[index]
        console.log(index)
        if (food.signedURL === undefined) {
            console.log("before gen")
            const url = await generateV4ReadSignedUrl(food.bucket, food.pathToFile)
            console.log("after gen")
            console.log(food.pathToFile)
            food.signedURL = url
            await food.save()
        }
    }

    res.send(200)
})

router.post('/create/restaurant', async (req, res) => {
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
    var role = req.body.role

    console.log("username", username)
    console.log("password", password)
    console.log("role", role)

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha256`).toString(`hex`);
    const id = uuid4();
    
    const newUser = new User({
        id: id,
        username: username,
        password: hash,
        salt: salt,
        roles: [role],
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

    await addToList(tag_list, listOfTags)

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

async function generateV4ReadSignedUrl(bucket, filePath) {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 15 minutes
    };

    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket(bucket)
      .file(filePath)
      .getSignedUrl(options);
  
    return url
  }

module.exports = router;