const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const jobModel = require('../Models/jobModel');

const cronJobFunction = async () => {
  try {
    // Finding jobs where status: "rejected" and isDelete: false
    const rejectedJobs = await jobModel.findAll({
      where: {
        status: 'rejected',
        isDelete: false,
      },
    });

    for (const job of rejectedJobs) {
      try {
        // soft deleting
        await job.update({ isDelete: true });

        // getting the file name
        const fileName = path.basename(job.cv);

        // if file exits
        if (fileName) {
          // deleting it from the uploads folder
          const filePath = path.join(__dirname, '../uploads', fileName);
          await fs.unlink(filePath);

          console.log(`Job with id ${job.applicantId} soft-deleted, and files deleted successfully.`);
        } else {
          console.error(`Error deleting files: fileName is undefined for job with id ${job.applicantId}`);
        }
      } catch (updateError) {
        console.error('Error updating record:', updateError);
      } 
    }

    console.log('Cron job executed successfully.');
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
};

// scheduler to run after 30 minutes every 30 minutes
cron.schedule('*/30 * * * *', cronJobFunction);

console.log('30Minutes passed time. Running the cron job');

module.exports = cronJobFunction;
