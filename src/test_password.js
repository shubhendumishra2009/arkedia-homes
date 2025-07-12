const { sequelize } = require('./models');
const { User } = require('./models');

async function testPassword() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    const admin = await User.findOne({where: {role: 'admin'}});
    console.log('Admin user:', admin.email);
    
    // Test if the user's validPassword method works
    const testPasswords = [
      'admin123', 'password', 'password123', 'admin', '123456', 'Admin123', 'admin@123',
      '1234', '12345', 'qwerty', 'welcome', 'welcome123', 'letmein', 'test', 'test123',
      'arkedia', 'arkedia123', 'homes', 'homes123', 'arkediahomes', 'arkediahomes123',
      'shubhu', 'shubhu123', 'mishra', 'mishra123', 'shubhumishra', 'shubhumishra123',
      '1234567', '12345678', '123456789', '1234567890'
    ];
    
    for (const pass of testPasswords) {
      const isMatch = await admin.validPassword(pass);
      console.log(`Password '${pass}': ${isMatch ? 'MATCH' : 'no match'}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

testPassword();