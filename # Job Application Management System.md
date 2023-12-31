 # Job Application Management System

This repository contains the code for a job application management system built using Node.js, Express, and Sequelize. The system allows users to submit job applications, upload their resumes, and track the status of their applications. It also includes features for HR managers to review applications, accept or reject candidates, and send email notifications to applicants.

## Prerequisites

To run this application, you will need the following:

* Node.js (version 16 or higher)
* npm (version 7 or higher)
* PostgreSQL database

## Installation

1. Clone the repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file in the root directory of the project and add the following environment variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=job_application_db
```

4. Replace the values with your actual database connection details.
5. Run `npx sequelize-cli db:migrate` to create the database tables.
6. Run `npx sequelize-cli db:seed:all` to populate the database with some sample data.

## Usage

To start the application, run `npm start`. The application will be available at `http://localhost:3000`.

## Features

The job application management system includes the following features:

* **User Registration:** Users can create an account by providing their name, email address, and password.
* **Job Application Submission:** Users can submit job applications by filling out a form and uploading their resume.
* **Resume Download:** HR managers can download resumes of applicants.
* **Application Status Tracking:** Users can track the status of their applications by logging into their account.
* **Application Review:** HR managers can review applications and accept or reject candidates.
* **Email Notifications:** Applicants receive email notifications when their application status changes.

## Code Overview

The codebase is organized into several modules, each responsible for a specific functionality. Here is a brief overview of the key modules:

* **models:** This module contains the Sequelize models for the database tables.
* **controllers:** This module contains the Express controllers for handling HTTP requests.
* **services:** This module contains the services for performing various tasks, such as sending email notifications.
* **middleware:** This module contains

Generated by [BlackboxAI](https://www.blackbox.ai)