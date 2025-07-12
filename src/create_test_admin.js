const { sequelize } = require('./models');
const { User } = require('./models');

async function createTestAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Create a new admin user for testing
    const newAdmin = await User.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'admin123', // This will be hashed by the model hooks
      role: 'admin',
      is_active: true
    });
    
    console.log('Test admin created successfully:', {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

createTestAdmin();