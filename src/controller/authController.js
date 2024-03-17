
const AuthModel = require('../model/authModel')
const EmailValidator = require('email-validator')
const bcrypt = require('bcrypt')


const signUp = async(req, res)=>{
    
    const { name, password, email, phone } = req.body
    console.log(name, password, email, phone)
    if(!email || !password || !name || !phone )
    return res.status(400).json({ sucess: false, message:`all fields are mandatory`})

    const isEmailValid =EmailValidator.validate(email)
    if(!isEmailValid)
    return res.status(400).json({ sucess: false, message:'provide a valid email'})


    try{
        const isUserExist= await AuthModel.findOne({email})
        if(isUserExist)return res.status(400).json({ sucess: false, message:`user already exists`})
        const userInfo= await AuthModel(req.body).save(req.body)
        if(!userInfo) return res.status(400).json({ sucess: false, message:`failed to save document`})
        return res.status(200).json({ sucess: true, data: userInfo })
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
        const user = await AuthModel.findOne({email}).select('+password')
        if(!user)return res.status(400).json({sucess:false, message:`please register`})
        if(! (await bcrypt.compare(password,user.password)))
        return res.status(400).json({sucess:false, message:`password not valid`})

        const accessToken= user.jwtToken()
        user.password=undefined
        const cookieOption ={maxAge:24*60*60*1000, httpOnly:true}
        res.cookie('token', accessToken, cookieOption)
        res.status(200).json({sucess:true, data:user})

    }catch(err){
        res.status(400).json({sucess:false, message:err.message})
    }


}


const getUser= async(req, res, next)=>{

    const userId =req.user.id

    try{
        const user =await AuthModel.findById(userId)
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