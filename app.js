

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

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

io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected...')
})
.catch(err => console.log(err))
var server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});