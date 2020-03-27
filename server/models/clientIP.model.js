const mongoose = require('mongoose')

const clientIpSchema = new mongoose.Schema({
    ip: {
        type:String,
        unique:true
    
    }
},{
    timestamps : true
})

//create TTL index with expiration of 24hrs
clientIpSchema.index({createdAt:1},{expireAfterSeconds:86400})

module.exports = ClientIP = mongoose.model('ClientIp',clientIpSchema);