var express = require("express");
var app = express();
var serv = require("http").Server(app);
var mongoose = require('mongoose');
var rooms = require("./src/rooms");

serv.listen(process.env.PORT || 2000);
console.log("server started");

var Message = mongoose.model('Message',{
    name : String,
    message : String
})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

SOCKET_LIST = {};

var io = require("socket.io")(serv,{});
io.sockets.on("connection", function(socket) {
    console.log("connection detected");
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on("disconnect", function() {
        delete SOCKET_LIST[socket.id];
        console.log("connection deleted");
    });

    socket.on("surveyComplete", function(data) {
        console.log("survey data received");
        // store survey data and find match?
    });
})

