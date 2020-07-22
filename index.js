const express = require('express');
const mongoose = require('mongoose');
const Post = require('./Route/post');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
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
app.use('/api/snh48/',Post);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})
