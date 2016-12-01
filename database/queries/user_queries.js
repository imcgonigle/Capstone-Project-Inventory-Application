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
		return Users().where('google_id', google_id.toString());
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
			bio: '',
			created_at: new Date(),
			updated_at: new Date()
		})
	},
	signUp: function(id, bio) {
		return Users().where('id', id).update({
			bio: bio
		});
	}
	
};
