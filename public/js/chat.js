var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = document.getElementById('messages');
    var newMessage = messages.lastChild.previousElementSibling;
    
    // Heights
    var clientHeight = messages.clientHeight;
    var scrollTop = messages.scrollTop;
    var scrollHeight = messages.scrollHeight;
    var newMessageHeight = newMessage.scrollHeight;
    if (newMessage.previousElementSibling) {
        var lastMessageHeight = newMessage.previousElementSibling.scrollHeight;
    } else {
        var lastMessageHeight = 0;
    }

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop = scrollHeight;
    }
}

socket.on('connect', function() {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);
    
    // Doesn't work with just spaces from window.location.search
    // var params = JSON.parse('{"' + decodeURI(window.location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ol = document.createElement('OL');
    users.forEach((user) => {
        var li = document.createElement('LI');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    
    document.getElementById('users').innerHTML = '';
    document.getElementById('users').appendChild(ol);
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = document.getElementById('message-template').innerHTML;
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    
    document.querySelector('#messages').innerHTML += html;
    
    scrollToBottom();
    
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = document.createElement('LI');
    // li.innerHTML = `${message.from} ${formattedTime}: ${message.text}`;
    // document.querySelector('#messages').appendChild(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = document.getElementById('location-message-template').innerHTML;
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    
    document.querySelector('#messages').innerHTML += html;
    
    scrollToBottom();
    
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = document.createElement('LI');
    // var a = document.createElement('A');
    // a.setAttribute('target', '_blank');
    // a.setAttribute('href', message.url);
    // a.innerHTML = 'My current location';
    // li.innerHTML = `${message.from} ${formattedTime}: `;
    // li.appendChild(a);
    // document.querySelector('#messages').appendChild(li);
});

document.getElementById('message-btn').addEventListener('click', function (e) {
    e.preventDefault();
    
    var messageTextbox = document.getElementsByName('message')[0];
    
    socket.emit('createMessage', {
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