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

socket.on('newLocationMessage', function(message) {
    var li = document.createElement('LI');
    var a = document.createElement('A');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', message.url);
    a.innerHTML = 'My current location';
    li.innerHTML = `${message.from}: `;
    li.appendChild(a);
    document.querySelector('#messages').appendChild(li);
});

document.getElementById('message-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    var messageTextbox = document.getElementsByName('message')[0];
    
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.value
    }, function() {
        messageTextbox.value = '';
    });
    
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    
    locationButton.setAttribute('disabled', 'disabled');
    locationButton.value = 'Sending location...';
    
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttribute('disabled');
        locationButton.value = 'Send location';
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    } , function() {
        locationButton.removeAttribute('disabled');
        locationButton.value = 'Send location';
        alert('Unable to fetch location.');
    });
});