var axios = require("axios");
var mongoose = require('mongoose');

const ROOMSAPIENDPOINT = "https://api.daily.co/v1/rooms";
const APIKEY = "2f695f37d4c8f77a36ebb787ca4a9c271ac186161164351565ad3163a2ae6e10";
const DAILYCOURL = "https://ivyhacks-sit.daily.co/";
const uri = "mongodb+srv://new-user:Q8B7o3zYDlWdEFfV@cluster0.6mcs4.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

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

async function deleteRoom(roomName) {
    const res = await axios({
        method: "delete",
        url: ROOMSAPIENDPOINT + "/" + roomName,
        headers: {
            Authorization: "Bearer " + APIKEY,
        },
    });
    console.log(res.data);
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected...')
  })
  .catch(err => console.log(err))


module.exports = {
    getRooms,
    createRoom,
    deleteRoom,
}