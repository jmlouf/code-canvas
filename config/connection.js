const Sequelize = require('sequelize');
require('dotenv').config();

// Declares variable holding sequelize instance.
let sequelize;

// This is set if app is deployed to Heroku with JawsDB.
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
// otherwise, connects to local MySQL database.
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}

module.exports = sequelize;