// const multerFunction = require("../../multer/multer");
const path = require('path');
const messageModel = require("../MODEL/MessageModel");
const dotenv = require('dotenv');
const conversationModel = require('../MODEL/conversationModel');

dotenv.config({
    path: './config.env'
})


// const upload = multerFunction().single('chatMessage');

const sendMessage = async(req,res)=>{
    try{
     const senderId = req.user._id;
     const {recieverId} = req.params;
     const {chatMessage} = req.body;

     // Check for required fields
    if (!senderId || !recieverId ) {
        return res.json({
          status: false,
          message: "Sender ID and Receiver ID are required!",
        });
      }

      if(req.file){
        const filePath = `${process.env.BASEURL}/uploads/${req.file.filename}`

        const newMessage = new messageModel({
            senderId,
            recieverId,
            message : filePath
        })

        await newMessage.save();

        // conversation

        let discussionBetweenUsers =  await conversationModel.findOne({
            participants : { $all : [senderId,recieverId]}
        });
    
        if(!discussionBetweenUsers){
          discussionBetweenUsers = await conversationModel.create({
            participants:[senderId,recieverId]
          })
        };

        discussionBetweenUsers.messages.push(newMessage._id);

        await discussionBetweenUsers.save();

        res.json({
            status : true,
            message : "file Send!!"
        })
      } else if(chatMessage){
        const newMessage = new messageModel({
            senderId,
            recieverId,message : chatMessage
        })
        await newMessage.save();

        // conversation

        let discussionBetweenUsers =  await conversationModel.findOne({
            participants : { $all : [senderId,recieverId]}
        });
    
        if(!discussionBetweenUsers){
          discussionBetweenUsers = await conversationModel.create({
            participants:[senderId,recieverId]
          })
        };

        discussionBetweenUsers.messages.push(newMessage._id);

        await discussionBetweenUsers.save();
        res.json({
            status : true,
            message : "Message Send !!"
        })
      }
    
    }
    catch(err){
        console.error(err);
        res.status(400).json({ status: false, error: err.message });
    }
}

const messageBetweenUsers = async(req,res)=>{
    try{
    const senderId = req.user._id;
    const {recieverId} = req.params;

    if (!senderId || !recieverId ) {
        return res.json({
          status: false,
          message: "Sender ID and Receiver ID are required!",
        });
      }

      // find message between senderId and userId

    const userMessages = await conversationModel.findOne({ participants: { $all: [senderId, recieverId] } }).populate('messages')  

     if(!userMessages){
        return res.status(200).json({
            status : true,
            message : "No-Messages !!"
        });
     }
     res.json({
        status : true,
        userMessages : userMessages.messages
      })
    }
    catch(err){
        return res.status(500).json({
            status : false,
            message : err.message
          })
    }

}

const messageController = {
    sendMessage,messageBetweenUsers
}

module.exports = messageController;