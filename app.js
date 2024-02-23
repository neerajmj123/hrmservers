const express = require('express')
const app = express() 
const cors = require('cors')
app.use(cors())

const dotevv = require('dotenv')
dotevv.config()
const db = require("./db/config")
const authRoutes = require('./routes/authRoutes')
app.use(authRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
connect()
app.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`)
})