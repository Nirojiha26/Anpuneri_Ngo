const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const updatedSettings = [
  // Home Page Settings
  {
    key: 'home_hero_title',
    value: 'Empowering Communities,\nTransforming Lives',
  },
  {
    key: 'home_hero_subtitle',
    value: 'Anpuneri Humanitarian Relief Org. Help the needy people. We assist war-affected Tamil Sri Lankans by providing support such as food, housing, and education.',
  },
  {
    key: 'home_mission_title',
    value: 'Help the needy people',
  },
  {
    key: 'home_mission_desc1',
    value: 'Anpuneri Humanitarian Relief Org is dedicated to assisting war-affected Tamil Sri Lankans by providing essential support such as food and emergency relief.',
  },
  {
    key: 'home_mission_desc2',
    value: 'We build housing for widowed families and the disabled, distribute laptops and educational supplies for students, and host motivational workshops to empower the community.',
  },

  // About Page Settings
  {
    key: 'about_story_title',
    value: 'Anpuneri Humanitarian Relief Org',
  },
  {
    key: 'about_story_p1',
    value: 'Anpuneri Humanitarian Relief Org assists war-affected Tamil Sri Lankans. Our mission is to "Help the needy people".',
  },
  {
    key: 'about_story_p2',
    value: 'We provide vital support including food, and housing for widowed families and the disabled. We believe in uplifting our community by addressing their most immediate and long-term needs.',
  },
  {
    key: 'about_story_p3',
    value: 'Education is also a core part of our mission. We distribute laptops and educational supplies for students, and we regularly host motivational workshops to empower the next generation.',
  },
];

const updateSettingsContent = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const setting of updatedSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        { $set: { value: setting.value } },
        { new: true }
      );
      console.log(`Updated setting: ${setting.key}`);
    }

    console.log('Settings updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateSettingsContent();
