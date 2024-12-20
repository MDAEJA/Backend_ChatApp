const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        min : 3
    },
    lastName : {
        type : String,
        required : true,
        min : 3
    },
    gender : {
        type : String,
        required : true,
        enum : ['male','female','others']
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    friends: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Refers to the User model
          },
        ],
        default: [], // Default value is an empty array
      },
    profilePicture : {
        type : String,
        default : ''
         
    }
},{timestamps : true});


// Pre-save middleware to set default profilePicture
authSchema.pre('save', function (next) {
    if (!this.profilePicture) {
      if (this.gender === 'male') {
        this.profilePicture = 'https://cdn-icons-png.flaticon.com/256/5046/5046928.png';
      } else if (this.gender === 'female') {
        this.profilePicture = 'https://cdn-icons-png.flaticon.com/256/5046/5046936.png';
      } else {
        this.profilePicture = 'https://cdn-icons-png.flaticon.com/256/5046/5046928.png'; // Default fallback
      }
    }
    next();
  });

const userModel = mongoose.model('User',authSchema);
module.exports = userModel;