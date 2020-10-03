var express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());

var rooms = require("./src/rooms");

var server = app.listen(process.env.PORT || 2000);
console.log("server started");

SOCKET_LIST = {};

USER_RESPONSES = {};
UNMATCHED_USERS = {};

var io = require("socket.io").listen(server);
io.set("origins", "*:*");
io.sockets.on("connection", function(socket) {
    console.log("connection detected");
    socket.id = makeId(10);
    SOCKET_LIST[socket.id] = socket;

    socket.on("disconnect", function() {
        delete SOCKET_LIST[socket.id];
        delete USER_RESPONSES[socket.id];
        delete UNMATCHED_USERS[socket.id];
        for (let room in ROOMS) {
            if (ROOMS[room].includes(socket.id)) {
                ROOMS[room] = ROOMS[room].filter(id => id !== socket.id);
                break;
            }
        }
        console.log("connection deleted");
    });

    // socket.on("surveyComplete", function(data) {
    //     console.log("survey data received");
    //     // store survey data and find match?
    //     USER_RESPONSES[socket.id] = {};
    //     UNMATCHED_USERS[socket.id] = 1;
    //     startMatch(socket.id);
    // });
    USER_RESPONSES[socket.id] = {};
    UNMATCHED_USERS[socket.id] = 1;
    startMatch(socket.id);
})

function isAMatch(res1, res2) {
    return true;
}

function startMatch(socketId) {
    console.log("starting match");
    const userResponse = USER_RESPONSES[socketId];

    for (let id in UNMATCHED_USERS) {
        if (id !== socketId) {
            otherUserResponse = USER_RESPONSES[id];
            if (isAMatch(userResponse, otherUserResponse)) {
                const url = putInRoom(socketId, id);
                console.log(url);
                SOCKET_LIST[socketId].emit("matched", url);
                SOCKET_LIST[id].emit("matched", url);
                return;
            }
        }
    }

    // what now? maybe have background process try to continuously match.
}

// roomId to list of participants in room
ROOMS = {};

function putInRoom(socketId1, socketId2) {
    for (let roomId in ROOMS) {
        if (ROOMS[roomId].length === 0) {
            ROOMS[roomId] = [socketId1, socketId2];
            delete UNMATCHED_USERS[socketId1];
            delete UNMATCHED_USERS[socketId2];
            return rooms.DAILYCOURL + roomId;
        }
    }

    const newRoomId = makeId(10);

    if (rooms.createRoom(newRoomId)) {
        ROOMS[newRoomId] = [socketId1, socketId2];
        delete UNMATCHED_USERS[socketId1];
        delete UNMATCHED_USERS[socketId2];
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