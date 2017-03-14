const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.emit('newMessage', {
        from: 'aftonation',
        text: 'ok',
        createdAt: 123123
    });
    
    socket.on('createMessage', (message) => {
        console.log('New message created', message);
    })
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server started...');
});