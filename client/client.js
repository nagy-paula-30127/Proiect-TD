var socket = io.connect("ws://localhost:8000");

const name = prompt("Enter your name: ");

const form = document.getElementById('send');
const messageInp = document.getElementById('messageInput');
const messageChat = document.querySelector(".chat");

// we just need to connect
socket.on('connect', () => {});


// this is the event emitted by websocket server when connection
// it will take the messages and append it to DOM
socket.on('message-list', (messages) => {
    for (message of messages) {
        append(message.message);
    }
})

// form submit which emits the send event for websocket, with the object data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    append(`You`, 'right');
    socket.emit('send', { message: message, from: name });
    messageInput.value = '';
})

// this will listen to the new-message event and update the message list
socket.on('new-message', (data) => {
    append(data.message, 1);

})



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageChat.append(messageElement);

}