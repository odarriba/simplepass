var express = require("express"),
    app = express(),
    expressSession = require('express-session'),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose'),
    config = require('./config');

app.use(expressSession({secret: config.app.secretKey, resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Load (and execute) the initializers
require('./initializers');

// API routes
var users = express.Router();

users.route('/users')
  .get(controllers.users.findAllUsers)
  .post(controllers.users.addUser);

users.route('/user/:id')
  .get(controllers.users.findById)
  .put(controllers.users.updateUser)
  .delete(controllers.users.deleteUser);

app.use('/api', users);

// Create base MongoDB URL
var dbUrl = config.database.server+'/'+config.database.database;

// If there are login credentials, use them
if (config.database.username !== null) {
  dbUrl = config.database.username+':'+config.database.password+'@'+dbUrl;
}

// Connect!
mongoose.connect('mongodb://'+dbUrl, function(err, res) {
    if(err) { throw err; }
    console.log('[INIT] Connected to MongoDB database at '+dbUrl);
});

// var models = require('./models/user')(app, mongoose);

app.listen(3000, function() {
  console.log("[INIT] Webserver server running on http://0.0.0.0:3000");
});
