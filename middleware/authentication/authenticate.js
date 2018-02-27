var User = require('../../models/user');

var authenticate = async function (req, res, next) {
    var token = req.header('x-auth');
    try{
        var user=await User.findByToken(token);
        if(user==null)
            res.status(400).send({message:'invalid token'});
        req.user=user;
        req.token=token;
        next();    
    }catch(e){
        res.status(401).send(e);
    }
}

module.exports={
    authenticate
}