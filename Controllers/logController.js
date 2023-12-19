const logModel = require("../Models/logModel");

const getLogs = async (req, res) => {
  try {
    const logs = await logModel.findAll({
      attributes: [
        "id",
        "level",
        "host",
        "connection",
        "statusCode",
        "userAgent",
        "accept",
        "userName",
        "createdAt",
      ],
      where: {
        level: "post",
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getLogs;