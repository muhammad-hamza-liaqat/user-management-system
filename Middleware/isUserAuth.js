const userModel = require("../Models/userModel");
const apiResponse = require("../Middleware/responseFormat");

const isthisUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({
    where: {
      email: email,
      isVerified: true
    },
  });
  if (user || user.isAdmin === false || user.isAdmin === true) {
    console.log("middleware exceution....");
    next();
  } else {
    return res.sendError({ message: "no access to this system" }, 403);
  }
};

module.exports = isthisUser;
