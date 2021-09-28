const mongoose = require('mongoose');
const config = require('../config/db');
const Author = require('./author');


const BookSchema = mongoose.Schema({
	bookName: {
		type: String
	},
	author: {
		check: { type:Boolean, default: false}, // false - без авторов
		id:[]}
});

BookSchema.methods.getAuthor = async function(){
	if (this.author.check == undefined) {
		if (this.author.id.length > 0) {
			this.author.check = true;
			this.save();
		} else {
		this.author.check = false;
		this.save();
		}
	}
	if (!this.author.check) {
		return this.author;
	}
	let array = this.author.id;
	//console.log(array);
	let authors = [];
	for (let i = 0; i < array.length; i++){
		let id = array[i];
		let item = await Author.getAuthorForID(id);
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
		id: this.id,
		author: await this.getAuthor()
	};
	return bookPublick;
}

const Book = module.exports = mongoose.model('Book', BookSchema);
module.exports.getDB = async function(){
	let list = await Book.find();
  let listDRAW = [];
  for (let i = 0; i < list.length; i++){
    let book = await list[i].getBook();
    listDRAW.push(book);
  }
	return listDRAW;
}
module.exports.editBookName = async function(value){
	let book = await Book.findOne({_id: value.id});
  console.log(book);
  book.bookName = value.edit;
  book.save();
}
