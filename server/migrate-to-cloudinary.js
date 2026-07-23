const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const Project = require('./models/Project');
const Event = require('./models/Event');
const News = require('./models/News');
const Gallery = require('./models/Gallery');
const Testimonial = require('./models/Testimonial');
const TeamMember = require('./models/TeamMember');
const SuccessStory = require('./models/SuccessStory');
const Slider = require('./models/Slider');
const User = require('./models/User');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localPath, folderName) => {
  try {
    const fullPath = path.join(__dirname, localPath);
    if (!fs.existsSync(fullPath)) return null;
    const result = await cloudinary.uploader.upload(fullPath, { folder: folderName });
    return result.secure_url;
  } catch (err) {
    console.error('Error uploading:', localPath, err.message);
    return null;
  }
};

const migrateModel = async (Model, fields, folderName) => {
  const docs = await Model.find({});
  let count = 0;
  for (let doc of docs) {
    let updated = false;
    for (let field of fields) {
      if (doc[field] && typeof doc[field] === 'string' && doc[field].startsWith('/uploads/')) {
        console.log(`Migrating ${Model.modelName} id: ${doc._id} field: ${field}`);
        const newUrl = await uploadToCloudinary(doc[field], folderName);
        if (newUrl) {
          doc[field] = newUrl;
          updated = true;
        }
      }
    }
    if (updated) {
      await doc.save();
      count++;
    }
  }
  console.log(`Migrated ${count} records for ${Model.modelName}`);
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    await migrateModel(Project, ['image'], 'ngo_projects');
    await migrateModel(Event, ['image'], 'ngo_events');
    await migrateModel(News, ['image'], 'ngo_news');
    await migrateModel(Gallery, ['image'], 'ngo_gallery');
    await migrateModel(Testimonial, ['avatar'], 'ngo_team');
    await migrateModel(TeamMember, ['avatar'], 'ngo_team');
    await migrateModel(SuccessStory, ['image'], 'ngo_uploads');
    await migrateModel(Slider, ['image'], 'ngo_uploads');
    await migrateModel(User, ['avatar'], 'ngo_uploads');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
