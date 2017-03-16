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
    
    socket.emit('createMessage', {
        from: 'User',
        text: document.getElementsByName('message')[0].value
    }, function() {
        
    });
    document.getElementsByName('message')[0].value = '';
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    } , function() {
        alert('Unable to fetch location.')
    });
});