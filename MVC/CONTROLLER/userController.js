const userModel = require("../MODEL/authModel");

const addFriend = async(req,res)=>{
    try{
      const {friendId} = req.params;
      const {userId} = req.body;

    //   console.log(friendId,userId);

      if(!userId || !friendId){
        return res.json({
            status : false,
            message : "provide frirndId and userId"
        })
      }

      const user = await userModel.findById(userId);
      const friend = await userModel.findById(friendId);

      if(!user){
        return json({
            status : false,
            message : 'Invalid User !!'
        })
      }

      if(!friend){
        return json({
            status : false,
            message : 'Invalid Friend !!'
        })
      }

    //   find already friend 
    const findFriend = user.friends.some((friend)=>{
         return friend.equals(friendId)
    })

    if(findFriend){
        return res.json({
            status : false,
            message : 'Already Friend'
        })
    }

    user.friends.push(friendId);

    await userModel.findByIdAndUpdate(userId,user);

    //  add user in friend
     const findUserFriend = friend.friends.some((user)=>{
      return user.equals(userId)
     })

     if(findUserFriend){
      return res.json({
          status : false,
          message : 'Already Friend'
      })
  };
  friend.friends.push(userId);
  await userModel.findByIdAndUpdate(friendId,friend);


    res.json({
        status : true,
        message : "Friend Added !!"
    })
    }
    catch(err){
        res.status(500).json({ err: "Something went wrong" });
    }
};

const removeFriend = async(req,res)=>{
    try{
   const {friendId} = req.params;
   const userId = req.user._id
     
   
   if(!userId || !friendId){
    return res.json({
        status : false,
        message : "provide friendId and userId"
    })
  }


    //   check he is  friend 

    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);

      if(!user){
        return json({
            status : false,
            message : 'Invalid User !!'
        })
      };

      if(!friend){
        return json({
            status : false,
            message : 'Invalid Friend !!'
        })
      }

    const findFriend = user.friends.some((friend)=>{
        return friend.equals(friendId)
   });


   if(!findFriend){
    return res.json({
        status : false,
        message : 'Not Friend'
    })
   }

   const findUser = friend.friends.some((user)=>{
    return user.equals(userId)
});

   // delete friend 

     user.friends =  user.friends.filter((friend)=>{
        return !friend.equals(friendId)
      });

      friend.friends = friend.friends.filter((user)=>{
        return !user.equals(userId)
      });

      await userModel.findByIdAndUpdate(userId,user);
      await userModel.findByIdAndUpdate(friendId,friend);
      
      res.json({
        status : true,
        message : " Remove Friend !!"
    })
    }
    catch(err){
        res.status(500).json({ err: "Something went wrong" });
    }
}

const userFriends = async(req,res)=>{
    try{
  const userId = req.user._id

  const user = await userModel.findById(userId);

  if (!user) {
    console.log("User not found");
    return res.json({
      status : false,
      message : "User Not Found !!"
    });
  }

  const userFriends = await userModel.find({ _id: { $in: user.friends } })
      res.json({
        userFriends,
        status : true
      })
    }
    catch(err){

    }
}

const userControllers = {
    addFriend,removeFriend,userFriends
};

module.exports = userControllers;