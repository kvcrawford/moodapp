//Includes
var express		= require('express'),
	app 		= express(),
	io			= require('socket.io'),
	mongoose	= require('mongoose'),
	jade		= require('jade'),
	config		= require('./app/config')(app, express, mongoose),
	models		= require('./app/models')(mongoose, config),
	query,
	promise;

//Quick and Dirty
app.set('views', __dirname + '/app/views');
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', function(req,res){
	query = models.User.find({});
	promise = query.exec();
	promise.addBack(function(err, users){
		if(err) res.send(err);
		res.render('index', {title: 'MoodApp', users: users}, function(err,html){
			if(err) console.log(err);
			console.log(users);
			res.send(html);
		});
	});
});

//User Routes
app.get('/users/:user', function(req,res){
	models.User.findOne(
		{ username: req.params.user},
		function(err, user){
			if(err) res.json(err);
			models.Post
				.find({ _creator: user._id })
				.exec(function(err, posts){
					if(err) console.log(err);
					console.log(user._id);
					res.render('user',
						{ title: 'Posts for ' + user.username, user: user, posts: posts },
						function(err,html){
							if(err) console.log(err);
							res.send(html);
						}
					);
				});
		}
	);
});

app.post('/users/new', function(req,res){
	var user = new models.User({
		username: req.body.username
	});
	user.save(function(err){
		if(err) console.log(err);
		res.redirect('/');
	})
});

app.post('/users/:user/post/new', function(req,res){
	query = models.User.findOne({ username: req.params.user });
	promise = query.exec();
	promise.addBack(function(err, user){
		if(err) console.log(err);
		console.log(user);
		var post = new models.Post({
			mood: req.body.mood,
			comments: req.body.comments,
			date: new Date(),
			_creator: user._id
		});

		post.save(
			function(err){
				if(err) res.json(err);
				models.Post
					.findOne({ _id: post._id })
					.populate({ path: '_creator', select: '_id' })
					.exec(function(err, post){
						console.log(post);
						res.redirect('/users/'+req.params.user);
					});
			}
		);
	});
});

app.get('/users/:user/post/new', function(req, res){
	models.User.findOne({ username: req.params.user }, function(err, user){
		if(err) console.log(err);
		console.log(models.Post.count);

		models.Post.count({ _creator: user._id }, function(err, count){
			var rand = Math.floor(Math.random() * (count));

			models.Post.findOne({ _creator: user._id }).skip(rand).exec(function(err, post){
					res.render('users/new',
						{
							title: "Success!",
							user: user,
							post: post
						},
						function(err, html){
							if(err) console.log(err);
							res.send(html);
						}
					);
				});
		});
	});
});

//Presto.
app.listen(3000);
console.log('Listening on port 3000');
