const { User, validate } = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const verifyKey = process.env.SECRET_KEY;
const captchaUrl = process.env.RECAPTCHA_URL;

let _success;

router.post('/verify', async (req, res) => {
    
    const finalUrl = captchaUrl + '?secret=' + verifyKey + '&response=' + req.body.token + "&remoteip=" + req.connection.remoteAddress;
    await axios.post(finalUrl)
        .then(res => {
           // console.log('api response :', res.data);
            _success = res.data.success;

        }).catch(err => {

            console.log("error from google :" + err)

        })

    res.status(200).send(_success)

})


router.post('/add', async (req, res) => {

    // First Validate the Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    if (_success === false) {
        return res.status(200).json('recaptcha verification falied')
    }

    // Check if this user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(200).json('That user already exists!');
    } else {  
         // Insert the new user if they do not exist yet 
        user = new User(_.pick(req.body, ['name', 'email', 'password']));

        //before saving data to db # the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        
        //res.status(201).send(_.pick(user, ['_id', 'name', 'email']));
        res.status(201).json(`user ${req.body.name} added!`)
        
        //reset the recaptcha status
        _success = undefined;
    }
   
});




module.exports = router;