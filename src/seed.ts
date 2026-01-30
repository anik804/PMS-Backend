import dotenv from 'dotenv';
import connectDB from './config/db.ts';
import User, { UserRole, UserStatus } from './models/User.ts';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to DB...');
    await connectDB();
    const adminEmail = 'admin@example.com';
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log('Admin user found. Deleting and recreating...');
      await User.deleteOne({ email: adminEmail });
    }

    console.log('Creating new admin user...');
    user = await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'adminpassword123',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    console.log('Admin user created successfully.');


    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedAdmin();
