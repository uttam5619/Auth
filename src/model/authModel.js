const mongoose = require('mongoose');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authSchema= new mongoose.Schema({

    name:{
        type: 'String',
        required: [true,'name is required'],
        trim: true,
        lowercase: true,
        minLength: [2, 'the name should contain atleast 2 characters'],
        maxLength: [80, 'the name should contain not contain more than 80'],
        
    },
    email:{
        type: 'String',
        required: [true,'email is required'],
        trim: true,
        lowercase: true,
        unique: [true,'email should be unique']
    },
    password:{
        type: 'String',
        required: [true,'password is required'],
        trim: true,
        select:false,
    },
    phone:{
        type: 'String',
        required: [true,'phone is required'],
        trim: true,
    }

},{timestamps:true})


authSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,10)
    next()
})


authSchema.methods ={
    jwtToken: function(){
        return jwt.sign(
            {id:this._id,email:this.email},
            process.env.SECRET,
            {expiresIn:'5m'}
        )
    }
}

module.exports= mongoose.model('AuthModel',authSchema);