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
  var cursor = db.collection('students').aggregate([
      {"$unwind":"$students"}
    ]).toArray(function(err, results){
    if (err) {
      console.log("error encountered")
    } else {
      var students = results
      res.render('index', { title: 'Student Database', students: students});
    }
  });

});

router.post('/', function(req, res, next) {
	var first = (req.body.firstname);
	var last = (req.body.lastname);
	var cursor = db.collection('students').aggregate([
      {"$unwind":"$students"},
      {"$match": {"students.first": {$regex: first, $options: 'i'}}},
      {"$match": {"students.last": {$regex: last, $options: 'i'}}}
    ]).toArray(function(err, results){
		  console.log("Here are the results")
		  console.log(results.length)
		  var students = results;
		res.render('index', { title: 'Search Results', students: students});
	});
});

module.exports = router;

router.get('/detail', function(req, res, next){
  console.log(req.query);
  var first = (req.query.first);
  var last = (req.query.last);
  var cursor = db.collection('students').aggregate([
    {"$unwind":"$students"},
    {"$match": {"students.first": first}},
    {"$match": {"students.last": last}}
    ]).toArray(function(err, results){
    var student = results;
    console.log(student);
  res.render('detail', { title: 'Detailed Student View', student: student });
  });
});