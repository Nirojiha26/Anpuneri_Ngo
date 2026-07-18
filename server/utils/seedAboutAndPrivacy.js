const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Settings = require('../models/Settings');
const connectDB = require('../config/db');

const updates = [
  { key: 'about_story_p1', value: 'In the aftermath of Sri Lanka’s civil war, a group of final-year students at the University of Peradeniya organized “Neashakkarangal” in 2009—providing food, medicine, and clothing to displaced families living in camps. To sustain their relief efforts, they hosted a community barbecue that August, raising funds to build portable washrooms and launching the annual event that still fuels our work today.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 1', isPublic: true },
  { key: 'about_story_p2', value: 'By January 2010, growing support led to our first formal meeting in Canada, where members elected a committee and christened our movement “Anpuneri,” committing themselves to serve those most in need.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 2', isPublic: true },
  { key: 'about_story_p3', value: 'Recognizing the scale of humanitarian needs, Anpuneri incorporated as a Canadian non-profit in 2010 with a clear mandate: to assist orphaned, disabled, disaster-affected, and economically disadvantaged communities; to raise awareness in Canada and abroad; and to support other credible organizations on targeted relief projects.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 3', isPublic: true },
  { key: 'about_story_p4', value: 'From sponsoring children’s education and micro-credit programs to financing mobility devices and sanitation facilities, we have stayed true to these founding principles ever since.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 4', isPublic: true },
  { key: 'about_story_p5', value: 'Over the years, our donor base has expanded alongside our projects. In 2017, we formed the Anpuneri Panchenai Village Development Society—partnering with local leaders to plan, implement, and monitor initiatives in Panchenai, from clean-water wells and playgrounds to natural elephant fencing and after-school programs.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 5', isPublic: true },
  { key: 'about_story_p6', value: 'This village-led model has produced dramatic results and inspired new ventures in Periyakulam and beyond, demonstrating the power of transparent, community-driven development.', type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Paragraph 6', isPublic: true },
  
  // Privacy & Terms
  { key: 'privacy_content', value: 'We collect information you provide directly... We do not sell, trade, or rent your personal information...', type: 'string', inputType: 'textarea', group: 'general', label: 'Privacy Policy Content', isPublic: true },
  { key: 'terms_content', value: 'By accessing and using our website, you accept and agree to be bound by these Terms of Service...', type: 'string', inputType: 'textarea', group: 'general', label: 'Terms of Service Content', isPublic: true },
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

    console.log('Story and Privacy data seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

runUpdates();
