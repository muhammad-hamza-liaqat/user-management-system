const cron = require('node-cron');
const jobModel = require('../Models/jobModel');

// Schedule the cron job to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    // finding jobs where status: "pending" and making isDeleted: true => soft deleting
    const rejectedjobs = await jobModel.findAll({
      where: {
        status: 'rejected',
      },
    });

    for (const job of rejectedjobs) {
      // Update the job in the database to set isDeleted to true
      await job.update({ isDeleted: true });
    }

    console.log('Cron job executed successfully.');
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
});
console.log('Cron job scheduled to run every 30 minutes.');
