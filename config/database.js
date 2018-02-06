if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://debbie:debbie123@ds125618.mlab.com:25618/imagesearchabstractlayer'
	}
} else{
	module.exports = {
		mongoURI: 'mongodb://localhost/searchTerms'
	}
}