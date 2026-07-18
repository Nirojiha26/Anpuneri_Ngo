const mongoose = require('mongoose');
const Gallery = require('./models/Gallery');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const images = await Gallery.find({});
  const defaultImages = [
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800'
  ];
  let i = 0;
  for (const img of images) {
    if (img.image && img.image.includes('unsplash.com')) {
      img.image = defaultImages[i % defaultImages.length];
      await img.save({ validateBeforeSave: false });
      i++;
    }
  }

  console.log('Gallery images fixed');
  mongoose.disconnect();
});
