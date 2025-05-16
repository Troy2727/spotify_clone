import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create a test user
    const newUser = await User.create({
      clerkId: 'test_user_2',
      fullName: 'Another Test User',
      imageUrl: 'https://via.placeholder.com/150'
    });
    
    console.log('Test user created successfully:', newUser);
    
    // List all users
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers);
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestUser();
