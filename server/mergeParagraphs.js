const mongoose = require('mongoose');
require('dotenv').config();
const Settings = require('./models/Settings');
const connectDB = require('./config/db');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const settings = await Settings.find({});
    const getVal = (key) => {
      const s = settings.find(s => s.key === key);
      return s ? s.value : '';
    };

    const aboutContent = [1,2,3,4,5,6].map(i => getVal(`about_story_p${i}`)).filter(Boolean).join('\n\n');
    const missionContent = [1,2].map(i => getVal(`mission_p${i}`)).filter(Boolean).join('\n\n');
    const visionContent = [1,2,3].map(i => getVal(`vision_p${i}`)).filter(Boolean).join('\n\n');

    if (aboutContent) {
      await Settings.findOneAndUpdate(
        { key: 'about_story_content' },
        { key: 'about_story_content', value: aboutContent, type: 'string', inputType: 'textarea', group: 'about', label: 'About Story Content', isPublic: true },
        { upsert: true, new: true }
      );
    }

    if (missionContent) {
      await Settings.findOneAndUpdate(
        { key: 'mission_content' },
        { key: 'mission_content', value: missionContent, type: 'string', inputType: 'textarea', group: 'about', label: 'Mission Content', isPublic: true },
        { upsert: true, new: true }
      );
    }

    if (visionContent) {
      await Settings.findOneAndUpdate(
        { key: 'vision_content' },
        { key: 'vision_content', value: visionContent, type: 'string', inputType: 'textarea', group: 'about', label: 'Vision Content', isPublic: true },
        { upsert: true, new: true }
      );
    }

    // Delete old keys
    const keysToDelete = [
      'about_story_title',
      'about_story_p1', 'about_story_p2', 'about_story_p3', 'about_story_p4', 'about_story_p5', 'about_story_p6',
      'mission_p1', 'mission_p2',
      'vision_p1', 'vision_p2', 'vision_p3'
    ];

    await Settings.deleteMany({ key: { $in: keysToDelete } });
    console.log('Merged paragraphs and deleted old fields');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
