const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const user = require('../Schema/User')
const post = require('../Schema/Postdata')
const comment = require('../Schema/Comment')
const event = require('../Schema/Event')
const follows=require('../Schema/Followers')
const cors = require('cors')
const cookie = require('cookie-parser')
const JWT = require('jsonwebtoken')
const { json } = require('body-parser')

router.use(cors( {
          origin: ['http://localhost:3000','https://helping-hand-erak.onrender.com'],
          methods: ['POST', 'PUT', 'GET','DELETE','OPTIONS', 'HEAD'],
          credentials: true
}))
router.use(cookie())

//add comment
router.post('/addcomment/:id',async(req,res)=>{
          const { comments } = req.body
          const cookie = await req.cookies.logtoken

          if (!cookie) {
                    return res.send("you are logged out")
          }
          console.log(cookie)
          const userid = await JWT.verify(cookie, process.env.TOKEN)

          const users = await user.findById(userid)

          const newcomment = new comment({
                    user: userid,
                    username: users.name,
                    postid: req.params.id,
                    Date: new Date(Date.now()).getDate() + ":" + new Date(Date.now()).getMonth() + ":" + new Date(Date.now()).getFullYear(),
                    comment: comments
          })
          newcomment.save().then(() => {
                    res.send(newcomment)
          }).catch((e) => {
                    console.log(e)
          })

})


//delete comment
router.delete('/deletecomment/:id',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const del = await comment.findByIdAndDelete(req.params.id)
          res.send(del)

})

//update comment
router.patch('/updatecomment/:id',async(req,res)=>{
          const {comments} = req.body
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const findcomment = await comment.findById(req.params.id)

          findcomment.comment=comments
          findcomment.save().then(()=>{
                    res.send(findcomment)
          }).catch((e)=>{
                    console.log(e)
          })


})

//get comments
router.get('/getcomment/:id',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const commentlist = await comment.find({postid:req.params.id})
          res.send(commentlist)

})


// ---------------------------------------------follow--------------------------------------------//

router.get('/addfollow/:id', async (req, res) => {

          const cookie = await req.cookies.logtoken
          console.log(cookie)

          if (!cookie) {
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie, process.env.TOKEN)

          const img = await user.findById(userid)
          const user2  = await user.findById(req.params.id)



          const addfollower = new follows({
                    followid: req.params.id,
                    followimg:user2.profileimg,
                    followname:user2.name,
                    followerid: userid,
                    followerimg: img.profileimg,
                    followername:img.name



          })
          addfollower.save().then(() => {
                    console.log("add")
                    res.send(addfollower)
          }).catch((e) => {
                    console.log(e)
          })

})


router.get('/removefollow/:id', async (req, res) => {
          const cookie = await req.cookies.logtoken
          if (!cookie) {
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie, process.env.TOKEN)

          const del = await follows.deleteOne({
                    followid: req.params.id,
                    followerid: userid


          })
          console.log(del)
          res.send(del)

})

//update comment
router.get('/getfollowers', async (req, res) => {

          const cookie = await req.cookies.logtoken
          if (!cookie) {
                    return res.send("you are logged out")
          }

          const id = await JWT.verify(cookie, process.env.TOKEN)
          const followlist = await follows.find({ followid: id })

          res.send(followlist)



})


router.get('/getfollows', async (req, res) => {

          const cookie = await req.cookies.logtoken
          if (!cookie) {
                    return res.send("you are logged out")
          }

          const id = await JWT.verify(cookie, process.env.TOKEN)
          const followerlist = await follows.find({ followerid: id })

          res.send(followerlist)



})


router.get('/followcheck/:id', async (req, res) => {

          const cookie = await req.cookies.logtoken
          console.log(cookie)
          if (!cookie) {
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie, process.env.TOKEN)

          const followlist = await follows.findOne({ followid: req.params.id, followerid: userid })
          console.log(`{followid:${req.params.id},followerid:${userid}}`)
          console.log(followlist)
          if(followlist===null) {
                    return res.send('no')
          }
          res.send("yes")







})
//get follow list

router.get('/followerlist/:id', async (req, res) => {

          const cookie = await req.cookies.logtoken
          if (!cookie) {
                    return res.send("you are logged out")
          }
          console.log(`cookies aa rah hu main ${cookie}`)
          const followlist2 = await follows.find({ followid: req.params.id })


          res.send(followlist2)



})

module.exports=router