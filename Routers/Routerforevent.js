const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const user = require('../Schema/User')
const post = require('../Schema/Postdata')
const comment = require('../Schema/Comment')
const event = require('../Schema/Event')
const cors = require('cors')
const cookie = require('cookie-parser')
const JWT = require('jsonwebtoken')
const { json } = require('body-parser')


router.use(cors({
          origin: ['http://localhost:3000','https://helping-hand-erak.onrender.com'],
          methods: ['POST', 'PUT', 'GET','DELETE','OPTIONS', 'HEAD'],
          credentials: true
}))
router.use(cookie())

//add event 
router.post('/addevent',async(req,res)=>{
          const {topic,description,location,image} = req.body
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          console.log(userid)
          
          const users = await user.findById(userid)
          console.log(users)
          const newevent = new event({
                    user:userid,
                    username:users.name,
                    userimg:users.profileimg,
                    topic,
                    description,
                    Date:new Date(Date.now()).getDate()+":"+new Date(Date.now()).getMonth()+":"+new Date(Date.now()).getFullYear(),
                    image,
                    area:location
                    
          })
          newevent.save().then(()=>{
                    res.send(newevent)
          }).catch((e)=>{
                    console.log(e)
          })

})

//delete event 
router.delete('/deleteevent/:id',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const findevent = await event.findByIdAndDelete(req.params.id)
          res.send(findevent)

          
})

//get event 
router.get('/getevent',async(req,res)=>{
          const eventlist = await event.find({})
          res.send(eventlist)

})
//get own events
router.get('/geteventinarea',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          
          
          const users = await user.findById(userid)
          const geteventsinarea = await event.find({area:users.area})
          console.log(geteventsinarea)
          res.send(geteventsinarea)

})



module.exports=router