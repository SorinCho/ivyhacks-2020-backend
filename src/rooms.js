var axios = require("axios");

const ROOMSAPIENDPOINT = "https://api.daily.co/v1/rooms";
const APIKEY = "2f695f37d4c8f77a36ebb787ca4a9c271ac186161164351565ad3163a2ae6e10";
const DAILYCOURL = "https://ivyhacks-sit.daily.co/";

onStartup();

async function onStartup() {
    const rooms = await getRooms();
    rooms.map(room => deleteRoom(room.name));
}

async function getRooms() {
    const res = await axios({
        method: "get",
        url: ROOMSAPIENDPOINT,
        headers: {
            Authorization: "Bearer " + APIKEY,
        }
    });
    
    if (res.status !== 200) return;
    return res.data.data;
    
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

    if (res.status === 200) {
        return DAILYCOURL + roomName;
    }
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

module.exports = {
    createRoom,
    deleteRoom,
}
