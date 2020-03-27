require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose');
const users = require('./routes/user.route');
const captcha = require('./routes/clientIP.route');
const express = require('express');
const app = express();
const port = process.env.PORT || 3999;
const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/test-user";


mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));
 

app.use(cors())
app.use(express.json());

app.use('/api/users', users);
app.use('/api/captcha', captcha);

app.listen(port, () => console.log(`Listening on port ${port}...`));

