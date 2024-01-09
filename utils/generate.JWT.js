const jwt = require('jsonwebtoken');

module.exports = async (payload)=>{

    const token = await jwt.sign(payload,process.env.JWT_KEY);

    return token;
}