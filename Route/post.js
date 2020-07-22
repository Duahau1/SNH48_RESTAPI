const express = require("express");
const route = express.Router();
const Member = require('../Models/Member');
const cloudinary = require('cloudinary').v2;
const upload = require('express-fileupload');
var fs = require('fs');
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
route.get("/", async (req, res) => {
    try {
            const posts = await Member.find();
           return res.json(posts);
          

    }
    catch (err) {
        res.json({ Error: "Not Found" });
    }
});

//Get by ID
route.get("/member/:id", async(req,res)=>{
    try{
        let mem_id= escape(req.params.id); 
        let found = await Member.findById(mem_id).exec();
        res.json(found);
    }
    catch(err){
        res.json({Error: "Not Found"});
    }
})

//Get by team and name 
route.get("/member",async(req,res)=>{
   try {
        if(req.query.team!=undefined && req.query.name != undefined){
        let team = req.query.team;
        let memName = req.query.name;
        let found = await Member.find({ Name:memName , Team: team }).exec();
        res.json(found);
        }
     if(req.query.team!=undefined){
        let team = req.query.team;
        let found = await Member.find({ Team: team }).exec();
        res.json(found);

    }
     if (req.query.name != undefined) {
        let memName = req.query.name;
        let found = await Member.findOne({ Name: memName }).exec();
        res.json(found);

    }
 }
    catch(err){
        res.status(404).json();
    }
})

//Posting to the DB
route.post("/", async (req, res) => {
    let file = req.files.Image;
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