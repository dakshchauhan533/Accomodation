const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");



const userschema = new Schema({
    
    email:{
        type:String,
        required:true
    },
  

});

userschema.plugin(passportlocalmongoose);



module.exports = mongoose.model("user",userschema);
