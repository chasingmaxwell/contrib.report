/**
 * @file
 * Publications for github.
 */
/* globals Meteor */

// Initiate the GitHub object globally.
GitHub = Meteor.npmRequire('github');
github = new GitHub({
  version: "3.0.0",
  timeout: 5000,
  headers: {
    'user-agent': 'contrib.report'
  }
});

var async = Meteor.npmRequire('async');

Meteor.publish('github', function(organization) {
  var self = this,
      parseResult = function(callback) {
        return function(err, res) {
          if (err) {
            self.error(new Meteor.Error(err.code, err));
          }
          callback(err, res);
        };
      };

  async.series({
    members: function(callback) {
      // Retrieve members of organization.
      github.orgs.getMembers({
        org: organization
      }, parseResult(callback));
    }
  }, function(err, res) {
    var members = res.members,
        loaded = 0;

    if (err || typeof members === 'undefined') {
      self.ready();
      return;
    }

    async.each(members, function(member, index) {
      // Do not parse non-members.
      if (typeof member.login === 'undefined') {
        return;
      }

      async.parallel({
        repos: function(callback) {
          github.repos.getFromUser({
            user: member.login
          }, parseResult(callback));
        },
        events: function(callback) {
          github.events.getFromUserPublic({
            user: member.login,
            per_page: 100
          }, parseResult(callback));
        }
      }, function(err, res) {
        if (err) {
          self.error(new Meteor.Error(err.code, err));
          return;
        }

        // Increment number of loaded users.
        loaded++;

        if (res.events.length > 0) {
          // Add user data.
          self.added('userData', Random.id(), {member: member, contributions: res.events});

          // Add contributions.
          async.each(res.events, function(contribution, index) {
            self.added('contributions', Random.id(), contribution);
          });
        }

        if (res.repos.length > 0) {
          // Add repositories.
          async.each(res.repos, function(repo, index) {
            self.added('repos', Random.id(), repo);
          });
        }

        // If all users have been loaded, the publication is ready.
        if (loaded == members.length) {
          self.ready();
        }
      });
    });
  });
});

