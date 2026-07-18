const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const newSettings = [
  { key: 'contact_header_title', value: 'Contact Us', type: 'string', inputType: 'text', group: 'contact', label: 'Contact Page Title', isPublic: true },
  { key: 'contact_header_desc', value: "We'd love to hear from you. Whether you have a question, partnership inquiry, or just want to connect — reach out.", type: 'string', inputType: 'textarea', group: 'contact', label: 'Contact Page Description', isPublic: true },
  { key: 'contact_section_title', value: 'Get in Touch', type: 'string', inputType: 'text', group: 'contact', label: 'Contact Section Title', isPublic: true },
  { key: 'contact_section_desc', value: 'We respond to all messages within 1–2 business days.', type: 'string', inputType: 'textarea', group: 'contact', label: 'Contact Section Description', isPublic: true },
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

    console.log('Contact settings seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

insertNewSettings();
