const logModel = require("../Models/logModel");
const apiResponse = require("../Middleware/responseFormat");
const activityModel = require("../Models/activityModel")

// const getLogs = async (req, res) => {
//   try {
//     // default page set to 1
//     const page = parseInt(req.query.page) || 1;
//     // number of records in individual page set to 10  by default
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     // calculate offset
//     const offset = (page - 1) * pageSize;
//     const logs = await logModel.findAndCountAll({
//       attributes: [
//         "id",
//         "level",
//         // "host",
//         // "connection",
//         // "statusCode",
//         "userAgent",
//         // "accept",
//         // "userName",
//         // "createdAt",
//       ],
//       where: {
//         level: "post",
//       },
//       limit: pageSize,
//       offset: offset,
//     });
//     const totalRecords = logs.count;
//     const response = {
//       logs: logs.rows,
//       totalRecords: totalRecords,
//       currentPage: page,
//       pageSize: pageSize,
//     };
//     res.sendSuccess({ message: "logs feteched successfully!", response }, 200);
//   } catch (error) {
//     console.error("Error:", error);
//     res.sendError({ message: "Internal Server Error" }, 500);
//   }
// };


const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const { count, rows: logs } = await logModel.findAndCountAll({
      attributes: [
        "id",
        "level",
        // "host",
        // "connection",
        "statusCode",
        "userAgent",
        // "accept",
        "userName",
        // "createdAt",
        "message",
      ],
      
      where: {
        level: ["post", "patch"],
      },
      limit: pageSize,
      offset: offset,
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(count / pageSize);

    // pagination logic and format
    const pagination = {
      totalRecords: count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    // Include page and pageSize in the response object
    const response = {
      logs: logs,
      pagination: pagination,
      currentPage: page,
      pageSize: pageSize,
    };

    res.sendSuccess({ message: "Logs fetched successfully!", response }, 200);
  } catch (error) {
    console.error("Error:", error);
    res.sendError({ message: "Internal Server Error" }, 500);
  }
};

const getLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const { count, rows: activities } = await activityModel.findAndCountAll({
      attributes: [
        "action",
        "username",
        "details",
      ],
      
      // where: {
      //   level: ["post", "patch"],
      // },
      limit: pageSize,
      offset: offset,
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(count / pageSize);

    // pagination logic and format
    const pagination = {
      totalRecords: count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };

    // Include page and pageSize in the response object
    const response = {
      records: activities,
      pagination: pagination,
      currentPage: page,
      pageSize: pageSize,
    };

    res.sendSuccess({ message: "Logs fetched successfully!", response }, 200);
  } catch (error) {
    console.error("Error:", error);
    res.sendError({ message: "Internal Server Error" }, 500);
  }
};

module.exports = {getLogs, getLog};
