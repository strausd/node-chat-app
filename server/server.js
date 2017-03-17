const path = require("path");
const http = require("http");
const queryString = require("query-string");
const socketIO = require("socket.io");
const express = require("express");
var app = express();

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected.');
    
    
    socket.on('join', (params, callback) => {
        var params = queryString.parse(params);
        params.room = params.room.toLowerCase();
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        } else if (users.getAllUserNames().indexOf(params.name.toLowerCase()) !== -1) {
            return callback('Display name already in use in at least one chatroom.');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        
        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });
    
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
    
    socket.on('disconnect', () => {
        var user = users.getUser(socket.id);
        if (user) {
            users.removeUser(user.id)
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log(`User disconnected.`);
    });
});

server.listen(process.env.PORT, () => {
    console.log('Server started...');
});