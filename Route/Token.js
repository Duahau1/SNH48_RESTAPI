const express = require('express');
const route = express.Router();
const token = require('../Models/Refresh_Token');
const jwt = require('jsonwebtoken');

route.post("/",async (req,res)=>{
    let ref_token = req.headers.token.split(" ")[1];
    let found = token.findOne({ref_token : ref_token});
    if(found!=null){
        res.json({
            AccessToken : jwt.sign({email: req.body.email}, process.env.JWT_TOKEN)
        })
    }else{
        res.status(404).json({Message: "Auth failed"});
    }

})
route.delete("/logout",async(req,res)=>{
    let ref_token = req.headers.token.split(" ")[1];
    let found = token.findOneAndDelete({ref_token : ref_token});
    if(found!=null){
        res.json({Message: "Refresh Token is Deleted"});
    }else{
        res.status(404).json({Message: "Auth failed"});
    }

})

module.exports = route;