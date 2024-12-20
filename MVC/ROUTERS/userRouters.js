const express = require('express');
const userControllers = require('../CONTROLLER/userController');

const userRoutes = express.Router();

userRoutes.post('/:friendId/addfriend',userControllers.addFriend);
userRoutes.post('/:friendId/removefriend',userControllers.removeFriend);
userRoutes.get('/friends',userControllers.userFriends)



module.exports = userRoutes;