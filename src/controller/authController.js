const User = require('../model/userModel')
const EmailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const fs =require('fs').promises

const cookieOptions ={
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    secure: true,
}


const signUp = async(req, res)=>{
    
    const { name, password, email, phone } = req.body
    console.log(name, password, email, phone)
    if(!email || !password || !name || !phone )
    return res.status(400).json({ sucess: false, message:`all fields are mandatory`})

    const isEmailValid =EmailValidator.validate(email)
    if(!isEmailValid)
    return res.status(400).json({ sucess: false, message:'provide a valid email'})


    try{
        const isUserExist= await User.findOne({email})
        if(isUserExist)return res.status(400).json({ sucess: false, message:`user already exists`})
        const user = await User.create({
            name,
            email,
            password,
            phone,
            avatar:{public_id:email, secure_url:`https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg`}
        })
        // file uploading
        if(req.file){
            const result = await cloudinary.uploader.upload()
            user.avatar.public_id= result.public_id,
            user.avatar.secure_url= result.secure_url
            fs.unlink(`uploads/${req.file.filename}`)
        }
        
        user.save()
        const token = user.generateToken()
        res.cookies('token', token, cookieOptions)
        return res.status(200).json({success:true, message:`user registered successfully`, data:user})
        
        /*
        const userInfo= await User(req.body).save(req.body)
        if(!userInfo) return res.status(400).json({ sucess: false, message:`failed to save document`})
        return res.status(200).json({ sucess: true, data: userInfo })
        */
    }catch(err){
        if(err.code===11000)return res.status(400).json({ sucess: false, message:`already exist`})
        return res.status(400).json({ sucess: false, message:err.message})
    }

}


const signIn = async(req, res)=>{
    
    const {email, password} = req.body
    console.log(email, password)
    if(!email || !password)return res.status(400).json({sucess:false, message:`all fields are mandatory`})

    const isEmailValid= EmailValidator.validate(email)
    if(!isEmailValid)return res.status(400).json({sucess:false,message:`provide a valid email`})

    try{
        const user = await User.findOne({email}).select('+password')
        if(!user)return res.status(400).json({sucess:false, message:`please register`})
        if(! (await bcrypt.compare(password,user.password)))
        return res.status(400).json({sucess:false, message:`password not valid`})

        const accessToken= user.generateToken()
        user.password=undefined
        res.cookie('token', accessToken, cookieOptions)
        res.status(200).json({sucess:true,message:`login successfully`, data:user})

    }catch(err){
        res.status(400).json({sucess:false, message:err.message})
    }


}


const getUser= async(req, res, next)=>{

    const userId =req.user.id

    try{
        const user =await User.findById(userId)
        return res.status(200).json({sucess:true, data:user})
    }catch(err){
        return res.status(400).json({sucess:false, message:err.message})
    }

}


const logOut =(req, res)=>{

    try{
        const cookieOption ={
            expires: new Date(),
            httpOnly: true,
        }
        res.cookie('token',null, cookieOption)
        res.status(200).json({sucess:true, message:`logged Out`})
    }catch(err){
        return res.status(400).json({sucess:false, message:err.message})
    }
}


module.exports={signIn, signUp, getUser, logOut }