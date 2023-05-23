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
          origin: 'http://localhost:3000',
          methods: ['POST', 'PUT', 'GET','DELETE','OPTIONS', 'HEAD'],
          credentials: true
}))
router.use(cookie())
//post a new post
router.post('/postnote',async(req,res)=>{
          const {topic,description,location,image} = req.body
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          console.log(userid)
          
          const users = await user.findById(userid)
          console.log(users)
          const newpost = new post({
                    user:userid,
                    username:users.name,
                    userimg:users.profileimg,
                    topic,
                    description,
                    Date:new Date(Date.now()).getDate()+":"+new Date(Date.now()).getMonth()+":"+new Date(Date.now()).getFullYear(),
                    image,
                    area:location
                    
          })
          newpost.save().then(()=>{
                    res.send(newpost)
          }).catch((e)=>{
                    console.log(e)
          })
})

//delete a post
router.delete('/deletenote/:id',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const del = await post.findByIdAndDelete(req.params.id)
          res.send(del)




})

//update a post
router.put('/updatepost/:id',async(req,res)=>{
          const {topic,body,tag} = req.body
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          
          
          const users = await user.findById(userid)
          
          const findpost = await post.findById(req.params.id)
          findpost.user=userid,
          findpost.username=users.name,
          findpost.topic = topic,
          findpost.body = body
          findpost.Date = new Date(Date.now()).getDate()+":"+new Date(Date.now()).getMonth()+":"+new Date(Date.now()).getFullYear(),
          findpost.boost = 0
          findpost.tag=tag  

          findpost.save().then(()=>{
                    res.send(findpost)

          }).catch((e)=>{
                    console.log(e)
          })
          

})

//get post for home page
router.get('/toppost',async(req,res)=>{
          const allpost = await post.find({})
          res.send(allpost)
          

})





//find post list from search
router.post('/findpost',async(req,res)=>{
          var list=[]
          var profilelist = []
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          
          
          const users = await user.findById(userid)
          
          console.log(req.body.query)
          
          const keys= req.body.query.split(' ')
          for(var i=0;i<keys.length;i++){
                    console.log(keys[i])
                    // ----for post----//
                    const finditem = await post.find({username:keys[i]})
                    //------for user---//
                    const findprofile = await user.find({name:keys[i]})
                    //------for event in area-----//

                    //------for same topic in same area---//
                    const findtopic = await event.find({topic:keys[i],area:users.area})

                    if(findtopic ){
                              console.log(findtopic)
                              list.push(findtopic)
                    }
                    

                    
                    if(finditem){
                              console.log(finditem)
                              list.push(finditem)
                    }
                    if(findprofile){
                              console.log(findprofile)
                              profilelist.push(findprofile)
                    }

          }
          res.send({posts:list,profiles:profilelist})
})






//get own post for profile
router.get('/ownpost',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const id = await JWT.verify(cookie,process.env.TOKEN)
          console.log(id)
          const posts = await post.find({user:id})
          res.send(posts)

})

//get user post

router.post('/postlist',async(req,res)=>{
          
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const indivisualpostdetails = await post.find({user:req.body.userId}).lean()
          
          res.send(indivisualpostdetails)

})

//update like
router.patch('/addlike/:id',async(req,res)=>{
          const {changeboost} = req.body
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }

          const findpost = await post.findById(req.params.id)
          
          if(changeboost=="add"){
                    findpost.boost = findpost.boost+1


          }
          if(changeboost=="reduce"){
                    findpost.boost = findpost.boost-1
          }

          findpost.save().then(()=>{
                    res.send(findpost)
          }).catch((e)=>{
                    console.log(findpost)
          })
          

})


router.get('/neararea',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          
          
          const users = await user.findById(userid)
          const accounts = await user.find({area:users.area})
          console.log(accounts)
          res.send(accounts)

})

router.get('/nearstate',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("you are logged out")
          }
          const userid = await JWT.verify(cookie,process.env.TOKEN)
          
          
          const users = await user.findById(userid)
          const accounts = await user.find({state:users.state})
          console.log(accounts)
          res.send(accounts)

})



module.exports=router