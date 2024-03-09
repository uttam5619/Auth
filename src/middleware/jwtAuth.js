const jwt = require('jsonwebtoken')

const jwtAuth =(req,res, next)=>{

    const token= (req.cookies && req.cookies.token) || null
    if(!token) return res.status(400).json({sucess:false, message:`not authorised`})

    try{
        const payload= jwt.verify(token, process.env.SECRET)
        req.user ={ id: payload.id, email: payload.email}
    }catch(err){
        return res.status(400).json({sucess:false, message:err.message})
    }

    next()
}


module.exports=jwtAuth
