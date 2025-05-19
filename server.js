import dotenv from 'dotenv';

dotenv.config();
let config;

if (process.env.NODE_ENV !== 'production') {
  config = {
    port: process.env.PORT || 3000,
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'themis',
  };
} else {
  config = {
    port: process.env.PORT || 3000,
    DB_HOST: 'sql309.infinityfree.com',
    DB_PORT: '3306',
    DB_USER: 'if0_39019153',
    DB_PASSWORD: 'iZQyY4TbZP1ijY',
    DB_NAME: 'if0_39019153_themis',
  };
}

export default config;
