const mongoose = require('mongoose');
const config = require('../config/db');

const AuthorSchema = mongoose.Schema({
	author:  { type: String }, //Запас на случай отсутствия получаемого ФИО или если оно хз что
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
module.exports.getAuthorForID = async function(id){
	let authorRAW = await Author.findOne({_id: id});
	let authorPublick = {
		id: authorRAW.id,
		first_name: authorRAW.first_name,
		last_name: authorRAW.last_name,
		nickname: authorRAW.author
	};
	return authorPublick;
}
