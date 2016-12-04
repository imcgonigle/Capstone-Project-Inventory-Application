"user strict"

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const userQueries = require('../database/queries/user_queries');


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {

        userQueries.getUserByGoogleID(user.google_id)
            .then(function(data) {
                done(null, data[0]);
            })
            .catch(function(error) {
                done(error);
            });
    });


    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        function(token, refreshToken, profile, done) {
            console.log("got user: ", profile)
            process.nextTick(function() {
                console.log('in tick');
                userQueries.getUserByGoogleID(profile.id)
                    .then(function(users) {
                        let user = users[0];

                        if (user && user.google_id == profile.id) {
                            console.log('found user ');
                            done(null, user);
                        } else {
                            console.log('adding new user')
                            let newUser = {
                                googleID: profile.id,
                                email: profile.emails[0].value,
                                firstName: profile.name.givenName,
                                lastName: profile.name.familyName,
                                photoURL: profile.photos[0].value,
                            };


                            userQueries.addUser(newUser)
                                .then(function() {
                                    console.log('Added user');
                                    let user = {
                                        google_id: profile.id,
                                        newUser: true
                                    };

                                    done(null, user);
                                })
                                .catch(function(err) {
                                    console.log('Failed to add user');
                                    done(err, null);
                                })
                        }
                    })
                    .catch(function(err) {
                        console.log("querying for user failed");
                        done(err, null);
                    })
            });

        }));

};