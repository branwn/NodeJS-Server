var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

    fs.readFile('./public/index.html','utf-8',function(err,data){
        if( err ){
          // throw err ;
          res.statusCode = 403;
          // res.setHeader('Content-Type', 'text/plain');
          // res.end('Fatal Failure!');
          res.render('index', { title: 'Fatal Failure!' });
        } else {
          res.writeHead(200,{'Content-Type':'text/html'})
          res.end(data);
        }

    });
});
router.get('/login', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  fs.readFile('./public/login.html','utf-8',function(err,data){
    if( err ){
      // throw err ;
      res.statusCode = 403;
      // res.setHeader('Content-Type', 'text/plain');
      // res.end('Fatal Failure!');
      res.render('index', { title: 'Fatal Failure!' });
    } else {
      res.writeHead(200,{'Content-Type':'text/html'})
      res.end(data);
    }

  });
});

module.exports = router;
