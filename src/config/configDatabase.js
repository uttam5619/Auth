const mongoose = require('mongoose')


const connectDB =(req, res)=>{
    mongoose.connect('mongodb://localhost:27017/Authentication')
    .then((e)=>{console.log(`connection established to database ${e.connection.host}`)})
    .catch((err)=>
        {console.log(`connection not establised with database ${err.message}`)
        process.exit(1)
    })
}

module.exports = connectDB