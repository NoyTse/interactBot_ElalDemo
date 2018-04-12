var express = require('express');
const app = express();
var bodyParser = require('body-parser');


//mongoDB variables
const MongoClient = require('mongodb').MongoClient;
const dbUser = "NoyTse";
const dbPass = "Noynoy22";
const connectionString = "mongodb://NoyTse:Noynoy22@ds141889.mlab.com:41889/firstdb";
const collectionName = 'test';
var db;
var ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connecting the mongoDB, then start listening
MongoClient.connect(connectionString, (err, mongoDBService) => {
  if (err) return console.log(err);
  db = mongoDBService.db('firstdb');
  app.listen(3001, () => {
    console.log('listening on 3001');
  });
});

//-----HTTP Requests / Routes

app.use(express.static('public')); //for using font in public directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});


app.post('/dbQuery', (req, res) => {
	console.log(req.body.questionID);
	var query = { _id: new ObjectID(req.body.questionID)};
		console.log(query);
	db.collection(collectionName).find(query).toArray(function(err, record){
		if (err) return console.log(err);
		console.log('retreive from db: ', record);
		res.json(record);
	});
});

//for fill the comboBox in index.html (url /dbquery/all)
app.get('/dbQuery/all', (req, res) => {
	db.collection('test').find({},{answer:0}).toArray(function(err, records) {
		res.json(records);
	});
});

app.post('/dbAdd', (req, res) => {
	db.collection(collectionName).save(req.body, (err, result) => {
		if (err) return console.log(err);
		
		console.log("saved");
		res.redirect('/');
	});
});
