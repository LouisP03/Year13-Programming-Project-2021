//this brings in all the functions from express into the code
var express = require('express');

//this sets the port to that which is used by the Heroku server when deployed,
//providing port 3000 as a back up if running on localhost
var PORT = process.env.PORT || 3000;

var app = express();
//server now listens on given port
var server = app.listen(PORT);

//specifies the root directory from which to serve the static files
//i.e. the HTML files, stylesheet, etc.
app.use(express.static('public'), (req, res, next) => {
    //allows resources from all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Allow-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

var socket = require('socket.io');
var io = socket(server);

//array that contains all socket objects (each connection)
var connections = new Set();

//upon socket connection (for each socket)
io.sockets.on('connection', (socket) => {
    var id = socket.id;
    console.log('New client connection: ' + id);
    //add to array
    connections.add(socket);
    
    //upon disconnection of the socket...
    socket.on('disconnect', () => {
        //remove from array
        connections.delete(socket);
    });

    //upon subscription event with roomID
    socket.on('subscribe', (roomID) => {
        try {
            //subscribe socket to room
            socket.join(roomID);
        } catch(e) {
            //throw any errors
            console.log('[Error] ' + e);
        };
    });

    //upon chat message sent by client...
    socket.on('send-chat-message', (messageData) => {
        //...emit chat message to other clients in room
        socket.to(messageData.room).emit('send-chat-message', messageData);
        //socket.broadcast.emit('send-chat-message', messageData);
    });

    //upon mouse drag event sent by client...
    socket.on('mouse-dragged', (payload) => {
        //...emit mouse drag data to other clients in room
        socket.to(payload.room).emit('mouse-dragged', payload);
        //socket.broadcast.emit('mouse-dragged', payload);
    });

    /*//upon mouse drag event sent by client...
    socket.on('mouse-dragged', (dragData) => {
        //...emit mouse drag data to other clients in room
        socket.to(GIVENROOM).emit(dragData);
        //socket.broadcast.emit('mouse-dragged', dragData);
        console.log("mouse drag detected");
    });*/

    //upon mouse click event sent by client...
    socket.on('mouse-clicked', (clickData) => {
        //...emit mouse click event to other clients in room
        socket.to(clickData.room).emit('mouse-clicked', clickData);
        //socket.broadcast.emit('mouse-clicked', clickData);
    });

    //upon canvas reset event sent by client...
    socket.on('do-canvas-reset', (resetData) => {
        //emit canvas reset event to other clients in room
        socket.to(resetData.room).emit('do-canvas-reset', resetData);
        //socket.broadcast.emit('do-canvas-reset', resetData);
        console.log('A canvas reset has taken place with the following data:');
        console.log('do-canvas-reset', resetData);
    });

    //upon chat reset event sent by client...
    socket.on('do-chat-reset', (roomID) => {
        //emit chat reset event to other clients in room
        socket.to(roomID).emit('do-chat-reset');
        //socket.broadcast.emit('do-chat-reset');
        console.log('A chat reset has taken place.');
    });

});





