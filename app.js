var express = require("express");
var app = express();
var serv = require("http").Server(app);
var rooms = require("./src/rooms");

serv.listen(process.env.PORT || 2000);
console.log("server started");

SOCKET_LIST = {};

var io = require("socket.io")(serv,{});
io.sockets.on("connection", function(socket) {
    console.log("connection detected");
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on("disconnect", function() {
        delete SOCKET_LIST[socket.id];
        ROOMS[USERSROOM[socket.id]] = ROOMS[USERSROOM[socket.id]].filter(item => item !== socket.id);
        delete USERSROOM[socket.id];
        console.log("connection deleted");
    });

    socket.on("surveyComplete", function(data) {
        console.log("survey data received");
        // store survey data and find match?
    });
})

// roomId to list of participants in room
ROOMS = {};

// users socketId to roomId
USERSROOM = {};

function putInRoom(socketId1, socketId2) {
    for (let roomId in ROOMS) {
        if (ROOMS[roomId].length === 0) {
            ROOMS[roomId] = [socketId1, socketId2];
            USERSROOM[socketId1] = roomId;
            USERSROOM[socketId2] = roomId;
            return rooms.DAILYCOURL + roomId;
        }
    }

    const newRoomId = makeId(10);

    if (rooms.createRoom(newRoomId)) {
        ROOMS[newRoomId] = [socketId1, socketId2];
        USERSROOM[socketId1] = newRoomId;
        USERSROOM[socketId2] = newRoomId;
        return rooms.DAILYCOURL + newRoomId;
    }
}

function makeId(length) {
    var result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
 }