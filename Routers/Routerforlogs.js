const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const cors = require('cors')
const cookie = require('cookie-parser')
const user = require('../Schema/User')
const post = require('../Schema/Postdata')
const comment = require('../Schema/Comment')
const event = require('../Schema/Event')
const hash = require('bcryptjs')
const JWT = require('jsonwebtoken')

router.use(cors( {
          origin: ['http://localhost:3000','https://helping-hand-erak.onrender.com'],
          methods: ['POST', 'PUT', 'GET','DELETE','OPTIONS', 'HEAD'],
          credentials: true
}))
router.use(cookie())


//add new user
router.post('/adduser',async(req,res)=>{
          const {name,email,mobile,area,state,password,confirmpassword} = req.body
          if(password!==confirmpassword){
                    return res.send("invalid")
          }
          const salt = await hash.genSaltSync(11)
          const encryptpass = await hash.hashSync(password,salt)
          const newuser = new user({
                    name,
                    email,
                    mobile,
                    area,
                    state,
                    password:encryptpass,
                    coverimg:'',
                    profileimg:'',
                    about:''


          })

          newuser.save().then(async()=>{
                    const b = await user.findOne({mobile})
                    const token = await JWT.sign(b.id,process.env.TOKEN)
                    res.cookie('logtoken',token).send('in')

                    res.send(newuser)
          }).catch((e)=>{
                    console.log(e)
          })
})


//login user

router.post('/login',async(req,res)=>{
          const {mobile,password} = req.body

         
          
          const b = await user.findOne({mobile})

          if(!b){
                    return res.send("User not found")
          }
        
          
          const check = await hash.compare(password,b.password)
          if(!check){
                    console.log(password+" "+b)
                    return res.send('invalid password')
          }

          const token = await JWT.sign(b.id,process.env.TOKEN)

          res.cookie('logtoken',token).send("logged in successfully")
          


})

router.get('/',(req,res)=>{
          res.send('dkkd')
})

//logout user
router.post('/logout',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          if(!cookie){
                    return res.send("You are already logged out")
          }
          res.clearCookie('logtoken').send('out')
})

//update user details

router.put('/update',async(req,res)=>{
          const{profileimg,coverimg,name,about,area,state}=req.body
          const getcookie = await req.cookies.logtoken
                    if (!getcookie) {
                              return res.status(400).send("logged out")
                    }
                    const checkid = await JWT.verify(getcookie, process.env.TOKEN)
                    if (!checkid) {
                              return res.send("you are logged out")
                    }
                    const find = await user.findById(checkid)
                    find.name= await name
                    find.about= await about
                    find.area= await area
                    find.coverimg = await coverimg
                    find.profileimg= await profileimg
                    find.state=await state
                    find.save().then((e)=>{
                              
                              res.send(e)

                    }).catch((e)=>{
                              res.send('error')
                    })
})


//get user details
router.get('/getdetails',async(req,res)=>{
          const cookie = await req.cookies.logtoken
          console.log(cookie)
          if(!cookie){
                    return res.send("you are hai logged in")
          }
          const id = await JWT.verify(cookie,process.env.TOKEN)
          console.log(id)
          const userdetails = await user.findById(id).lean()

          res.send(userdetails)


})

router.post('/getdetails',async(req,res)=>{
          
          const cookie = await req.cookies.logtoken
          
          if(!cookie){
                    return res.send("you are hai logged in")
          }
          console.log(req.body.userId)

          const indivisualuserdetails = await user.findById(req.body.userId).lean()
          
          res.send(indivisualuserdetails)


})

//delete user
router.delete('/deleteuser',async(req,res)=>{
          const cookie = await  req.cookies.logtoken
          if(!cookie){
                    return res.send("you are not logged in")
          }
          const id = await JWT.verify(cookie,process.env.TOKEN)
          const deluser = await user.findByIdAndDelete(id)
          res.send("user deleted")

})






















module.exports = router