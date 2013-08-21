module.exports = function(mongoose, config){
	//Connect to MongoDB
	mongoose.connect('mongodb://localhost/moodapp');
	var db = mongoose.connection,
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
	db.on('error', console.error.bind(console, 'connection error:'));
	mongoose.set('debug', true);

	this.UserSchema = new Schema({
		username: { type: String, index: { unique: true } }
	});

	this.PostSchema = new Schema({
		_creator: { type: Schema.ObjectId, ref: 'User' },
		mood: Number,
		comments: String,
		date: {
			type: Date,
			default: Date.now
		}
	});

	this.User = mongoose.model('User', UserSchema);
	this.Post = mongoose.model('Post', PostSchema);

	return this;
}