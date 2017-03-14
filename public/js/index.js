var socket = io();
            
socket.on('connect', function() {
    console.log('Connected to server');
    
    socket.emit('createMessage', {
        from: 'strausd',
        text: 'Yo lets eat'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New message received', message);
});