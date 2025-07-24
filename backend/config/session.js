const session = require('express-session');
const MongoStore = require('connect-mongo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compilehub';

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 
  }),
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
};

module.exports = session(sessionConfig);