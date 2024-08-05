const Router = require('express').Router;
const homepage = require('./homepage');
const errorpage = require('./errorpage');
const { shortlinkPost} = require('./shorturl');
const { urlErrors } = require('../middleware/errorHandlers');


const router = new Router();

const routerServer =  (app) => {
    app.use('/', router)
    router.get('/', homepage);
    router.get('/error', errorpage);
    router.post('/shorturl',  urlErrors, shortlinkPost);
}

module.exports = routerServer