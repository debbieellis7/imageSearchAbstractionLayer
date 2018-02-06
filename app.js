const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const qwant = require("qwant-api");



const app = express();

// Require Databse Schema
const searchTerm = require('./models/searchTerm');

// Database Config
const db = require('./config/database'); 

// Connect to mongoose
mongoose.connect(db.mongoURI, {

})
	.then(() => {
		console.log('MongoDB Connected..');
	})
	.catch(err => console.log(err));



// Get All search terms from the database
app.get('/api/recentsearches', (req, res, next) => {
	//searchTerm.find({}, (err, data) =>{
	//	res.json(data);
	//});
	var recentS = [];
	searchTerm.find({})
		.sort({searchDate:'desc'})
		.then((data) => {
			for(var x=0; x<data.length; x++){
				recentS.push({
					term: data[x].searchVal,
					when: data[x].searchDate
				})
			}
			res.json(recentS);
		});
});


// Body-Parser Middleware
app.use(bodyParser.json());	




app.get('/api/imagesearch/:searchValue*', (req, res, next) => {

	const searchValue = req.params.searchValue;
	const { offset } = req.query;

	const data = new searchTerm({
		searchVal: searchValue,
		searchDate: new Date()
	});

	// Save to searchTerm Collection - Database
	data.save(err => {
		if(err){
			res.send('Error saving to database');
		}
	});

	

	qwant.search("images", { 
		query: searchValue, 
		count: 10,
		offset: offset
	}, function(err, body){
    	if (err) return console.log(err);
    	
    	var newData = [];

    	for(var i=0; i<10; i++){
    		newData.push({
    			url: body.data.result.items[i].media,
    			title: body.data.result.items[i].title,
    			thumbnail: body.data.result.items[i].thumbnail,
    			context: body.data.result.items[i].url
    		});
    	}
    	res.json(newData);
	});


});








app.listen(process.env.PORT || 8080, () => {
	console.log('Server is running on port 8080');
});