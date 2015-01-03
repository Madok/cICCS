var express = require('express.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

dbAdapter = require("./dbAdapter/dbAdapter");
var QueryBUilder = require("./dbAdapter/QueryBuilder");
var auth = require("./dbAdapter/auth");
cryptoServer = require('./cryptoAES/cryptoServer');

dbAdapter.connection();

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.session({secret: 'erfghjiouytfcvbnjki78654e'}));
app.use(express.static(path.join(__dirname, 'public')));

app.all("*",function(req,res,next){
    if(/^\/(javascripts|stylesheets|fonts|images)\/.+/.test(req.path)){
        next();
        return;
    }
    dbAdapter.connection();

    res.on('finish',function(){
        dbAdapter.close();
    });
    res.locals.auth = false;
    auth.authSession(req, function (b, u,s) {
        if (!b) {
            if( "/user/login"===req.path) {
                next();
                return;
            }else res.redirect('user/login');
        } else {
            res.cookie('user.iv',s, { maxAge: 3600000, httpOnly: false });
            req.session.cookie.expires = new Date(Date.now() + 3600000);
            req.session.cookie.maxAge = 3600000;
//            req.session.cookie.httpOnly=false;
//            req.session.cookie.secure= false;
            res.locals.auth = true;
            res.locals.user = u;
            res.locals.secret = {iv:s};
            if("/user/login"===req.path) {
                res.redirect('/');
            }else {
                next();
            }
        }
    });

});

app.use('/', routes);
app.use('/user', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;

dbAdapter.connection();
var q=new QueryBUilder('session');
q.delete().where.where('1');
dbAdapter.query(q,function(){
    dbAdapter.close();
});
