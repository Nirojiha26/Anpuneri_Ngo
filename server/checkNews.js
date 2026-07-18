const mongoose = require('mongoose');
const News = require('./models/News');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const news = await News.find({});
  news.forEach(n => console.log(n.title, '->', n.image));
  mongoose.disconnect();
});
