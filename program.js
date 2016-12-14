var Twitter = require('twitter');
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

var client = new Twitter({
    consumer_key: 'ypsZI8pyzLXD5OgSJVwuzJbtp',
    consumer_secret: 'gA5jiIAbSP2BBpdWqzPGkiktXuQHILLOX0rdEkAIO1rxrxcFz0',
    access_token_key: '2370044539-sR5yZW5geQPtziaItqi313e83Bytp96LovAVJti',
    access_token_secret: 'I1GOo3guEWnz7V079veT1Tl6BUU3DCDFtRlmWV5F2vm3n'
});
io.on('connection', function(socket) {
    socket.on('hashtag', function(msg) {
        client.stream('statuses/filter', {track: '#'+msg}, function(stream) {
            stream.on('data', (tweet) => {
                io.emit('tweet', tweet.text);
            }).on('error', (error) => {
                console.log(error);
            });
        });
    });
});