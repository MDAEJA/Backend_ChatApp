const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'});

const dataBase = ()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("DATA BASE CONNECTED SUCCESSFULLY !!!")
    }).catch((err)=>{
        console.log('DATA BASE ERR : ',err.message);
    })
}

module.exports = dataBase;