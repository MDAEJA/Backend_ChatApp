const express = require('express');
const messageController = require('../CONTROLLER/chatController');
const multerFunction = require('../../multer/multer');

const chatRoutes = express.Router();

const upload = multerFunction().single("chatMessage");

chatRoutes.post('/:recieverId/send',upload,messageController.sendMessage);
chatRoutes.post('/:recieverId/message',messageController.messageBetweenUsers)

module.exports = chatRoutes;