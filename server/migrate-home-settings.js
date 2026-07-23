const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const result = await Settings.updateMany(
      { key: { $regex: /^home_/ } },
      { $set: { group: 'home' } }
    );
    console.log(`Updated ${result.modifiedCount} home settings to group 'home'`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
