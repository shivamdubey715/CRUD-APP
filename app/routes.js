//create a new express router
const express = require('express');
const router = express.Router();
const mainController = require('./controllers/main.controller')
const eventsController = require('./controllers/events.controller')

//export router
module.exports = router;

//define routes
//main routes
router.get('/', mainController.showHome);

//main routes
router.get('/events', eventsController.showEvents);


//seed events
router.get('/events/seed', eventsController.seedEvents);

//create events
router.get('/events/create', eventsController.showCreate);
router.post('/events/create', eventsController.processCreate);

// router.get('/events/:slug/edit', eventsController.showEdit);
// router.post('/events/:slug', eventsController.processEdit);

//show a single event
router.get('/events/:slug', eventsController.showSingle);

