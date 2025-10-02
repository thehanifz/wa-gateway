// Load environment variables
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const helmet = require('helmet');
const { sequelize } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Import services and configurations
const logger = require('./config/logger');
const BaileysService = require('./services/baileys.service');
require('./config/passport'); // Configure passport strategies

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const apiRoutes = require('./routes/api.routes');
const webhookRoutes = require('./routes/webhook.routes');
const { createInitialAdmin } = require('./services/user.service');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdn.tailwindcss.com"],
      "img-src": ["'self'", "data:"], // Allow data: URIs for QR codes
    },
  },
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session store setup
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // use secure cookies in production
    httpOnly: true,
  }
}));
sessionStore.sync();

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/webhook', webhookRoutes);
app.use('/', dashboardRoutes); // Main dashboard routes

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database and Server Initialization
async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sinkronisasi model. Gunakan { alter: true } untuk pengembangan agar tidak kehilangan data.
    // Di produksi, pertimbangkan migrasi manual.
    await sequelize.sync({ alter: true });
    logger.info('All models were synchronized successfully.');

    // Create initial admin user if not exists
    await createInitialAdmin();

    // Initialize Baileys Service and reconnect existing sessions
    BaileysService.init();

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database or start server:', error);
  }
}

startServer();
