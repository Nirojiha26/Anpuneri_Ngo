const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const TeamMember = require('../models/TeamMember');
const connectDB = require('../config/db');

const sampleMembers = [
  {
    name: 'Jane Doe',
    designation: 'Executive Director',
    department: 'leadership',
    bio: 'Jane has over 15 years of experience in humanitarian relief and community development.',
    status: 'active',
    sortOrder: 1,
  },
  {
    name: 'John Smith',
    designation: 'Field Operations Manager',
    department: 'community',
    bio: 'John manages our on-the-ground volunteer operations and community outreach programs.',
    status: 'active',
    sortOrder: 2,
  },
];

const insertSampleMembers = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const count = await TeamMember.countDocuments();
    if (count === 0) {
      await TeamMember.insertMany(sampleMembers);
      console.log('Sample team members added successfully!');
    } else {
      console.log('Team members already exist, skipping seed.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

insertSampleMembers();
