const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const newSettings = [
  { key: 'team_header_title', value: 'Our Team', type: 'string', inputType: 'text', group: 'general', label: 'Team Page Title', isPublic: true },
  { key: 'team_header_desc', value: 'Meet the dedicated individuals who give their expertise and passion to fulfil our mission every day.', type: 'string', inputType: 'textarea', group: 'general', label: 'Team Page Description', isPublic: true },
  { key: 'team_leadership_eyebrow', value: 'Our Leaders', type: 'string', inputType: 'text', group: 'general', label: 'Leadership Eyebrow', isPublic: true },
  { key: 'team_leadership_title', value: 'Leadership Team', type: 'string', inputType: 'text', group: 'general', label: 'Leadership Title', isPublic: true },
  { key: 'team_leadership_subtitle', value: 'The visionaries who guide our strategy and drive our impact.', type: 'string', inputType: 'textarea', group: 'general', label: 'Leadership Subtitle', isPublic: true },
  { key: 'team_program_eyebrow', value: 'Our People', type: 'string', inputType: 'text', group: 'general', label: 'Program Eyebrow', isPublic: true },
  { key: 'team_program_title', value: 'Program Team', type: 'string', inputType: 'text', group: 'general', label: 'Program Title', isPublic: true },
  { key: 'team_program_subtitle', value: 'The talented staff who execute our programs and serve our communities.', type: 'string', inputType: 'textarea', group: 'general', label: 'Program Subtitle', isPublic: true },
];

const insertNewSettings = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const setting of newSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        { $setOnInsert: setting },
        { upsert: true, new: true }
      );
      console.log(`Ensured setting exists: ${setting.key}`);
    }

    console.log('Team settings seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

insertNewSettings();
