const mongoose = require('mongoose');

var ref = mongoose.Schema;
let ref_token = new ref({
    ref_token: { 
        type: String
    }
});

module.exports = mongoose.model('Ref_Token',ref_token);