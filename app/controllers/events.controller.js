const Event = require('../models/event');

module.exports = {
  showEvents: showEvents,
  showSingle: showSingle,
  seedEvents: seedEvents,
  showCreate: showCreate,
  processCreate: processCreate
};
// show all events
function showEvents(req, res) {
  Event.find({})
    .then((events) => {
      res.render("pages/events", { events: events });
    })
    .catch((err) => {
      res.status(404);
      res.send("Event not found");
    });
}

// show a single event
function showSingle(req, res) {
  Event.findOne({ slug: req.params.slug })
    .then((event) => {
      if (event) {
        res.render("pages/single", {
          event: event,
          success: req.flash("success"),
        });
      } else {
        res.status(404);
        res.send("Event not found");
      }
    })
    .catch((err) => {
      res.status(404);
      res.send("Event not found");
    });
}

//seed our database
function seedEvents(req, res) {
  //create some events
  const events = [
    { name: "Basketball", description: "Throwing into a basket." },
    { name: "Swimming", description: "Michael Phelps is the fats fish" },
    { name: "Weightlifting", description: "Lifting heavy things up" },
    { name: "PingPong", description: "Super fast paddles" },
  ];

  //use the event model to insert/save
  Event.remove({}, () => {
    for (eve of events) {
      var newEvent = new Event(eve);
      newEvent.save();
    };
  });
  

  //seeded!
  res.send("Database seeded");
}

//show the create form
function showCreate(req, res) {
  res.render("pages/create", {
    errors: req.flash("errors"),
  });
}

//process the creation form
//process the creation form
function processCreate(req, res) {
  //create a new event
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
  });

  //save event
  event.save((err) => {
    if (err) {
      throw err;
    }
    //set a successuful flash message
    req.flash('success', 'Successfuly created event!');

    //redirect to the newly created event
    res.redirect(`/events/${event.slug}`);
  });
}



