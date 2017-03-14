const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
var app = express();

const {generateMessage} = require("./utils/message");

var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (message) => {
        console.log('New message created', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    })
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server started...');
});