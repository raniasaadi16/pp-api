const mongoose = require('mongoose'); 

var messageSchema = new mongoose.Schema({
    homeStatus:{
        type:String,
        required:true,
    },
    adress:{
        type:String,
        required:true,
    },
    electricBill:{
        type:String,
        required:true,
    },
    electricCompany:{
        type:String,
        required:true,
    },
    creditScore:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Message', messageSchema);