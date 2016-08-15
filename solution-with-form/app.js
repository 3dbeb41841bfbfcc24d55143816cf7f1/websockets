var morgan  = require('morgan');
var express = require('express');
var app     = express();
var port    = process.env.PORT || 3000;
var router  = express.Router();
var server  = require('http').createServer(app);
var Twit = require('twit');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(function(req, res, next) {
  
  // console.log('%s request to %s from %s', req.method, req.path, req.ip);
  next();
});

// app.get('/', function(req, res) {
//     res.render('index');
// });

router.get('/', function(req, res) {
  res.render('index', { header: 'Twitter Search'});
});

app.use('/', router);
server.listen(port);

console.log('Server started on ' + port);

var io = require('socket.io')(server);

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// var stream = twitter.stream('statuses/filter', { track: search_tweet });

io.on('connect', function(socket) {
  console.log("Query: ", socket.handshake.query.search);
  var search_tweet = socket.handshake.query.search;

  var stream = twitter.stream('statuses/filter', { track: search_tweet });
  
  stream.on('tweet', function (tweet) {
  	var data = {};
  	  data.name = tweet.user.name;
  	  data.screen_name = tweet.user.screen_name;
  	  data.text = tweet.text;
  	  data.user_profile_image = tweet.user.profile_image_url;
  	  socket.emit('tweets', data);
	});
});

// console.log(stream);