var express = require("express");
var app = express();
var serv = require("http").Server(app);
var axios = require("axios");
var mongoose = require('mongoose');

serv.listen(process.env.PORT || 2000);
console.log("server started");

var Message = mongoose.model('Message',{
    name : String,
    message : String
  })

const uri = "mongodb+srv://new-user:Q8B7o3zYDlWdEFfV@cluster0.6mcs4.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

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

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected...')
  })
  .catch(err => console.log(err))
