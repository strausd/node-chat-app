const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
var app = express();

const {generateMessage, generateLocationMessage} = require("./utils/message");

var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (message, callback) => {
        console.log('New message created', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.');
    });
    
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server started...');
});