const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const newSettings = [
  // About Values Section Header
  { key: 'about_values_eyebrow', value: 'What Guides Us', type: 'string', inputType: 'text', group: 'about_values', label: 'Eyebrow', isPublic: true },
  { key: 'about_values_title', value: 'Our Core Values', type: 'string', inputType: 'text', group: 'about_values', label: 'Title', isPublic: true },
  { key: 'about_values_subtitle', value: 'These principles shape every decision we make and every program we run.', type: 'string', inputType: 'textarea', group: 'about_values', label: 'Subtitle', isPublic: true },
  
  // Value 1
  { key: 'about_value1_icon', value: '🤝', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 1 Icon', isPublic: true },
  { key: 'about_value1_title', value: 'Integrity', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 1 Title', isPublic: true },
  { key: 'about_value1_desc', value: 'We act with complete transparency and accountability in everything we do.', type: 'string', inputType: 'textarea', group: 'about_values', label: 'Value 1 Description', isPublic: true },
  
  // Value 2
  { key: 'about_value2_icon', value: '💛', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 2 Icon', isPublic: true },
  { key: 'about_value2_title', value: 'Compassion', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 2 Title', isPublic: true },
  { key: 'about_value2_desc', value: 'We lead with empathy, treating every person we serve with dignity and care.', type: 'string', inputType: 'textarea', group: 'about_values', label: 'Value 2 Description', isPublic: true },
  
  // Value 3
  { key: 'about_value3_icon', value: '🌱', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 3 Icon', isPublic: true },
  { key: 'about_value3_title', value: 'Impact', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 3 Title', isPublic: true },
  { key: 'about_value3_desc', value: 'We measure our success by the real, lasting change we create in communities.', type: 'string', inputType: 'textarea', group: 'about_values', label: 'Value 3 Description', isPublic: true },
  
  // Value 4
  { key: 'about_value4_icon', value: '🤲', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 4 Icon', isPublic: true },
  { key: 'about_value4_title', value: 'Collaboration', type: 'string', inputType: 'text', group: 'about_values', label: 'Value 4 Title', isPublic: true },
  { key: 'about_value4_desc', value: 'We believe in the power of partnerships — with communities, donors, and volunteers.', type: 'string', inputType: 'textarea', group: 'about_values', label: 'Value 4 Description', isPublic: true },

  // Explore More Section Header
  { key: 'about_explore_eyebrow', value: 'Explore More', type: 'string', inputType: 'text', group: 'about_explore', label: 'Eyebrow', isPublic: true },
  { key: 'about_explore_title', value: 'Learn About Our Organization', type: 'string', inputType: 'text', group: 'about_explore', label: 'Title', isPublic: true },

  // Explore 1
  { key: 'about_explore1_label', value: 'Our Mission', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 1 Label', isPublic: true },
  { key: 'about_explore1_desc', value: 'The purpose that drives every program and decision we make.', type: 'string', inputType: 'textarea', group: 'about_explore', label: 'Explore 1 Description', isPublic: true },
  { key: 'about_explore1_path', value: '/mission', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 1 Path', isPublic: true },

  // Explore 2
  { key: 'about_explore2_label', value: 'Our Vision', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 2 Label', isPublic: true },
  { key: 'about_explore2_desc', value: 'The future we are working toward — a world without educational poverty.', type: 'string', inputType: 'textarea', group: 'about_explore', label: 'Explore 2 Description', isPublic: true },
  { key: 'about_explore2_path', value: '/vision', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 2 Path', isPublic: true },

  // Explore 3
  { key: 'about_explore3_label', value: 'Our Team', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 3 Label', isPublic: true },
  { key: 'about_explore3_desc', value: 'Meet the dedicated people who give their lives to this mission.', type: 'string', inputType: 'textarea', group: 'about_explore', label: 'Explore 3 Description', isPublic: true },
  { key: 'about_explore3_path', value: '/team', type: 'string', inputType: 'text', group: 'about_explore', label: 'Explore 3 Path', isPublic: true },
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

    console.log('New settings seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

insertNewSettings();
