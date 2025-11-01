  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const { connectDB, closeDB } = require('./config/database');
  const sessionConfig = require('./config/session');

  const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
  const apiRoutes = require('./routes/auth');
  const { startCleanupService } = require('./services/cleanupService');

  const app = express();
  const PORT = 5000;

  connectDB();

  app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
  credentials: true
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(sessionConfig);

  app.get('/', (req, res) => {
    res.json({ 
      message: 'compilehub Backend Server is running!',
      version: '2.0.0',
      features: ['MongoDB Integration', 'Multer File Handling', 'User Analytics']
    });
  });

  app.use('/api', apiRoutes);

  app.use(errorHandler);
  app.use(notFoundHandler);

  startCleanupService();

  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await closeDB();
    process.exit(0);
  });



  app.listen(PORT, () => {
    console.log(`🚀 Backend server running`);
  });