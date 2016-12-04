var knex = require('../knex.js');

var Users = function() {
	return knex('users');
};

module.exports = {
	getAllUsers: Users,
	getUserByID: function(user_id) {
		return Users().where('id', user_id);
	},
	getUserByGoogleID: function(google_id) {
		return Users().where('google_id', google_id);
	},
	getUserByEmail: function(email) {
		return Users().where('email', email.toLowerCase());
	},
	getUserByName: function(username) {
		return Users().where('username', username);
	},
	addUser: function(newUser) {
		return Users().insert({
			google_id: newUser.googleID,
			email: newUser.email.toLowerCase(),
			first_name: newUser.firstName,
			last_name: newUser.lastName,
			photo_url: newUser.photoURL,
			about: '',
			number_of_collections: 0,
			number_of_items: 0,
			created_at: new Date(),
			updated_at: new Date()
		})
	},
	signUp: function(id, about) {
		return Users().where('id', id).update({
			about: about
		});
	},
	updateUser: function(userInfo) {
		return Users().where('google_id', userInfo.google_id).update({
			about: userInfo.about,
			email: userInfo.email,
			first_name: userInfo.firstName,
			last_name: userInfo.lastName,
			photo_url: userInfo.photoURL,
			updated_at: new Date()
		}).returning('google_id');
	}

};
