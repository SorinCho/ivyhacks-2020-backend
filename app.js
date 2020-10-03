var express = require("express");
var app = express();
var serv = require("http").Server(app);
var axios = require("axios");

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
        console.log("connection deleted");
    });

    socket.on("surveyComplete", function(data) {
        console.log("survey data received");
        // store survey data and find match?
    });
})

ROOMSAPIENDPOINT = "https://api.daily.co/v1/rooms";
APIKEY = "2f695f37d4c8f77a36ebb787ca4a9c271ac186161164351565ad3163a2ae6e10";
DAILYCOURL = "https://ivyhacks-sit.daily.co/";

async function getRooms() {
    const res = await axios({
        method: "get",
        url: ROOMSAPIENDPOINT,
        headers: {
            Authorization: "Bearer " + APIKEY,
        }
    });
    console.log(res.data);
}

async function createRoom(roomName) {
    const res = await axios({
        method: "post",
        url: ROOMSAPIENDPOINT,
        headers: {
            Authorization: "Bearer " + APIKEY,
        },
        data: {
            name: roomName
        }
    });
    console.log(res.data);
}

setInterval(function() {

}, 1000)