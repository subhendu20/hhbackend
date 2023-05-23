const mongoose = require('mongoose')
const follow = new mongoose.Schema({
          followid:{
                    type:String,
                    required:true,
                   
          },
          followname:{
                    type:String,
                    required:true,

          }
,
followimg:{
          type:String,
                    required:true,

},
          followerid:{
                    type:String, 
                    required:true,
          },
          followerimg:{
                    type:String,
                    required:true
                    
          },
          followername:{
                    type:String,
                    required:true
          }


        
          
          
         
          
          
})
const addfollower= new mongoose.model('follower',follow)
module.exports=addfollower;