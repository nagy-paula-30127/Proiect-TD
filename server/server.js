const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});

const users = {};


const socket = require('socket.io')(httpServer);

// save each message in a list of objects
// this messages variable will look like [{message: 'test', from: 'username'}, {message: 'test2', from: 'username2'}]
let messages = [];



socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
});

socket.on('connection', socketInstance => {


    // after first connecting, emit the only for the connected socket so we don't get duplicate stuff
    socketInstance.emit('message-list', messages);

    // when sending a message from frontend we emit the new-message event so that the frontend is aware that something changed
    socketInstance.on('send', (data) => {
        // save the new message in the above array
        messages.push(data);

        // emit the new-message event so that frontend knows something is up
        socket.sockets.emit('new-message', data);
    })
});

socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
});



httpServer.listen(8000, () => {});