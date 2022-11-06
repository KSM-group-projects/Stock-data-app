const express = require("express");
const router = express.Router();
//controllers pull
const {registerUser, loginUser,logout} = require("../controllers/userController");

router.post("/register",registerUser)
router.post("/login",loginUser);
router.get("/logout",logout);

module.exports = router