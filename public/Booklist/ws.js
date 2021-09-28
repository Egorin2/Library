//Скрипты для связи с сервером

const socket = new WebSocket('ws://localhost:9000');


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


function callDataBase(){
  let call = {
    action: 'CallDB'
  };
  socket.send(JSON.stringify(call));
}

function messageServ (code, value){
  let message = {
    action: code,
    value: value
  };
  let json = JSON.stringify(message);
  socket.send(json);
}
