const express = require("express");
const route = express.Router();
const Member = require('../Models/Member');
const cloudinary = require('cloudinary').v2;
const upload = require('express-fileupload');
const mongoSanitize = require('mongo-sanitize');
const check_Auth = require('./checkAuth');
const check_Admin = require('./checkAdmin');
const memcache = require('./Cache');
route.use(upload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 }
}));
require('dotenv').config();

cloudinary.config({
    cloud_name: 'duahau',
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
})

//Get all the members of SNH48
route.get("/",memcache(30) ,async (req, res) => {
    try {
            const posts = await Member.find().exec();
            res.json(posts);

    }
    catch (err) {
        res.json({ Error: "Not Found" });
    }
});

//Get by ID
route.get("/member/:id",memcache(30) ,async(req,res)=>{
    try{
        let mem_id= mongoSanitize(req.params.id); 
        let found = await Member.findById(mem_id).exec();
        if(found!=null){
        res.json(found);
        }
        else{
            throw new Error("No matching");
        }
    }
    catch(err){
        res.status(404).json({Error: "Not Found"});
    }
})

//Get by team and name and only dedicated for logged in user
route.get("/member",check_Auth,memcache(30), async(req,res)=>{
   try {
        if(req.query.name==null&& req.query.team==null){
            throw new Error("No matching member");
        }
        else if(req.query.team!=undefined && req.query.name != undefined){
        let team = mongoSanitize(req.query.team);
        let memName = mongoSanitize(req.query.name);
        let found = await Member.find({ Name:memName , Team: team }).exec();
        if(found.length >0){
        res.json(found);
        }
        else{
            throw new Error("No matching member");
        }

        }
     else if(req.query.team!=undefined){
        let team = mongoSanitize(req.query.team);
        let found = await Member.find({ Team: team }).exec();
        if(found.length>0){
            res.json(found);
            }
            else{
                throw new Error("No matching member");
            }

    }
     else if (req.query.name != undefined) {
        let memName = mongoSanitize(req.query.name);
        let found = await Member.findOne({ Name: memName }).exec();
        if(found!=null){
            res.json(found);
            }
            else{
                throw new Error("No matching member");
       }

    }
 }
    catch(err){
        res.status(404).json(err);
    }
})

//Posting to the DB admin method
route.post("/",check_Admin ,async (req, res) => {
    let file ='';
    try{
    file = req.files.Image;
    }
    catch(err){
        res.json({Message:"Please input photo"});
    }
    let photo = await new Promise((resp, rej) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
            cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
                if (err) {
                    console.log(err);
                    rej("Invalid Format");
                }
                resp(result);

            })
        }
        else {
            res.end("Please input only jpeg or png files");
        }
    });
    req.body.Image = photo.url;
    console.log(req.body);
    const member = new Member({
        Name: req.body.Name,
        Team: req.body.Team,
        Nickname: req.body.Nickname,
        Birthday: req.body.Birthday,
        Age: req.body.Age,
        Constellation: req.body.Constellation,
        Birthplace: req.body.Birthplace,
        Height: req.body.Height,
        PersonalSpecialties: req.body.PersonalSpecialties,
        Hobbies: req.body.Hobbies,
        Image: req.body.Image
    });
    await member.save().then(
        data => res.json(data))
        .catch(
            err => res.json({ message: err }));
})


module.exports = route;