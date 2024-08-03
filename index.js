const process = require('process'); // Get env variables
const express = require('express'); // Get express

const routes = require('./routes/router.js');
const middlewares = require('./middleware/errorHandlers.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.errorLogs);
app.use(middlewares.errorHandler);

try { 
   routes(app);
} catch (error) {
    console.log(error)
    
}

app.listen(process.env.PORT || 3000);