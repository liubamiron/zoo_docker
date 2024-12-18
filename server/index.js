require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

// Define CORS options
// Define CORS options
const corsOptions = {
 origin: ['http://localhost:5173', 'http://195.178.106.227'], // Explicitly define allowed origins
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
 allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
 credentials: true, // Allow credentials (cookies or Authorization headers)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Central error handling middleware
app.use(errorHandler);

const start = async () => {
 try {
  await sequelize.authenticate(); // Test the database connection
  await sequelize.sync(); // Sync the models with the database
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // Use template literal for string interpolation
 } catch (e) {
  console.log('Failed to start server:', e);
 }
};

start();
