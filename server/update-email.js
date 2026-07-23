const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ngo_db').then(async () => {
  const db = mongoose.connection;
  const result = await db.collection('users').updateOne({ email: 'admin@ngo.org' }, { $set: { email: 'admin@anpuneri.org' } });
  console.log('Updated:', result.modifiedCount);
  process.exit();
});
