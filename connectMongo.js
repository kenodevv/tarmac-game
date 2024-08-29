const mongoose = require('mongoose')

const connectDB = async () => {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      console.error('Connection URI:', process.env.MONGO_URI);  // Print the URI (remove in production)
      process.exit(1); // Exit process with failure
    }
  };

module.exports = connectDB