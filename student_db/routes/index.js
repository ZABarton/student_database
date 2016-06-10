var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

var db
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://' + process.env.DBUSER + ':' + process.env.DBPASS + '@ds013004.mlab.com:13004/student_db', function(err, database){
  if (err) {
    console.log(err)
  } else {
    console.log("Connected to db");
    db = database;
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var cursor = db.collection('students').find().toArray(function(err, results){
    if (err) {
      console.log("error encountered")
    } else {
      var students = (results[0]["students"])
      res.render('index', { title: 'Student Database', students: students});
    }
  });

});

router.post('/', function(req, res, next) {
	var first = (req.body.firstname);
	var last = (req.body.lastname);
	var cursor = db.collection('students').find({}, {'students': {$elemMatch:{'first':first}}}).toArray(function(err, results){
		console.log("Here are the results")
		console.log(results)
		var students = (results[0]["students"])
		res.render('index', { title: 'Search Results', students: students});
	});
});

module.exports = router;
