const socket = new WebSocket('ws://localhost:9000');
window.onload = function (){

  onloadModal();
  $('.CALLBACK').click(function(){
  alert("Начинаем");
  let call = {
    action: 'CallDB'
  };
  socket.send(JSON.stringify(call));})
  $('.create-new-book').click(function(){createBook()})



// Listen for messages
  socket.addEventListener('message', function (event) {
    let message = JSON.parse(event.data);
    switch (message.action) {
      case 'alert':
        alert(message.text);

        break;
      case 'BACK':
        create(message.value);
        break;

      case "new-book":
      console.log(message.value);
      createRow(message.value);
      break;
      default:

    }

});


}
async function load (){
  let file = await fetch('/Booklist/data/one.txt');
  if (file.ok){

      create(booksList);
  } else {
    alert("Не вышло")
    alert(file.status);
  }

}

function create (list){
  for (let i = 0; i < list.length; i++) {
    createRow(list[i]);}
}
function createRow (book){

  let i = CountBook();

  let div = $('<div>', {class: 'BookItem', id: 'book'+i, tabindex: i+1})
    .click({value: book},function(e){
      $('.active-item').removeClass('active-item');
      $(this).addClass("active-item");
      //$(this).css( {"background-color": "red"});
      let book = e.data.value;
      updatePanel(book);
    })

/*  let name = $('<div>', {class: 'BookName', text: book.bookName})
    .dblclick(function(){
      let textarea = $('<textarea>', {
            class: "BookName",
            text: $(this).text()})
        .keypress(function(e){
    //let note = e.data.value;
    //let newText = $(this).val();
            if (e.which == 13){
           //motherboard.editInNote(note, newText);
           //let div = replaceDivTitle (note);
               let div = $('<div>', {class:"BookName", text: $(this).val()});
               $(this).replaceWith(div);
             }
           });
       $(this).replaceWith(textarea);
     });*/
  let name = bookNameDiv(book.bookName);
  let author = $('<div>', {class: 'BookAuthor', text: getAuthorsName(book.author)});
  div.append(name).append(author);
  $('.ListBook').append(div);}

function bookNameTextArea(text){
  let textarea = $('<textarea>', {class: "BookName", text: text})
    .keypress(function(e){
      if (e.which == 13){
         let div = bookNameDiv($(this).val());
         $(this).replaceWith(div);
       }
    });
  return textarea;
}
function bookNameDiv (text){
  let div = $('<div>', {class: "BookName", text: text})
     .dblclick(function(){
       let textarea = bookNameTextArea($(this).text());
       let dom = textarea.get()[0];
       console.log(dom);
       $(document).on('click', function(event) {
         if (!(event.target == dom)) {
           let div = bookNameDiv(textarea.val());
           textarea.replaceWith(div);
         }
       });
       $(this).replaceWith(textarea);
       textarea.focus();
     });
  return div;
}

function updatePanel (book){
    $('.book-title-text').val(book.bookName);
    $('.author-book-text').val(getAuthorsName(book.author));

    $('.performance-author-text').val(getAuthorsName(book.author));
    $('.name-author-text').val(getFirstName(book.author));
}

function getFirstName(book){
  if (book == "Без автора" || book[0].first_name == undefined){
    return 'Не задано';
  }else {
    return book[0].first_name;
  }

}

function getLastName(author){
  if (author == "Без автора" || author[0].last_name == undefined){
    return 'Не задано';
  }else {
    return author[0].last_name;
  }
}

function getFullName(author){
  if (author.first_name == undefined){
		return author.last_name;
	}
	let name = author.first_name + ' ' + author.last_name;
	return name;
}
function getAuthorsName(item){
  if (!(item.check)){
    return "Без автора";
  }
  item = item.author;
  let name = getFullName(item[0]);
  for (let i = 1; i<item.length; i++){
    name = name + ', ' + getFullName(item[i]);
  }
  return name;
}


function createBook(){
  let name = $('.book-title-text').val();
  let author = $('.author-book-text').val();
  let book = {
    bookName: name,
    author: author,
  };
  createRow(book);
}

function modalNewBook(){
  let name = $('#book-name-text').val();
  let book = {
    bookName: name
  };
  console.log(book);
  console.log("Создаём новую книгу");

  messageServ ('new-book', book);
}

function CountBook(){
  let count = $('.BookItem').length;
  return count;
}

function messageServ (code, value){
  let message = {
    action: code,
    value: value
  };
  let json = JSON.stringify(message);
  socket.send(json);

}
