const process = require('process'); // Get env variables
const express = require('express'); // Get express

const routes = require('./routes/router.js');
const middlewares = require('./middleware/errorHandlers.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try { 
   routes(app);
} catch (error) {
    console.log(error)
}

app.use(middlewares.urlErrors);
app.use(middlewares.errorLogs);
app.use(middlewares.boomErrorHandler);
app.use(middlewares.errorHandler);



app.listen(process.env.PORT || 3000);