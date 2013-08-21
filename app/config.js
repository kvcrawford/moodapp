module.exports = function(app, express, mongoose){

  var config = this;

  app.requireAuth = false;

  //generic config
  app.configure(function(){
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret' }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  return config;

};