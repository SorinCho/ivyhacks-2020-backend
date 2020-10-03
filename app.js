var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mongoose = require('mongoose');

const uri = "mongodb+srv://new-user:Q8B7o3zYDlWdEFfV@cluster0.6mcs4.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var Message = mongoose.model('Message',{ name : String, message : String})

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// view engine setup
// app.set('view engine', 'html');
app.use(express.static(__dirname));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



 
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

// app.post('/messages', (req, res) => {
//   var message = new Message(req.body);
//   message.save((err) =>{
//     if(err)
//       sendStatus(500);
//     res.sendStatus(200);
//   })
// })

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


app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected...')
})
.catch(err => console.log(err))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
