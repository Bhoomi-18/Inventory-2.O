// server/src/seed.ts - Updated to use modelName
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Asset from './models/Asset';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/it-inventory');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Asset.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
      department: 'IT'
    });

    const managerUser = new User({
      name: 'IT Manager',
      email: 'manager@company.com', 
      password: await bcrypt.hash('manager123', 10),
      role: 'manager',
      department: 'IT'
    });

    const employeeUser = new User({
      name: 'John Employee',
      email: 'employee@company.com',
      password: await bcrypt.hash('employee123', 10),
      role: 'employee',
      department: 'Marketing'
    });

    await adminUser.save();
    await managerUser.save();
    await employeeUser.save();
    console.log('Created demo users');

    // Create demo assets
    const assets = [
      {
        assetTag: 'LT-001',
        name: 'Dell Latitude 5520',
        category: 'laptop',
        brand: 'Dell',
        modelName: 'Latitude 5520', // Changed from 'model' to 'modelName'
        serialNumber: 'DL5520001',
        purchaseDate: new Date('2023-01-15'),
        purchasePrice: 1200.00,
        warrantyExpiration: new Date('2026-01-15'),
        status: 'available',
        location: 'IT Storage Room',
        specifications: {
          processor: 'Intel Core i7-1165G7',
          ram: '16GB DDR4',
          storage: '512GB SSD',
          os: 'Windows 11 Pro'
        },
        createdBy: adminUser._id
      },
      {
        assetTag: 'DT-001',
        name: 'HP EliteDesk 800',
        category: 'desktop',
        brand: 'HP',
        modelName: 'EliteDesk 800 G8', // Changed from 'model' to 'modelName'
        serialNumber: 'HP800001',
        purchaseDate: new Date('2023-02-20'),
        purchasePrice: 950.00,
        warrantyExpiration: new Date('2026-02-20'),
        status: 'assigned',
        assignedTo: employeeUser._id,
        location: 'Office Floor 2',
        specifications: {
          processor: 'Intel Core i5-11500',
          ram: '8GB DDR4',
          storage: '256GB SSD',
          os: 'Windows 11 Pro'
        },
        createdBy: adminUser._id
      },
      {
        assetTag: 'MN-001',
        name: 'Samsung 27" Monitor',
        category: 'monitor',
        brand: 'Samsung',
        modelName: 'S27F350FHU', // Changed from 'model' to 'modelName'
        serialNumber: 'SM27001',
        purchaseDate: new Date('2023-03-10'),
        purchasePrice: 250.00,
        warrantyExpiration: new Date('2026-03-10'),
        status: 'available',
        location: 'IT Storage Room',
        specifications: {
          other: '27 inch, 1920x1080, HDMI, VGA'
        },
        createdBy: adminUser._id
      },
      {
        assetTag: 'PR-001',
        name: 'HP LaserJet Pro',
        category: 'printer',
        brand: 'HP',
        modelName: 'LaserJet Pro M404dn', // Changed from 'model' to 'modelName'
        serialNumber: 'HP404001',
        purchaseDate: new Date('2023-04-05'),
        purchasePrice: 300.00,
        warrantyExpiration: new Date('2025-04-05'),
        status: 'maintenance',
        location: 'Office Floor 1',
        specifications: {
          other: 'Monochrome Laser Printer, Duplex, Network'
        },
        notes: 'Paper jam issue reported, under maintenance',
        createdBy: managerUser._id
      },
      {
        assetTag: 'RT-001',
        name: 'Cisco Router',
        category: 'router',
        brand: 'Cisco',
        modelName: 'ISR 4321', // Changed from 'model' to 'modelName'
        serialNumber: 'CS4321001',
        purchaseDate: new Date('2022-12-15'),
        purchasePrice: 1500.00,
        warrantyExpiration: new Date('2025-12-15'),
        status: 'available',
        location: 'Server Room',
        specifications: {
          other: '4-port Gigabit Ethernet, 2 SFP slots'
        },
        createdBy: adminUser._id
      }
    ];

    for (const assetData of assets) {
      const asset = new Asset(assetData);
      await asset.save();
    }

    console.log('Created demo assets');
    console.log('Database seeded successfully!');
    
    console.log('\nDemo login credentials:');
    console.log('Admin: admin@company.com / admin123');
    console.log('Manager: manager@company.com / manager123');
    console.log('Employee: employee@company.com / employee123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();