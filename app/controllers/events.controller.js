const { validationResult } = require('express-validator');
const Event = require('../models/event');

module.exports = {
  showEvents,
  showSingle,
  seedEvents,
  showCreate,
  processCreate,
  // showEdit,
  // processEdit: processEdit,
  // deleteEvent: deleteEvent
};

/**
 * Show all events
 */
async function showEvents(req, res) {
  try {
    const events = await Event.find({});
    res.render('pages/events', { 
      events: events,
      success: req.flash('success')
    });
  } catch (err) {
    res.status(404);
    res.send('Events not found!');
  }
}

/**
 * Show a single event
 */
async function showSingle(req, res) {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) {
      res.status(404);
      return res.send('Event not found!');
    }
    res.render('pages/single', {
      event: event,
      success: req.flash('success')
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while finding the event.');
  }
}

/**
 * Seed the database
 */
function seedEvents(req, res) {
  // create some events
  const events = [
    { name: 'Basketball', description: 'Throwing into a basket.' },
    { name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
    { name: 'Weightlifting', description: 'Lifting heavy things up' },
    { name: 'Ping Pong', description: 'Super fast paddles' }
  ];

  // use the Event model to insert/save
  Event.remove({}, () => {
    for (eve of events) {
      var newEvent = new Event(eve);
      newEvent.save();
    }
  });

  // seeded!
  res.send('Database seeded!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render('pages/create', {
    errors: req.flash('errors')
  });
}

/**
 * Process the creation form
 */
async function processCreate(req, res) {
  // validate information
  const schema = {
    name: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'Name is required.'
    },
    description: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'Description is required.'
    }
  };

  // if there are errors, redirect and save errors to flash
  const result = validationResult(req);
  if (!result.isEmpty()) {
    req.flash('errors', result.array().map(err => err.msg));
    return res.redirect('/events/create');
  }

  // create a new event
  const event = new Event({
    name: req.body.name,
    description: req.body.description
  });

  // save event
  try {
    await event.save();
    // set a successful flash message
    req.flash('success', 'Successfully created event!');
    // redirect to the newly created event
    res.redirect(`/events/${event.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while saving the event.');
  }
}

// show the edit form
// function (req, res){
//   res.render('pages/edit')
// }

// //process the edit form
// function

