var Twitter = require('twitter');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session');
var fs = require('fs');

server.listen(3000, () => {
    console.log('Listening on port 3000');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var client = new Twitter({
        consumer_key: 'ypsZI8pyzLXD5OgSJVwuzJbtp',
        consumer_secret: 'gA5jiIAbSP2BBpdWqzPGkiktXuQHILLOX0rdEkAIO1rxrxcFz0',
        access_token_key: '2370044539-sR5yZW5geQPtziaItqi313e83Bytp96LovAVJti',
        access_token_secret: 'I1GOo3guEWnz7V079veT1Tl6BUU3DCDFtRlmWV5F2vm3n'
    });
var data;
io.on('connection', function(socket) {
    socket.on('hashtag', function(msg) {
        if(msg.indexOf('#') == 0) {
            var message = msg;
        } else {
            var message = '#' + msg;
        }
        client.stream('statuses/filter', {track: message}, function(stream) {
            data = stream;
            stream.on('data', (tweet) => {
                var tweetInfo = {
                    'user': tweet.user.name,
                    'screen_name': tweet.user.screen_name,
                    'image': tweet.user.profile_image_url,
                    'content': tweet.text
                }
                socket.emit('tweet', tweetInfo);
            }).on('error', (error) => {
                console.log(error);
            });
        });
    }).on('disconnect', () => {
        if(data !== undefined) {
            data.destroy((err) => {
                console.log(err);
            });
        }
        console.log('Disconnected');
    });
});
