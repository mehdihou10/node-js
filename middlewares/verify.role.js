module.exports = function (...roles){

    return (req,res,next)=>{

        const role = req.currentUser.role;


        if(!roles.includes(role)){

            const error = new Error();
            error.statusCode = 401;
            error.message = "role not authorized";

            return next(error)
        }

        next();
    }
}