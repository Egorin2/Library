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
module.exports.editAuthorFirstName = async function(item){
	console.log("Зашли");
	let author = await Author.findOne({_id: item.id});
	console.log("Достали");
	author.first_name = item.edit;
	console.log("Изменили на " + item.edit);
	author.save();

}
module.exports.editAuthorLastName = async function(item){
	let author = await Author.findOne({_id: item.id});
	author.last_name = item.edit;
	author.save();
}
module.exports.editAuthorElem = async function(item){
	let author = await Author.findOne({_id:item.id});
	author[item.name] = item.edit;
	author.save();
}
