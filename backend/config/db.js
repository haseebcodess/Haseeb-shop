const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for performance
    mongoose.connection.once('open', async () => {
      const db = mongoose.connection.db;
      await db.collection('products').createIndex({ name: 'text', shopName: 'text' });
      await db.collection('products').createIndex({ createdAt: -1 });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    });
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
