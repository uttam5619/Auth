require('dotenv').config()
const app= require('./app')
const connectDB = require('./src/config/configDatabase')
const port =process.env.PORT || 8001


connectDB()

app.listen(port, (req, res) => {
    console.log(`server listning on ${port}`)
})