const mongoose = require('mongoose');
const News = require('./models/News');
const Event = require('./models/Event');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const news = await News.find({});
  for (const n of news) {
    if (n.image && n.image.includes('unsplash.com')) {
      n.image = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800'; // valid image
      await n.save({ validateBeforeSave: false });
    }
  }

  const events = await Event.find({});
  for (const e of events) {
    if (e.image && e.image.includes('unsplash.com')) {
      e.image = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'; // valid image
      await e.save({ validateBeforeSave: false });
    }
  }

  console.log('Images fixed');
  mongoose.disconnect();
});
