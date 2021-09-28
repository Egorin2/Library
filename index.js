const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/db');
const fs = require('fs');
const router = require('./route');
const Book = require('./model/book');
const Author = require('./model/author');
const server = require('./web-socet');
const MongoClient = require('mongodb').MongoClient;

const  url  =  'mongodb://localhost:27017';
const  client  =  new  MongoClient (url);
const dbName = 'testDB';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const booksCol = db.collection('books');
  const authorCol = db.collection('authors');
  // the following code examples can be pasted here...

  //const authors = await authorCol.find({}).toArray();
  const books = await booksCol.find({}).toArray();
  //console.log(authors);

  for (let i = 0; i < books.length; i++){
    console.log("Цикл " + i);
    let book = books[i];
    if (book.authorName == 'Без автора' || book.authorName == 'Совместное'){
      continue;
    }
    let id = book.author.id[0];
    let author = await authorCol.find({_id: id}).toArray();
    if (!(book.authorName == author[0].author)){
      console.log("Имеется расхождение");
    }
  }

  return 'done.';
}
/*main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());*/




const app = express();

const port = 3000;



app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);
app.use('/Booklist', express.static(path.join(__dirname, 'public', 'Booklist')));


mongoose.connect(config.db);

mongoose.connection.on('error', (err) => {
  console.log("Ошибка с базой: " + err);
});
mongoose.connection.on('connected', () => {
  console.log("Успешное подключение к БД");
});

/*
let booklistPath = path.join(__dirname, 'public', 'Booklist');

app.get('/', (req, res) => {
  res.sendFile(booklistPath + "/index.html");
});
*/
app.listen(port, () => {
 console.log('Запуск сервера успешен. Порт ' + port);
});
//uploadDB();
test();
async function test(){
  let author = {
    check: false
  }
  let test = {
    bookName: "Капитал. Критика политической экономии. 1 том",
    //author: author
  };
  let bool = await Book.findOne(test);
  if (bool){
    console.log("true");
  } else {
    console.log("false");
  }
  console.log(bool.id);

}

async function uploadDB(){
  console.log("Начинаем");
  let db = await Book.find();
  for (let i = 0; i < db.length; i++) {
    let book = db[i];
    let id = book.author.id;
    if (id.length == 0){
      book.author.check = false;
      book.save();
      console.log("успешно поменяли");
    }
  }
  console.log("Типа кончили");
}


//Тут выясняем отправляемые запросы в html
/*
let server = http.createServer(function(req, res) {
  console.log("Запрос: " + req.url);
	// Указание заголовков (тип данных и кодировка)
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	// Текст, который будет отображен на странице
	fs.createReadStream(__dirname + '/public/Booklist/index.html').pipe(res);
});
server.listen(3000, '127.0.0.1', () => {
   console.log('Запуск сервера успешен. Порт ' + port);
});*/
