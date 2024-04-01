const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const connect = require("./db/config");

const dotenv = require('dotenv');
dotenv.config()

app.use(express.json());

const corsOptions ={
  origin:'http://localhost:5173'
}
app.use(cors(corsOptions));

app.use(authRoutes); 
app.use(userRoutes);
app.use('/getuser',userRoutes);
app.use('/updateUser',userRoutes)


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
connect();
app.listen(process.env.PORT, () => {
  console.log(`server running at http://localhost:${process.env.PORT}`)
})