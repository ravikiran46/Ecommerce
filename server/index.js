const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const users = require("./schema")

// cros 
app.use(cors())
app.use(express.json())



const dburl=process.env.DB_URI


// connect to database
mongoose.connect(dburl).then(console.log("connected to database")).catch(console.error)




//sign up
app.post('/register',async(req,res)=>{
    const {name,email,password} = req.body
    const encryppassword = await bcrypt.hash(password,10)
    try {
        await users.create(
            {   
                name,
                email,
                password : encryppassword
            }
            )
            res.send({status : 200})
            
        } catch (error) {
            res.send({status : "error"})
            
        }
    })
    
    
    // sign in
    app.post('/login',async(req,res)=>{
        const {email,password} = req.body
        const user =  await users.findOne({email})
        if(!user){
            return   res.send({status:"No such user"})
        }
        else{
            if(await bcrypt.compare(password,user.password)){
                const token = jwt.sign({id : user._id ,name : user.name, email : user.email},process.env.PRIVATE_KEY)
                return res.send({status :  'Logged in successfully' ,token:token})
            }
            else{
                return res.send({status:"Invalid password"})
            }
        }
    })
    
    
    // items
    app.use('/product',require('./routes/products'))
    
    app.use('/auth',require('./routes/auth'))
    
    app.use('/proudct/:id',require('./routes/products'))
    
    
    // user info 
    
    
    
    
    
    
app.listen(5000, ()=>{
    console.log("connected server")
})