const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
    try{
    
    let status = jwt.verify(req.headers.token.split(" ")[1], process.env.JWT_ADMIN,(err,decode)=>{
        if(err){
            let common = jwt.verify(req.headers.token.split(" ")[1], process.env.JWT_TOKEN,(e, message)=>{
                if(e){
                    var message ={"Message":"Auth failed"};
                    throw new Error(message);
                }
            })
        }
    });
    next();
    }
    catch(err){
        res.json({Message: "Auth failed"});
        return
    }

}