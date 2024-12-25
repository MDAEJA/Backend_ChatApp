const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userModel = require('../MVC/MODEL/authModel');

dotenv.config({
    path: './config.env'
})

const protectRoutes = async(req,res,next)=>{
  try{
   const token = req.cookies.token || localStorage.getItem('authToken'); // Get token from localStorage;
   

   if(!token){
    return res.status(401).json({
        status: false,
        message: "Unauthorized - No Token Provided !!"
    });
   }
    // Verify token and decode
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: err.name === 'TokenExpiredError' ? "Token Expired !!" : "Invalid Token Provided !!"
            });
        }
        return decoded;
    });

    if(!decodedToken || !decodedToken.id){
        return res.status(401).json({
            status: false,
            message: "Invalid Token Payload !!"
        });
    }

    const user = await userModel.findById(decodedToken.id);
    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User Not Found !!"
        });
    }
    req.user = user;
    next();
  }
  catch(err){
    console.error('Error in protectRoutes:', err.message);
    res.status(500).json({
        status: false,
        message: "INTERNAL SERVER - ERROR !!"
    });
  }
};

module.exports = protectRoutes;