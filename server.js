/**
 * Created by tdailey on 9/3/16.
 */
// load the things we need
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var connect = require('connect');
var expressLayouts = require('express-ejs-layouts');
var express = require('express');
var Twitter = require('twitter');
var app = express();

var client = new Twitter({
    consumer_key: 'XfRsLRywJ2d8W9qx0GZKoiVjL',
    consumer_secret: '8f2MIFrCu2SUkRSDlDY3ILo9eZOyQLbkcqNIy4ZMHR07GKCGEN',
    access_token_key: '1102143036-JcLCnfaynKPxtZwmiUQZe2TSE5XuvYd3XDfqOO6',
    access_token_secret:'u8653K9Rs0v4yaTQ1XRFDnHSeX7g128OMUgWBGf7IfMgN'
});
// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(expressLayouts);
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('layout',{tweets: tweetlist});
});

var tweetlist = [];

app.post('/', function(req, res, next){
    var hashtag = req.body.hashtag;
    client.get('search/tweets', {q: "'"+hashtag+"'" }, function(error, tweets, response) {
        tweetlist = [];
        for(var i= 0; i< 15; i++){
            tweetlist.push({
                id: tweets.statuses[i].id_str,
                name: tweets.statuses[i].user.name,
                screen_name: tweets.statuses[i].user.screen_name,
                profile_img: tweets.statuses[i].user.profile_image_url,
                text: tweets.statuses[i].text
            });
        }
        res.render('layout',{tweets: tweetlist});
        res.end();
    });
});

app.listen(process.env.PORT || 8888);


module.exports = app;
