const WebSocket = require('ws');
const wsServer = new WebSocket.Server({port: 9000});
const fs = require('fs');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const Book = require('./model/book');

wsServer.on('connection', onConnect);


function onConnect(wsClient) {
console.log('Новый пользователь');
wsClient.on('message', function(mess) {
  let message = JSON.parse(mess);
  console.log('Запрос');
  switch (message.action) {
    case "CALL": excelWork();

      break;
    case "CallDB":
      callDB(wsClient);

        break;
    case "new-book":

    console.log('Запрос на создание новой книги');
      newBook(wsClient, message.value);
      break;
    case "Edit-BookName": Book.editBookName(message.value); break;
    default:

  }
})
wsClient.on('close', function() {
    // отправка уведомления в консоль
    console.log('Пользователь отключился');
  });
}
async function newBook(wsClient, value){
  let newBook = value;
  let book = new Book (value);
  book.save();
  let bookPublick = await book.getBook();
  let send = {
    action: "new-book",
    value: bookPublick
  };
  console.log('Новая книга создана. Отправляем');
  let sendJSON = JSON.stringify(send);
  wsClient.send(sendJSON);
}
async function callDB(wsClient) {
  let bookBack = {
    action: 'BACK',
    value: await Book.getDB()
  };
  wsClient.send(JSON.stringify(bookBack));
}
/*async function editBookName(wsClient, value) {
  let book = (await Book.find({_id: value.id}))[0];
  console.log(book);
  book.bookName = value.edit;
  book.save();
}*/

async function excelWork () {
  console.log('Обрабатываем');
  let booksList = await readEXCEL();
  console.log('Распечатали');
  //await writeDB(booksList);
  let back = {
    action: 'BACK',
    value: booksList
  };
  //console.log(back);
  wsClient.send(JSON.stringify(back));

}

function writeDB (list){
  list.forEach((item, i) => {
    let book = new Book({bookName: item.name, authorName: item.author});
    console.log("Дошли? " + i);
    book.save();
  });

}

async function readEXCEL (){
  let workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./data/BookList.xlsx');
  //console.log('Не сдохли?');
  let worksheet = workbook.worksheets[0];
  let list = [];
  //console.log(workbook);
  for (let i = 2; i<189; i++){
    let name = worksheet.getCell('A'+i).value;
    let author = worksheet.getCell('B'+i).value;
    if (author == null){
      author = 'Без автора';
    }
    let book = {
      bookName: name,
      authorName: author
    }
    list.push(book);
  }
  return list;

}

module.exports = wsServer;
