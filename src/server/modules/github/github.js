/**
 * @file
 * Publications for github.
 */
/* globals GitHub:true, github:true, Meteor, Random */

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
    organization: function(callback){
      github.orgs.get({
        org: organization
      }, parseResult(callback));
    }
  }, function(err, res){
    var org = res.organization;
    if (err || typeof organization === 'undefined') {
      self.ready();
      return;
    }
    // Add organization data.
    self.added('orgData', Random.id(), {
      org_name: org.login,
      avatar_url: org.avatar_url,
      description: org.description,
      blog: org.blog,
      public_repos: org.public_repos,
      created_at: org.created_at
    });
  });

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
          // Add repositories with languages.
          async.each(res.repos, function(repo, index) {
            github.repos.getLanguages({
              user: member.login,
              repo: repo.name
            }, function(err, res) {
              if (err) {
                self.error(new Meteor.Error(err.code, err));
                return;
              }

              var languages = res;

              if (typeof languages === 'object') {
                delete languages.meta;
              }

              repo.languages = languages;
              self.added('repos', Random.id(), repo);
            });
          });
        }

        // If all users have been loaded, the publication is ready.
        if (loaded === members.length) {
          self.ready();
        }
      });
    });
  });
});
