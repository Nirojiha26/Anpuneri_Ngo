const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const initialSettings = [
  // Home Page Settings
  {
    key: 'home_hero_title',
    value: 'Empowering Communities,\nTransforming Lives',
    type: 'string',
    inputType: 'textarea',
    group: 'appearance',
    label: 'Home Hero Title',
    isPublic: true,
  },
  {
    key: 'home_hero_subtitle',
    value: 'We believe every child deserves education, every family deserves dignity, and every community deserves hope.',
    type: 'string',
    inputType: 'textarea',
    group: 'appearance',
    label: 'Home Hero Subtitle',
    isPublic: true,
  },
  {
    key: 'home_mission_title',
    value: 'We Exist to Lift People Out of Poverty Through Education',
    type: 'string',
    inputType: 'text',
    group: 'appearance',
    label: 'Home Mission Title',
    isPublic: true,
  },
  {
    key: 'home_mission_desc1',
    value: 'Every day, children across our communities wake up facing a choice between eating and going to school. Families break under the weight of poverty, unable to give their children the future they deserve.',
    type: 'string',
    inputType: 'textarea',
    group: 'appearance',
    label: 'Home Mission Description 1',
    isPublic: true,
  },
  {
    key: 'home_mission_desc2',
    value: 'We believe education is the most powerful lever for change. Through scholarships, school supplies, and community programs, we turn that lever for over 1,200 families every year.',
    type: 'string',
    inputType: 'textarea',
    group: 'appearance',
    label: 'Home Mission Description 2',
    isPublic: true,
  },

  // About Page Settings
  {
    key: 'about_story_title',
    value: 'Born from a Belief That Things Can Be Different',
    type: 'string',
    inputType: 'text',
    group: 'general',
    label: 'About Story Title',
    isPublic: true,
  },
  {
    key: 'about_story_p1',
    value: 'Anpuneri was founded in 2010 by a group of educators, doctors, and community leaders who watched helplessly as talented children dropped out of school due to poverty, and families fell deeper into hardship with no safety net.',
    type: 'string',
    inputType: 'textarea',
    group: 'general',
    label: 'About Story Paragraph 1',
    isPublic: true,
  },
  {
    key: 'about_story_p2',
    value: 'They started small — distributing school supplies to 50 students from a single classroom. Today, we support over 1,200 students annually, run health camps, provide emergency relief, and maintain a network of 180+ volunteers who give their time and skills to lift others.',
    type: 'string',
    inputType: 'textarea',
    group: 'general',
    label: 'About Story Paragraph 2',
    isPublic: true,
  },
  {
    key: 'about_story_p3',
    value: 'Our belief has never wavered: given the right support at the right moment, people can and do transform their lives. We are that support system.',
    type: 'string',
    inputType: 'textarea',
    group: 'general',
    label: 'About Story Paragraph 3',
    isPublic: true,
  },

  // Gallery Page Settings
  {
    key: 'gallery_title',
    value: 'Photo Gallery',
    type: 'string',
    inputType: 'text',
    group: 'appearance',
    label: 'Gallery Title',
    isPublic: true,
  },
  {
    key: 'gallery_subtitle',
    value: 'A visual journey through our programs, events, and the communities we serve.',
    type: 'string',
    inputType: 'textarea',
    group: 'appearance',
    label: 'Gallery Subtitle',
    isPublic: true,
  },
];

const seedSettings = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const setting of initialSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        { $setOnInsert: setting },
        { upsert: true, new: true }
      );
      console.log(`Ensured setting exists: ${setting.key}`);
    }

    console.log('Settings seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSettings();
