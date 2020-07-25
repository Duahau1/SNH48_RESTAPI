const express = require('express');
const route = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const mongoSanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const rec_Token = require('../Models/Refresh_Token');

//Logging in
route.post("/signin",async (req,res)=>{
  let email = mongoSanitize(req.body.email);
  let password = mongoSanitize(req.body.password);
  let found = await User.findOne({email: email});
  if(found == null){
    res.status(404).json({Message: "Auth failed"});
  }
  else{
    bcrypt.compare(password, found.password,(err,same)=>{
      if(err){
        res.status(404).json({Message: "Auth failed" });
      }
      if(same){
        let token = jwt.sign({email:found.email, id:found._id},process.env.JWT_TOKEN,{expiresIn: "1h"});
        let refresh_token = jwt.sign({email:found.email, id:found._id},process.env.JWT_REFRESH_TOKEN);
        let rectoken = new  rec_Token ({
          ref_token : refresh_token
        })
        rectoken.save().then(()=>{
        res.status(200).json({
          Message : "You are logged in",
          Access_Token: token,
          Refresh_Token: refresh_token
        })
      }).catch(err=>res.json({Message:err}));
      }
      else{
        res.status(404).json({Message: "Auth failed" });
      }
    })
  }
})

//Register for new user
route.post("/signup",async (req, res) => {
  let existedEmail = await User.find({email: req.body.email});
  if(existedEmail.length >= 1){
    res.status(409).json({Message: "User is already existed"});
  }
  else {
    bcrypt.hash(mongoSanitize(req.body.password), 10 , (err, hash)=>{
      if(err){
        res.status(404).json({Message : "Error"});
      }
      else{
        let user = new User({
          email: mongoSanitize(req.body.email),
          password: hash
        })
        user.save().then(data => res.status(201).json({Message: "User is created"})).catch(err => res.json({Error :err}));
      }
    })
  }

})

module.exports = route;