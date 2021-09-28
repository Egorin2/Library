let listBook = [];
let listAuthor = [];

function findId(id){
  for(let i = 0; i < listAuthor.length; i++){
    if(listAuthor[i].id == id){
      return i;
    }
  }
  return -1;
}



class BookItem {
  constructor(book){
    this.id = book.id;
    this.bookName = book.bookName;
    this.isAuthor = book.author.check;
    this.author = [];
    if (this.isAuthor){
      for (let i = 0; i < book.author.author.length; i++){
        let authorRAW = book.author.author[i];
        let index = findId(authorRAW.id);
        let author;
        if (index == -1){
          author = new Author(authorRAW);
          listAuthor.push(author);
        } else {
          author = listAuthor[index];
        }
        this.author.push(author);
      }
    }
    this.list = listBook;
    this.list.push(this);
  }
  get Author(){ //Получить имена авторов строкой
    if(!(this.isAuthor)){
      return "Без автора";
    }
    let name = this.author[0].name;
    for (let i = 1; i < this.author.length; i++){
      name = name + ", " + this.author[i].name;
    }
    return name;
  }

  editName(text){   //Изменить имя книги
    if (this.bookName == text){
      return false;
    }
    this.bookName = text;
    //Далее отправляем изменение на сервер, чтобы зафиксировать
    let value = {
      id: this.id,
      edit: this.bookName
    };
    messageServ("Edit-BookName", value);
  }
  pushAuthor (author){ //Добавить автора
    if (this.isAuthor){
      this.author.push(author);
    } else {
      this.isAuthor = true;
      this.author.push(author);
    }
  }
  deleteAuthor (author){  //Удалить автора
    let id = this.author.indexOf(author);
    if (id == -1){
      return false;
    }
    this.author.splice(id, 1);
    if (this.author.length = 0){
      this.isAuthor = false;
    }
    return true;
  }

  save(){

  }
}
class Author {
  constructor(author){
    if (author.nickname != undefined){
      this.nickname = author.nickname;
    }
    if (author.first_name != undefined) {
      this.first_name = author.first_name;
    }
    if (author.last_name != undefined) {
      this.last_name = author.last_name;
    }
    this.id = author.id;
    this.list = listAuthor;
  }
  get first_name(){
    if (this._first_name == undefined){
      return "Не задано";
    } else {
      return this._first_name;
    }
  }
  set first_name(value){
    this._first_name = value;
  }

  get name() {
    if (this.first_name == "Не задано" && this.last_name == undefined){
      return this.nickname;
    }
    if (this.first_name == "Не задано"){
      return this.last_name;
    }
    return this.first_name + " " + this.last_name;
  }
}
