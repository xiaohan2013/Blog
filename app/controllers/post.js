var co = require('co');
var thunkify = require('thunkify-wrap');
var markdown = require('markdown').markdown;

var postModel = require('../models/post');
var tagModel = require('../models/tag');

module.exports = {

	home: function * () {
		var postList = yield postModel.fetch();

		postList = postList.map(function(post) {
			post.content = markdown.toHTML(post.content);
			return post;
		});

		var tagList = yield tagModel.fetch();

		yield this.render('index', {
			tagList: tagList,
			postList: postList
		});
	},

	list: function * () {
		yield this.render('list', []);
	},

	create: function * () {
		var data = this.body['post'];
		var post = yield postModel(data);
		var tag = yield tagModel.save([{
			name: "flatten",
			posts: [{
                id:post._id,
                name:post.name
			}]
		}]);
		console.log(tag);
	},

	show: function * () {
		var id = this.params['id'];
		var post = yield postModel.findById(id);

		post.content = markdown.toHTML(post.content);

		yield this.render('post', {
			tagList: [],
			post: post
		});
	}

};

