const mongoose = require('mongoose');
const News = require('./models/News');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    const newArticle = await News.create({
      title: 'Test Article from Script',
      content: '<p>This is a test article created via script to test CRUD.</p>',
      excerpt: 'Test excerpt',
      category: 'news',
      status: 'published',
      author: adminUser._id,
      image: '/uploads/images/test-image.jpg'
    });
    console.log('Successfully created news article:', newArticle.title);
    
    // Now delete it
    await News.findByIdAndDelete(newArticle._id);
    console.log('Successfully deleted the article');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
});
