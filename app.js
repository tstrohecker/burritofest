var express = require('express');
var twitter = require('twit');
var http = require('http');
var path = require('path');
var yaml = require('js-yaml');

var app = express();
var server = http.createServer(app);

var port = 3000;

app.set('port', process.env.PORT || port);
app.use(express.static(path.join(__dirname, 'public')));

var twitconfig = require('./twitter.yml');

var t = new twitter({
    consumer_key: twitconfig.consumer_key,
    consumer_secret: twitconfig.consumer_secret,
    access_token: twitconfig.access_token,
    access_token_secret: twitconfig.access_token_secret
});

app.get('/tweetcount', function(req, res) {
    //req.query.search;
    var search = '#testYo';
    //req.query.since;
    var since = '2013-10-01';

    t.get('search/tweets', { q: search + ' since:' + since, count: 100 }, function(err, reply) {
        var counter = {};
        var statuses = reply.statuses;

        for (var index in statuses) {
            var user = statuses[index].user;
            var status = statuses[index];
            var screen_name = user.screen_name;
            //console.log(user);
            //console.log(status);
            if (typeof counter[screen_name] === 'undefined') {
                counter[screen_name] = {
                    count: 1,//isNaN(counter[screen_name].count)?1:counter[screen_name].count+1,
                    name: user.name,
                    image: user.profile_image_url
                }
            }
            else {
                counter[screen_name].count += 1;
            }
        }
        console.log(counter);
        res.send(counter);
    });
});



//var io = require('socket.io').listen(app.listen(port));
//io.sockets.on('connection', function (socket) {
//    socket.on('newtweet', function (data) {
//        io.sockets.emit('newtweet', data);
//    });
//});


//
//t.stream('statuses/filter', {'track':'node.js'}, function(stream) {
//    stream.on('data', function (data) {
//        console.log(data.user.screen_name + ' ' + data.text);
//    });
//});

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});