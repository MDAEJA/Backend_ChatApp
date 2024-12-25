const bcrypt = require('bcryptjs');
// const { default: mongoose } = require('mongoose');
const userModel = require('../MODEL/authModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({
    path : './config.env'
});

const createUser = async(req,res)=>{
    try{
      
     const {firstName,lastName,gender,email,password} = req.body;

     if(!firstName || !lastName || !gender || !email || !password){
        return res.status(404).json({
            status : false,
            message : `Required All Fields : ${err.message} `
        })
     }
     const existingUser = await userModel.findOne({ email });
     if (existingUser) return res.status(400).json({ message: "User already exists" });

    
    const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(password, salt);;

     const newUser = new userModel({
        firstName,lastName,email,gender,password : hashedPassword
     });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    }
    catch(err){
        console.log(err.message);
    res.status(500).json({ err: "Something went wrong" });
    }
}

const userLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
             return res.status(404).json({
                status : false,
                message : `Required All Fields : ${err.message} `
            })
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // const isProduction = process.env.NODE_ENV === 'production';
     res.cookie('token',token,{
        maxAge: 2 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure : true, 
        sameSite : 'Lax'
        // sameSite: "strict",
        
     }).json({
        status : true,
        token,
        user,
        message : 'Login Successfully !!!'
     })
    }
    catch(err){
        res.status(500).json({ err: "Something went wrong" });
    }
}

const userLogout = async(req,res)=>{
    try{
        if(!req.cookies.token ){
       return res.status(404).json({
        status : false,
         message : "Already Logout !!"
       })
        }
        
    res.cookie('token',"",{
        maxAge : 0
    })

    res.json({
        status : true,
        message : "LOGGED OUT SUCCESSFULLY !!!"
     })

    }
    catch(err){
        res.json({
            status : false,
          message : err.message
          })
    }
}

const authContollers = {
    createUser,userLogin,userLogout
};

module.exports = authContollers;
