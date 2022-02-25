var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate')
const cookieParser = require('cookie-parser');
const cors = require('./cors');
const {getToken} = require("../authenticate");

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
        .then((users) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    });
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
    if (! req.body.firstname || ! req.body.lastname) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Fail! Information incomplete!'})
        return;
    }
    User.register(
        new User({username: req.body.username}), req.body.password,
        (err, user) => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return;
          }

          user.firstname = req.body.firstname;
          user.lastname = req.body.lastname;
          user.save((err, user) => {
              if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({err: err})
                  return;
              }
              passport.authenticate('local') (req, res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({success: true, status: 'Registration Successful!'})
              });
          });

        });
});

router.post('/login',
    cors.corsWithOptions,
    passport.authenticate('local'),
    (req, res) => {

    var token = authenticate.getToken({_id: req.user._id});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // set token to json
    res.json({success: true, token: token, status: 'Login Successful!'});

});

router.get('/logout',
    cors.corsWithOptions,
    (req, res) => {
        res.redirect('/');
  // if (req.session) {
  //   req.session.destroy();
  //   res.clearCookie('session-id');
  //   res.redirect('/');
  // }
  // else {
  //   var err = new Error('You are not logged in!');
  //   err.status = 403;
  //   next(err);
  // }
});



module.exports = router;
