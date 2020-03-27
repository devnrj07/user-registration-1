const ClientIP = require('../models/clientIP.model');
const router = require('express').Router();
const requestIp = require('request-ip');


//global ds for persisting data internally
const clientIpCounter = new Map();

router.get('/status', async (req, res) => {
    let renderCaptcha = false;
    //keep track of requests from same ip
    const clientIp = requestIp.getClientIp(req);
    console.log('Client ip :', clientIp)
    //call trackip
    let clientIPAddress = await ClientIP.findOne({ ip: clientIp });
    
    if (clientIPAddress) {
        renderCaptcha = true;
    } else {
        //check if it exists in map
        if (clientIpCounter.has(clientIp)) {
            clientIpCounter.set(clientIp, clientIpCounter.get(clientIp) + 1)
        } else {
            clientIpCounter.set(clientIp, 1)
        }

        if (clientIpCounter.get(clientIp) === 3) {
            //add to db checklist and remove from map
            clientIPAddress = new ClientIP({ ip: clientIp })

            //save to db
            await clientIPAddress.save();
            clientIpCounter.delete(clientIp)
        }


    }
    console.log("render captcha:", renderCaptcha)
    res.status(200).json(renderCaptcha)
})



module.exports = router;