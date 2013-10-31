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
    var search = req.query.search;
    //var search = '#charcade';
    var since = req.query.since;
    //var since = '2013-10-01';

    var d = new Date();
    d.setDate(d.getDate() - 30);
    console.log(d);

    t.get('search/tweets', { q: search + ' since:' + since, count: 100 }, function(err, reply) {
        var counter = [];
        var statuses = reply.statuses;
        //console.log(statuses);

        for (var index in statuses) {
            var user = statuses[index].user;
            var status = statuses[index];
            var screen_name = user.screen_name;
            //console.log(user);
            //console.log(status);

            arrayIndex = getIndex(counter, 'screen_name', screen_name);
            if (arrayIndex === -1) {
                counter.push({
                    screen_name: screen_name,
                    count: 1,
                    name: user.name,
                    image: user.profile_image_url
                })
            }
            else {
                counter[arrayIndex].count = counter[arrayIndex].count + 1;
            }
        }
        //console.log(counter);
        res.send(counter);
    });
});


function getIndex(array, key, value) {
    for (var index = 0, length = array.length; index < length; index++) {
        if (array[index][key] === value) return index;
    }
    return -1;
}

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