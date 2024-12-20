const express = require('express');
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const dataBase = require('./DATABASE/dataBaseConnection');
const authRouters = require('./MVC/ROUTERS/authRouters');
const cookieParser = require('cookie-parser');
const protectRoutes = require('./middleware/protectRoutes');
const userRoutes = require('./MVC/ROUTERS/userRouters');
const chatRoutes = require('./MVC/ROUTERS/chatRouters');
dotenv.config({
    path: './config.env'
})

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  });

  // middleware

//   app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static("upload"));


  // Socket.IO for real-time messaging
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message); // Broadcast message to all clients
      });
    
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // api auth routes
    app.use('/api/auth/signUp',authRouters);
    app.use('/api/auth/signIn',authRouters);
    app.use('/api/auth',authRouters);

    // api user routes
    app.use('/api/user',protectRoutes,userRoutes);

    // api chat 
    app.use('/api/chat',protectRoutes,chatRoutes);

     dataBase();
    server.listen(process.env.PORT || 10000 ,()=>{
        console.log('sever is connected at : ',process.env.PORT);
    });

