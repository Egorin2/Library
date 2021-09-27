const mongoose = require('mongoose');
const config = require('../config/db');
const Author = require('./author');


const BookSchema = mongoose.Schema({
	bookName: {
		type: String
	},
	author: {
		check: Boolean, // false - без авторов
		id:[]}
});

BookSchema.methods.getAuthor = async function(){
	if (!this.author.check) {
		return this.author;
	}
	let array = this.author.id;
	//console.log(array);
	let authors = [];
	for (let i = 0; i < array.length; i++){
		let id = array[i];
		let item = (await Author.find({_id: id }))[0];
		//console.log(item);
		authors.push(item);
	}
	let obj = {
		check: true,
		author: authors
	}
	return obj;
};
BookSchema.methods.getBook = async function(){
	let bookPublick = {
		bookName: this.bookName,
		id: this._id,
		author: await this.getAuthor()
	};
	return bookPublick;
}

const Book = module.exports = mongoose.model('Book', BookSchema);
