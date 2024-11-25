const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('Passport', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'mysql', // Change this to your database dialect: 'postgres', 'sqlite', 'mssql', etc.
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
