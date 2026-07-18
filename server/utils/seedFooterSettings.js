const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const updates = [
  { key: 'footer_cta_title', value: 'Ready to Make a Difference?', type: 'string', inputType: 'text', group: 'appearance', label: 'Footer CTA Title', isPublic: true },
  { key: 'footer_cta_desc', value: 'Join thousands of donors and volunteers changing lives every day.', type: 'string', inputType: 'textarea', group: 'appearance', label: 'Footer CTA Description', isPublic: true },
];

const runUpdates = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const update of updates) {
      await Settings.findOneAndUpdate(
        { key: update.key },
        { $set: update },
        { new: true, upsert: true }
      );
      console.log(`Updated setting: ${update.key}`);
    }

    console.log('Footer CTA data seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

runUpdates();
