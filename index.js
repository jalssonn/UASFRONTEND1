// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import local modules
const connectDB = require('./src/config/db');
const { handleUnhandledRejection, handleUncaughtException } = require('./src/utils/processEvents');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Initialize express
const app = express();

// Connect to Database
connectDB();

/**
 * Middleware Setup
 */
// CORS and Parser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

/**
 * Routes Setup
 */
// Base route
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Selamat datang di API',
        version: '1.0.0'
    });
});

// API routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/user'));
app.use('/api/admin', require('./src/routes/admin'));

/**
 * Error Handling
 */
app.use(errorHandler);
app.use(notFound);

/**
 * Server Setup
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('\n🚀 Server berjalan di:');
    console.log(`   - Local: http://localhost:${PORT}`);
    console.log(`   - Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

/**
 * Process Event Handlers
 */
handleUncaughtException();
handleUnhandledRejection(server);