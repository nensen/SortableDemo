var express = require('./node_modules/express');

// Create a express application
var app = express();

// Serve static files from public directory e.g. scripts, pages, css...
app.use(express.static('public'));

/* 
Pass express application to HTTP server module, and then pass http server to the socket.io
Http server is needed because if you try to pass express directly to socket.io you will recieve  
Error: You are trying to attach socket.io to an express request handler function. Please pass a http.Server instance
*/
var http = require('http').Server(app);
var io = require('./node_modules/socket.io')(http);

// Render index.html as startup page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// This is event will be triggered once any of the users will load the page
io.on('connection', function (socket) {

  // When event to change order is triggered from sender
  socket.on('changed_order', function (itemIds) {

    // Then emit event to every user that is connected with payload of sender (that is itemIds)
    io.emit('changed_order', itemIds);
  });
});

// Bind server to listen on default socket.io port
http.listen(3000, function () {
  console.log('listening on *:3000');
});