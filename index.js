const express = require('express');
const mongoose = require('mongoose');
const Post = require('./Route/post');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Member = require('./Models/Member');
const cron = require('node-cron');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use("/api-doc",express.static('./Route/index.html'));
//Connecting to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Database Set Up Successfully');
});
mongoose.connection.on('error', function (err) {
    console.log('Database Connection Error: ' + err);
});
//Handling different routes
app.get('/', (req, res) => {
    res.send("SNH48 Page");
})
//Scheduling a cron task that runs at 00:00 on day-of-month 1 in every 6th month 0 0 1 */6 *
cron.schedule('0 0 1 */6 *', async() => {
    let members = await Member.find();
    for(mem in members){
        let year = new Date(mem.BirthDay);
        if(year === "Invalid Date"){
            continue;
        }
        else{
            let currentYear = new Date().getFullYear();
            let age = Number(currentYear) - Number(year.getFullYear());
            let patch = String(`${age} Years Old`);
            await Member.updateOne({id: mem._id},{Age: patch});
        }
        console.log("Scheduled to update every 00:00 on day-of-month 1 in every 6th month ");
    }
});


app.use('/api/snh48/',Post);
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})
