const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const keysToMakePublic = [
  'org_name',
  'org_phone',
  'org_email',
  'org_address',
  'org_tagline',
  'social_youtube',
  'about_story_title',
  'about_story_p1',
  'about_story_p2',
  'about_story_p3',
  'about_explore1_desc',
  'about_explore2_desc',
  'about_value1_desc',
  'about_value2_desc',
  'about_value3_desc',
  'about_value4_desc',
];

const fixSettings = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    await Settings.updateMany(
      { key: { $in: keysToMakePublic } },
      { $set: { isPublic: true } }
    );
    
    console.log('Fixed isPublic flag for settings!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixSettings();
