const mongoose = require('mongoose')
const post = new mongoose.Schema({
          user:{
                    type:String,
                    required:true,
          },
          username:{
                    type:String,
                    required:true,
          },
          userimg:{
                    type:String,
                    required:true,

          },
          topic:{
                    type:String,
                    required:true,
          },
          image:{
                    type:String
          },
          Date:{
                    type:String,
                    required:true
          },
          description:{
                    type:String,
                    required:true,
          }
          
         
          ,area:{
                    type:String,
                    required:true
          },
        
})
const newpost = new mongoose.model('postcollection',post)
module.exports=newpost;