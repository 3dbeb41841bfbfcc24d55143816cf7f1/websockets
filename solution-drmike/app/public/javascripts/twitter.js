let socket = io();
let mode = 'stopped';

function toggleStream() {
  if (mode === 'started') {
    socket.emit('stopStream');
    mode = 'stopped';
    $('#toggle-button').text('Start Streaming');
  }
  else {
    socket.emit('startStream');
    mode = 'started';
    $('#toggle-button').text('Stop Streaming');
  }
}

function clearTweets() {
  $tweetContainer.empty();
}

$(function () {

  $('#toggle-button').hide();
  $tweetContainer = $('#tweet-container');

  // let $mySlider = $("#slider").slider();

  let $mySlider = $('#myslider').slider({
    formatter: function(value) {
      return 'Current value: ' + value;
    }
  });

  socket.on('connect', function() {
    console.log('Connected!');
  });

  socket.on('tweets', function(tweet) {
    let $tweetHtml = $(`
    <div class="row">
      <div class="col-md-6 col-md-offset-3 tweet">
        <img src="${tweet.user_profile_image}" class="avatar pull-left"/>
        <div class="names">
          <span class="full-name">${tweet.name}</span>
          <span class="username">@${tweet.screen_name}</span>
        </div>
        <div class="contents">
          <span class="text">${tweet.text}</span>
        </div>
      </div>
    </div>`);

    $tweetContainer.prepend($tweetHtml);
    setTimeout(function() {
      $tweetHtml.children('.tweet').first().addClass('fadeIn');
    }, 50);

    // limit to the last N tweets
    let sliderValue = $mySlider.slider('getValue');
    if ($tweetContainer.children().length > sliderValue) {
      $tweetContainer.children(':gt(' + (sliderValue-1) + ')').remove();
    }
  });

  $('form').on('submit', function() {
    event.preventDefault();
    let search_term = $('input').val();
    socket.emit('updateTerm', search_term);
    mode = 'started';
    $('#toggle-button').text('Stop Streaming').show();
  });

  socket.on('updatedTerm', function(searchTerm) {
    $('#search-term').text(searchTerm);
    clearTweets();
  });
});
