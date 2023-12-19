const logModel = require("../Models/logModel");

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
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getLogs;
