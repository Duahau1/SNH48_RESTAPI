const mongoose = require('mongoose');

var Schema = mongoose.Schema;
let member = new Schema({
    Name: {
        type: String,
        required: true
    },
    Team: {
        type: String,
        required :true
    },
    Nickname: {
        type: String,
        required :true
    },
    Birthday: {
        type: String,
        required: true
    },
    Age: {
        type: String
    },
    Constellation: {
        type: String
    },
    Birthplace: {
        type: String
    },
    Height: {
        type: String
    },
    PersonalSpecialties: {
        type: String
    },
    Hobbies: {
        type: String
    },
    Image:{
        type: String
    }
})
module.exports = mongoose.model('Member', member);