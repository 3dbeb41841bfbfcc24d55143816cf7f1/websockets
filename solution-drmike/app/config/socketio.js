module.exports = function(server) {

  // Setup SOCKET.IO Server
  var io = require('socket.io')(server);

  var Twit = require('twit');
  var twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var stream;
  var searchTerm;

  io.on('connect', function(socket) {

    console.log('Socket IO is listening');

    socket.on('stopStream', function() {
      console.log('stopping Stream');
      if (stream) {
        stream.stop();
      }
    });

    socket.on('startStream', function() {
      console.log('starting Stream');
      if (stream) {
        stream.start();
      }
    });

    socket.on('updateTerm', function (searchTerm) {
      console.log('updateTerm:', searchTerm);
      socket.emit('updatedTerm', searchTerm);

      // Start stream
      if (stream) {
        stream.stop();
      }

      console.log('Connecting to twitter streaming api');
      stream = twitter.stream('statuses/filter', { track: searchTerm, language: 'en' });

      stream.on('tweet', function (tweet) {
        var data = {};
        data.name = tweet.user.name;
        data.screen_name = tweet.user.screen_name;
        data.text = tweet.text;
        data.user_profile_image = tweet.user.profile_image_url;
        socket.emit('tweets', data);
      });
    });
  });
};
