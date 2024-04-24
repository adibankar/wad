const jwt = require('jsonwebtoken');
const JWT_SIGNATURE = 'JDFUASHUYRHEGLJKADRGNAJKRFGNJKAESGUKLAHBLSDUFHLAERFEF';

const fetchUser = (req,res,next)=>{
    const authToken = req.header('auth-token');
    if(!authToken){
        return res.status(401).json({error: 'Invalid Authentication Token'});
    }

    try {
        const data =jwt.verify(authToken, JWT_SIGNATURE);
        req.user = data.user;   
        next(); 
    } catch (error) {
        return res.status(401).json({error: 'Invalid Authentication Token'});
    }
}

module.exports = fetchUser;