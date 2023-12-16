const userModel = require("../Models/userModel");

const isthisUser = async (req,res,next)=>{
    const {email} = req.body;
    const user = await userModel.findOne({
        where:{
            email:email
        }
    })
    if (user && user.isAdmin === true){
        console.log("login");
        next();
    }
    else{
        return res.status(403).json({ message: "only non-admin users can login"})
    }
}

module.exports = isthisUser