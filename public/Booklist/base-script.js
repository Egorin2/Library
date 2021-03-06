
window.onload = function (){

  onloadModal();
  $('.CALLBACK').click(function(){callDataBase()})
  $('.create-new-book').click(function(){createBook()})



}

function openCity(evt, name){
  var i, tabcontent, tablinks;
  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(name).style.display = "block";
  evt.currentTarget.className += " active";
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
  listBook = [];
  listAuthor = [];
  for (let i = 0; i < list.length; i++) {
    let book = new BookItem (list[i]);
    book.row = createRow(book);
  }
  takeTable();
}

function takeTable(){
  let table = $("<table>", { id: 'myTable'});
  let num = $("<th>").click(function(){w3.sortHTML('#myTable','.item', 'td:nth-child(1)')}).text("№");
  let name = $("<th>").click(function(){w3.sortHTML('#myTable','.item', 'td:nth-child(2)')}).text("Полное имя");
  let firstName = $("<th>").click(function(){w3.sortHTML('#myTable','.item', 'td:nth-child(3)')}).text("Имя");
  let lastName = $("<th>").click(function(){w3.sortHTML('#myTable','.item', 'td:nth-child(4)')}).text("Фамилия");
  let tr = $("<tr>").append(num).append(name).append(firstName).append(lastName);
  table.append(tr);
  for (let i = 0; i < listAuthor.length; i++){
    let author = listAuthor[i];

    let tr = $('<tr>').addClass("item");
    let nub = $("<td>").text(i+1);
    let name = $('<td>', {class: "td-name"}).text(author.name);
    let firstName = tdName("first_name", author);
    let lastName = tdName("last_name", author);
    tr.append(nub).append(name).append(firstName).append(lastName);
    table.append(tr);
  }
  $('#AuthorList').append(table);
}
function createRow (book){

  let i = CountBook();

  let div = $('<div>', {class: 'BookItem', id: 'book'+i, tabindex: i+1})
    .click(function(e){ //Нажатие делает строчку активной и связывает таблицу
      console.log(book)
      $('.active-item').removeClass('active-item');
      $(this).addClass("active-item");
      updatePanel(book);
    })


  let name = bookNameDiv(book);
  let authorEdit = $('<div>', {class: 'edit-author'}).css("display","none").append($("<span>", {text: book.Author}));
  let authorVisually = $('<div>', {class: 'author-text-in-ListBook', text: book.Author});
  let author = $('<div>', {class: 'BookAuthor'});
  author.append(authorVisually);
  author.append(authorEdit);
  author.dblclick(function(){
    authorVisually.css("display","none");
    authorEdit.show().addClass("active-Edit-place");
  })
  div.append(name).append(author);
  $('#ListBook').append(div);
  return div;
}

function bookNameTextArea(book){
  let textarea = $('<textarea>', {class: "BookName", text: book.bookName})
    .keypress(function(e){
      if (e.which == 13){
         book.editName(textarea.val());
         let div = bookNameDiv(book);
         $(this).replaceWith(div);
       }
    });
  return textarea;
}
function bookNameDiv (book){
  let div = $('<div>', {class: "BookName", text: book.bookName})
     .dblclick(function(e){
       let textarea = bookNameTextArea(book);
       let dom = textarea.get()[0];
       console.log(dom);
       $(document).click(function(event) {
         if (event.target != dom) {
           book.editName(textarea.val());
           let div = bookNameDiv(book);
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
    $('.author-book-text').val(book.Author);

    $('.performance-author-text').val(book.Author);
    //Добавить нужное количество
    $(".name-author-text").val(book.author[0].first_name);
    $('.last-name-author-text').val(book.author[0].last_name);
    $('#editAuthor').click({value:book.author[0]},function(){

    })
}

function tdInput (author){

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
  let author = $('#author-book-text').val();
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


function tdName(name, author){ //Выдать ячеку таблицы. Указать вызываемое поле и послылаемый объект
  let td = $('<td>');
  let div = $("<div>").text(author[name]);
  td.append(div);
  let input = $('<input>', {type:"text"}).css("display", "none")
   .keypress(function(e){
    if(e.which == 13){
      author.editElem(name, input.hide().val());
      div.show().text(author[name]);
      td.siblings(".td-name").text(author.name);
    }
  });
  td.append(input);
  td.dblclick(function(){
    div.hide();
    input.show().val(author.getValue(name)).focus();
  });
  return td;
}

function onSearch(){

  let search = $("<datalist>",{id:"search"});
}
