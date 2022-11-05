const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//routes middleware
app.use("/api/users",userRoute);

//Routes
app.get("/",(req,res) =>{
    res.send("Home Page");
});

//error middleware
app.use(errorHandler);
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