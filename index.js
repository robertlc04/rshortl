const process = require('process'); // Get env variables
const express = require('express'); // Get express
const ejs = require('ejs'); // Get ejs

const routes = require('./routes/router.js');
const middlewares = require('./middleware/errorHandlers.js');

const app = express();

// View engine setup

app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('static'));


// Routes
try { 
   routes(app);
} catch (error) {
    console.log(error)
}

// Error handlers
app.use(middlewares.urlErrors);
app.use(middlewares.errorLogs);
app.use(middlewares.boomErrorHandler);
app.use(middlewares.errorHandler);


// Server
app.listen(process.env.PORT || 3000);