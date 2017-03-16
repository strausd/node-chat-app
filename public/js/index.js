var socket = io();
            
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New message received', message);
    var li = document.createElement('LI');
    li.innerHTML = `${message.from}: ${message.text}`;
    document.querySelector('#messages').appendChild(li);
});

document.getElementById('message-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: 'User',
        text: document.getElementsByName('message')[0].value
    }, function() {
        
    });
    document.getElementsByName('message')[0].value = '';
});
