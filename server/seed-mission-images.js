const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const images = [
      {
        key: 'home_mission_image_1',
        value: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
        type: 'string',
        inputType: 'image',
        group: 'general',
        label: 'Mission Image 1',
        isPublic: true
      },
      {
        key: 'home_mission_image_2',
        value: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=600',
        type: 'string',
        inputType: 'image',
        group: 'general',
        label: 'Mission Image 2',
        isPublic: true
      },
      {
        key: 'home_mission_image_3',
        value: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
        type: 'string',
        inputType: 'image',
        group: 'general',
        label: 'Mission Image 3',
        isPublic: true
      },
      {
        key: 'home_mission_image_4',
        value: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
        type: 'string',
        inputType: 'image',
        group: 'general',
        label: 'Mission Image 4',
        isPublic: true
      }
    ];

    for (const img of images) {
      await Settings.findOneAndUpdate({ key: img.key }, img, { upsert: true });
    }
    console.log('Seeded mission images');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
