const applyJobPage = (req, res) => {
  res.end("applyJob render()");
};
const applyJob = async (req, res) => {
  res.end("hello from applyJob controller");
};

module.exports = { applyJobPage, applyJob };
