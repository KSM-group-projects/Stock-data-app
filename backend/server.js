const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())

//Routes
app.get("/",(req,res) =>{
    res.send("Home Page");
});

const PORT = process.env.PORT || 4056;

// connect to DB and start server

mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            app.listen(PORT,() => {
                console.log(`SERVER RUNNING ON PORT ${PORT}`)
            })
        })
        .catch((err) => console.log(err))