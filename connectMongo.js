const mongoose = require('mongoose')

const connectDB = async () => {
  let retries = 5;
  while (retries) {
      try {
          console.log('Attempting to connect to MongoDB...');
          await mongoose.connect(process.env.MONGO_URI);
          console.log('MongoDB connected successfully');
          break;
      } catch (error) {
          console.error('MongoDB connection error:', error.message);
          retries -= 1;
          console.log(`Retries left: ${retries}`);
          if (retries === 0) {
              process.exit(1);
          }
          await new Promise(res => setTimeout(res, 5000)); // Warte 5 Sekunden vor dem nächsten Versuch
      }
  }
  };

module.exports = connectDB
