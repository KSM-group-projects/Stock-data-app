const express = require("express");
const router = express.Router();
//controllers pull
const {registerUser} = require("../controllers/userController");

router.post("/register",registerUser)


module.exports = router