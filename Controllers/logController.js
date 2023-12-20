const logModel = require("../Models/logModel");
const apiResponse = require("../Middleware/responseFormat");


const getLogs = async (req, res) => {
  try {
    // default page set to 1
    const page = parseInt(req.query.page) || 1;
    // number of records in individual page set to 10  by default
    const pageSize = parseInt(req.query.pageSize) || 10;
    // calculate offset
    const offset = (page - 1) * pageSize;
    const logs = await logModel.findAndCountAll({
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
      limit: pageSize,
      offset: offset,
    });
    const totalRecords = logs.count;
    const response = {
      logs: logs.rows,
      totalRecords: totalRecords,
      currentPage: page,
      pageSize: pageSize,
    };
    res.sendSuccess({message: "logs feteched successfully!",response},200);
  } catch (error) {
    console.error("Error:", error);
    res.sendError({ message: "Internal Server Error" },500);
  }
};

module.exports = getLogs;
