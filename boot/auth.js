var passport = require("passport");
var Strategy = require("passport-twitter");

const JULIENS_ID = 5381582;

module.exports = function () {
  /*
  var trustProxy = false;
  if (process.env.DYNO) {
    // Apps on heroku are behind a trusted proxy
    trustProxy = true;
  }
  */

  // Configure the Twitter strategy for use by Passport.
  //
  // OAuth 1.0-based strategies require a `verify` function which receives the
  // credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
  // user's behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(
    new Strategy(
      {
        consumerKey: process.env["TWITTER_CONSUMER_KEY"],
        consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
        callbackURL: "/oauth/callback/twitter.com",
        //proxy: trustProxy
      },
      function (token, tokenSecret, profile, cb) {
        // In this example, the user's Twitter profile is supplied as the user
        // record.  In a production-quality application, the Twitter profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.

        var Twit = require("twit");

        var T = new Twit({
          consumer_key: process.env["TWITTER_CONSUMER_KEY"], //get this from developer.twitter.com where your app info is
          consumer_secret: process.env["TWITTER_CONSUMER_SECRET"], //get this from developer.twitter.com where your app info is
          access_token: token,
          access_token_secret: tokenSecret,
          timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
          strictSSL: true, // optional - requires SSL certificates to be valid.
        });

        T.get(
          "followers/ids",
          { screen_name: profile.screen_name },
          function (err, data, response) {
            var followsJulien = data.ids.includes(JULIENS_ID);
            return cb(null, {
              ...profile,
              follows_julien: followsJulien,
            });
          }
        );
      }
    )
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};