const mongoose = require('mongoose');
const config = require('../config/db');
const Author = require('./author');


const BookSchema = mongoose.Schema({
	bookName: {
		type: String
	},
	author: {id:[]}
});

BookSchema.methods.getAuthor = async function(){
	let array = this.author.id;
	if (array.length==0){
		return 'Без автора';
	}
	//console.log(array);
	let authors = [];
	for (let i = 0; i < array.length; i++){
		let id = array[i];
		let item = (await Author.find({_id: id }))[0];
		//console.log(item);
		authors.push(item);
	}
	return authors;
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
