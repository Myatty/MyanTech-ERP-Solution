const express = require('express');
// const { query, validationResult } = require('express-validator');
// const connection = require('../db/connection');
const { getAllUsers, createUser, getUserByName } = require("../controllers/userController");
const router = express.Router();



router.get("/searchUser", getUserByName);
router.get("/", getAllUsers);
router.post("/", createUser);
module.exports = router;