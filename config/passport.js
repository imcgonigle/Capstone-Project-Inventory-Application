var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var userQueries = require('../database/queries/user_queries');


module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(user, done) {
		console.log('deserialize', user);
		userQueries.getUserByGoogleID(user.google_id)
		.then(function(data) {
			done(null, data[0]);
		})
		.catch(function(error) {
			done(error);
		});
  });


  passport.use(new GoogleStrategy({
      clientID        : process.env.GOOGLE_CLIENT_ID,
      clientSecret    : process.env.GOOGLE_CLIENT_SECRET,
      callbackURL     : process.env.GOOGLE_CALLBACK_URL,
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {

			userQueries.getUserByGoogleID(profile.id)
			.then(function(users) {
				let user = users[0];

				if(user && user.google_id == profile.id) {
					console.log("Found a user")
					done(null, user);
				} else {
					console.log('Didn\'t find a user time to make one');
					let newUser = {};
					newUser.googleID = profile.id;
					newUser.email = profile.emails[0].value;
					newUser.firstName = profile.name.givenName;
					newUser.lastName = profile.name.familyName;
					newUser.photoURL = profile.photos[0].value;

					userQueries.addUser(newUser)
					.then(function() {
						let user = {};
						user.google_id = profile.id;
						user.newUser = true;
						done(null, user);
					})
					.catch(function(err) {
						console.log('Error adding user');
						done(err);
					})
				}
			})
			.catch(function(err) {
				console.log('Error finding user');
				done(err);
			})
    });

  }));

};
