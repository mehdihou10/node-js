require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const url = process.env.MONGO_URL;


mongoose.connect(url).then(()=>{

    console.log('mongo server has started')
})


//express
const app = express();
const routerCourses = require('./routes/routes.courses');
const routerUsers = require('./routes/routes.users');

const path = require('path');

app.use(express.json())

app.use('/uploads',express.static(path.join(__dirname,'uploads')))

//cors
const cors = require('cors');
app.use(cors())


app.get('/',(req,res)=> res.send('<h1>Hello world</h1>'))



app.use('/api/courses',routerCourses);
app.use('/api/users',routerUsers);

app.all('*',(req,res)=>{
    res.status(404).json({message: "Not Found"})
})

app.use((error,req,res,next)=>{

    res.status(error.statusCode || 500).json({message: error.statusText || "ERROR",data: error.message})
})

app.listen(5000,()=>{

    console.log('Welcome To Mehdi Empire!');
})