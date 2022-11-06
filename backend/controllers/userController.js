const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
};

// register user
const registerUser = asyncHandler ( async (req,res) =>{
    const {name,email,password} = req.body
    //validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    if(password.length < 6){
        res.status(400)
        throw new Error("Password length must be between 6 - 23 characters");
    }
    //check id users email already exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("The Email as been already been registered!");
    }

    //create new user
    const user = await User.create({
        name,
        email,
        password,
    })

    //Generate Token
    const token = generateToken(user._id);
    
    //send HTTP-only cookie
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        expires: new Date(Date.now()+1000 * 86400), // 1day
        sameSite:"none",
        secure:true,
    });
    
    if(user){
        const {_id,name,email,photo,phone,bio} = user
        res.status(201).json({
            _id,name,email,photo,phone,bio,token,
        });
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
});

//Login User
const loginUser = asyncHandler(async (req,res) => {

    // res.send("Login user");
    const {email,password} = req.body;

    //validate request
    
    if(!email || !password){
        res.status(400);
    throw new Error("Please add email and password!");
    }
    //check if user exists
    const user = await User.findOne({email});

    if(!user){
        res.status(400);
    throw new Error("User not found Please Sign-Up");
    }
    // User exists ,now check password is correct 
    const passwordIsCorrect = await bcrypt.compare(password,user.password);

    //Generate Token
    const token = generateToken(user._id);
    
    //send HTTP-only cookie
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        expires: new Date(Date.now()+1000 * 86400), // 1day
        sameSite:"none",
        secure:true,
    });
    

    if(user && passwordIsCorrect){
        const {_id,name,email,photo,phone,bio} = user;
        res.status(200).json({
            _id,name,email,photo,phone,bio,token
        });
    }else{
        res.status(400);
        throw new Error("Invalid email or password!")
    }
});

//logout user
const logout = asyncHandler(async (req,res) => {
    //expireing the cookie
    res.cookie("token","",{
        path:"/",
        httpOnly:true,
        expires: new Date(0), // 1day
        sameSite:"none",
        secure:true,
    });
    return res.status(200).json({message:"Successfully Logged out"});
});


module.exports = {
    registerUser,
    loginUser,
    logout,
}

/*

const registerUser = (req,res) =>{
    if(!req.body.email){
        res.status(400)
        throw new Error("Please add an email")
    }
    res.send("Register User")
};
*/