const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next)=>{

    const authHeaders = req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeaders){
        return res.status(401).json('token required')
    }

    const token = authHeaders.split(" ")[1];

    

  try{

    const decodedToken = jwt.verify(token,process.env.JWT_KEY);

    req.currentUser = decodedToken;

    next()

  } catch(err) {
    res.status(401).json('invalid token')
  }
}

module.exports = verifyToken;