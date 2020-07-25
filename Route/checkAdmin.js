const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
    try{
    let status = jwt.verify(req.headers.token.split(" ")[1], process.env.JWT_ADMIN);
    req.userData = status;
    }
    catch(err){
        res.json({Message: "Auth failed"});
    }
    next();
}