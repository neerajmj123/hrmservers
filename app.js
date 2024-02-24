const express = require('express');
const app = express();
const cors = require('cors');
const connect = require("./db/config");
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
dotenv.config()


app.use(cors());

app.use(authRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
connect();
app.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`)
})