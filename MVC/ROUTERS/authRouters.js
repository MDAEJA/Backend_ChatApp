const express = require('express');
const authContollers = require('../CONTROLLER/authController');

const authRouters = express.Router();

authRouters.post('/user/register',authContollers.createUser);
authRouters.post('/user/login',authContollers.userLogin);
authRouters.get('/user/logout',authContollers.userLogout)

module.exports = authRouters;