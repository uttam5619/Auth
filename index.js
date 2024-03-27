require('dotenv').config()
const app= require('./app')
const connectDB = require('./src/config/configDatabase')
const port =process.env.PORT || 8001
const cloudinary = require('cloudinary').v2

connectDB()


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET_TOKEN 
});

app.listen(port, (req, res) => {
    console.log(`server listning on ${port}`)
})