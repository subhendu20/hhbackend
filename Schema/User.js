const mongoose = require('mongoose')
const user = new mongoose.Schema({
          name:{
                    type:String,
                    required:true
          },
          email:{
                    type:String,
                    required:true,
                    unique:true
          },
          mobile:{
                    type:Number,
                    required:true,
                    unique:true,


          },
          about:{
                    type:String,

          },
          coverimg:{
                    type:String
          },
          profileimg:{
                    type:String
          },
        
          area:{
                    type:String,
                    required:true,

          },
          state:{
                    type:String,
                    required:true

          },
          password:{
                    type:String,
                    required:true,
                    unique:true
          }
          
          
          
})
const newuser = new mongoose.model('userdetail',user)
module.exports=newuser;