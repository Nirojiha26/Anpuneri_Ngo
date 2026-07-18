const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const updates = [
  { key: 'org_name', value: 'Anpuneri Humanitarian Relief Org' },
  { key: 'org_phone', value: '+64 7-800 8724' },
  { key: 'org_email', value: 'anpunericanada@gmail.com' },
  { key: 'social_youtube', value: 'https://www.youtube.com/@anpunerianpu8390' },
];

const runUpdates = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const update of updates) {
      await Settings.findOneAndUpdate(
        { key: update.key },
        { $set: { value: update.value } },
        { new: true, upsert: true }
      );
      console.log(`Updated setting: ${update.key}`);
    }

    console.log('Real data seeding 2 completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

runUpdates();
