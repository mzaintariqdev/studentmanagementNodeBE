// database.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // MongoDB connection URL
        const dbURI = 'mongodb+srv://zain:123@cluster0.fygtpce.mongodb.net/studentmanagemnt?retryWrites=true&w=majority';

        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
