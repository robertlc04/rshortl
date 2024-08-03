const Router = require('express').Router;
const homepage = require('./homepage');
const shorturl = require('./shorturl');
const errorHandler = require('../middleware/errorHandlers');


const router = new Router();

const routerServer =  (app) => {
    app.use('/', router)
    router.get('/', homepage);
    router.post('/shorturl',  errorHandler.urlErrors, shorturl.shortlinkPost);
}

module.exports = routerServer