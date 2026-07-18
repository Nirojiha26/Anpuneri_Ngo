const mongoose = require('mongoose');
require('dotenv').config();
const Settings = require('./models/Settings');
const connectDB = require('./config/db');

const newSettings = [
  { key: 'mission_quote', value: 'To empower under-resourced individuals and families through education, healthcare, and emergency support — enabling them to build lives of dignity, independence, and hope.', type: 'string', inputType: 'textarea', group: 'about', label: 'Mission Quote', isPublic: true },
  { key: 'mission_p1', value: 'Our mission drives every program, every partnership, and every dollar we spend. We focus on the root causes of poverty — lack of education, limited healthcare access, and vulnerability to crises — and address them directly.', type: 'string', inputType: 'textarea', group: 'about', label: 'Mission Paragraph 1', isPublic: true },
  { key: 'mission_p2', value: 'Education is at our core. We believe that when a child stays in school, the entire trajectory of their family changes. Our programs remove every financial barrier that stands between a student and their education.', type: 'string', inputType: 'textarea', group: 'about', label: 'Mission Paragraph 2', isPublic: true },
  { key: 'vision_quote', value: 'A world where every person — regardless of where they were born or how little they have — has the opportunity to learn, grow, and thrive.', type: 'string', inputType: 'textarea', group: 'about', label: 'Vision Quote', isPublic: true },
  { key: 'vision_p1', value: 'We envision communities where children don\'t have to choose between education and survival. Where a medical emergency doesn\'t push a family into permanent poverty. Where the next generation rises on merit — not on the luck of circumstance.', type: 'string', inputType: 'textarea', group: 'about', label: 'Vision Paragraph 1', isPublic: true },
  { key: 'vision_p2', value: 'We know we can\'t solve everything at once. But we believe that by building strong local programs, developing trusted community partnerships, and inspiring generous giving — we move consistently closer to that world.', type: 'string', inputType: 'textarea', group: 'about', label: 'Vision Paragraph 2', isPublic: true },
  { key: 'vision_p3', value: 'Every scholarship awarded, every supply kit distributed, every health camp run brings us closer. Our vision is ambitious — and that is exactly the point.', type: 'string', inputType: 'textarea', group: 'about', label: 'Vision Paragraph 3', isPublic: true },
];

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');
    for (const setting of newSettings) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        { $setOnInsert: setting },
        { upsert: true, new: true }
      );
      console.log(`Added ${setting.key}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
