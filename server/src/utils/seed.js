import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({
    $or: [{ email: env.seedAdminEmail }, { username: env.seedAdminUsername }],
  });

  if (existing) {
    console.log('Seed user already exists:', env.seedAdminEmail);
    process.exit(0);
  }

  await User.create({
    username: env.seedAdminUsername,
    email: env.seedAdminEmail,
    password: env.seedAdminPassword,
  });

  console.log('Seed user created');
  console.log('Email:', env.seedAdminEmail);
  console.log('Username:', env.seedAdminUsername);
  console.log('Password:', env.seedAdminPassword);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
