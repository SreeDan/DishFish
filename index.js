const bodyParser = require('body-parser');
const express = require('express')
const users = require('./server/routes/users')
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const connectDB = require('./server/db/conn');

dotenv.config()
const port = 3000

var app = express()

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// CORS for react
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    console.log(req.originalUrl)
    next();
});


app.use('/api/v1/users', users)

connectMongo().catch((err) => console.log(err));
async function connectMongo() {
  await connectDB();
}


app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})


// If /signin, /signup skip auth, else -> auth

