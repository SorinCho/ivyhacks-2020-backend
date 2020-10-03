var express = require("express");
var app = express();
var serv = require("http").Server(app);
var rooms = require("./src/rooms");

serv.listen(process.env.PORT || 2000);
console.log("server started");

SOCKET_LIST = {};

var io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket) {
  console.log("connection detected");
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on("disconnect", function () {
    delete SOCKET_LIST[socket.id];
    console.log("connection deleted");
  });

  socket.on("surveyComplete", function (data) {
    console.log("survey data received");
    setTimeout(function () {
      console.log("sending url to client");
      socket.emit(
        "matched",
        "https://ivyhacks-sit.daily.co/WGnRLqx7LQ1HqE9XtSvp"
      );
    }, 2000);
  });
});
