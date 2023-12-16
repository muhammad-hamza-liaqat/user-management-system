const userModel = require("../Models/userModel");

const isthisAdmin = async (req,res,next)=>{
    const {email} = req.body;
    const user = await userModel.findOne({
        where:{
            email:email
        }
    });
    if (user && user.isAdmin && user.isVerified === true){
        console.log("login");
        next();
    }
    else{
        return res.status(403).json({ message: "only admin can login"})
    }
}

module.exports = isthisAdmin