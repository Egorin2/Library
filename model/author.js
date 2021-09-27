const mongoose = require('mongoose');
const config = require('../config/db');

const AuthorSchema = mongoose.Schema({
	author:  { type: String },
  first_name: { type: String },
  last_name: { type: String }
});

AuthorSchema.methods.getAuthor = function(){
	if (this.first_name == undefined){
		return this.last_name;
	}
	let name = this.first_name + ' ' + this.last_name;
	return name;
};


const Author = module.exports = mongoose.model('Author', AuthorSchema);
