const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(express.json());


 const router = require('./routes/router');



require('dotenv').config(); 

 // connect to db

 mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

 })
   .then(()=>{
         console.log('DB Connected')
   })
    .catch((err)=>{
        console.log(err)
    })



    app.use('/api', router)


 app.listen(4000, () => {
    console.log('Server is running on port 4000');
 })