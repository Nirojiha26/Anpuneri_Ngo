const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const updates = [
  { key: 'org_address', value: 'Ontario, Canada' },
  { key: 'org_tagline', value: 'Supporting war-affected communities in Sri Lanka with compassion and dedication since 2009.' },
  { key: 'about_story_title', value: 'About Anpuneri' },
  { key: 'about_story_p1', value: 'Since 2009, Anpuneri Humanitarian Relief Org has been supporting war-affected communities in Sri Lanka with compassion and dedication.' },
  { key: 'about_story_p2', value: 'As a registered non-profit based in Ontario, Canada, we focus on education, child nutrition, and sustainable community development for Tamil families who suffered during the civil war.' },
  { key: 'about_story_p3', value: 'What We Do: We provide school supplies, scholarships, and educational support. We run nutrition programs, such as daily meals for preschool children. We support village development projects (e.g., Panchenai Village), offer sponsorship for orphaned and vulnerable students, and respond to emergency needs.' },
  { key: 'about_explore1_desc', value: 'To help the needy people — especially children and families affected by war — by providing education, nutrition, healthcare support, and long-term rehabilitation.' },
  { key: 'about_explore2_desc', value: 'To create a brighter future where every child has access to quality education and the opportunity to overcome the impact of conflict.' },
  { key: 'about_value1_desc', value: 'We act with complete transparency and accountability in everything we do.' },
  { key: 'about_value2_desc', value: 'We serve with empathy, dignity, and care for every individual.' },
  { key: 'about_value3_desc', value: 'We focus on sustainable, long-term change rather than temporary relief.' },
  { key: 'about_value4_desc', value: 'We work closely with local communities, partners, and donors.' },
];

const runUpdates = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    for (const update of updates) {
      await Settings.findOneAndUpdate(
        { key: update.key },
        { $set: { value: update.value } },
        { new: true, upsert: true } // upsert true just in case it doesn't exist
      );
      console.log(`Updated setting: ${update.key}`);
    }

    console.log('Real data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

runUpdates();
