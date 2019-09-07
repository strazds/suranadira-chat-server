const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT,
  mode: process.env.MODE,
  mode_development: process.env.MODE_DEVELOPMENT,
  mode_production: process.env.MODE_PRODUCTION
};
