const mongoose = require('mongoose');
require('dotenv').config();
const Settings = require('./models/Settings');
const connectDB = require('./config/db');

const fixGroups = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    await Settings.updateMany(
      { key: { $regex: /^about_story_/ } },
      { $set: { group: 'about' } }
    );
    console.log('Updated about_story_* to group about');

    await Settings.updateMany(
      { key: { $in: ['privacy_content', 'terms_content'] } },
      { $set: { group: 'legal' } }
    );
    console.log('Updated privacy and terms to group legal');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixGroups();
