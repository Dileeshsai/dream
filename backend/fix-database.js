const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'dream_society',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

async function fixPhotoUrlColumn() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Altering photo_url column...');
    await sequelize.query('ALTER TABLE profiles MODIFY COLUMN photo_url VARCHAR(1000)');
    console.log('✅ photo_url column successfully modified to VARCHAR(1000)');

    console.log('Verifying the change...');
    const [results] = await sequelize.query('DESCRIBE profiles');
    const photoUrlColumn = results.find(col => col.Field === 'photo_url');
    console.log('Current photo_url column definition:', photoUrlColumn);

    console.log('✅ Database fix completed successfully!');
  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the fix
fixPhotoUrlColumn(); 