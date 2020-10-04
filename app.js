const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const rooms = require("./src/rooms");

const server = require("http").createServer(app);

SOCKET_LIST = {};

USER_RESPONSES = {};
UNMATCHED_USERS = {};

const io = require("socket.io")(server);
io.on("connection", function (socket) {
  console.log("connection detected");
  socket.id = makeId(10);
  SOCKET_LIST[socket.id] = socket;

  socket.on("leaveCall", function () {
    disconnectFromCall();
    console.log("left");
  })

  socket.on("disconnect", function () {
    delete SOCKET_LIST[socket.id];
    disconnectFromCall();
    console.log("connection deleted");
  });

  function disconnectFromCall() {
    delete USER_RESPONSES[socket.id];
    delete UNMATCHED_USERS[socket.id];
    for (let room in ROOMS) {
      if (ROOMS[room].includes(socket.id)) {
        ROOMS[room] = ROOMS[room].filter((id) => id !== socket.id);
        if (ROOMS[room].length === 0) {
            delete ROOMS[room];
            rooms.deleteRoom(room);
        } else {
            ROOMS[room].forEach(id => {
                SOCKET_LIST[id].emit("userLeft", { name: id });
            });
        }
      }
    }
  }

  socket.on("surveyComplete", function (data) {
    console.log("survey data received");
    USER_RESPONSES[socket.id] = {};
    UNMATCHED_USERS[socket.id] = 1;
    startMatch(socket.id);
  });
});

server.listen(process.env.PORT || 2000);
console.log("server started");

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
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
