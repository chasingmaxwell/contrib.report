var GitHub = Meteor.npmRequire('github'),
    Async = Meteor.npmRequire('async'),
    github = new GitHub({
      version: "3.0.0",
      timeout: 5000,
      headers: {
        'user-agent': 'github-org-reports'
      }
    });

Meteor.publish('github', function(organization) {
  var self = this;

  // Authenticate with GitHub API.
  github.authenticate({
    type: 'oauth',
    key: 'ee60fd2624858d867b74',
    secret: '4fe11dd808324bd8c59538fbc45bc7a4ade77f55'
  });

  Async.series({
    members: function(callback) {
      // Retrieve members of organization.
      github.orgs.getMembers({
        org: organization
      }, function(err, res) {
        callback(err, res);
      });
    }
  }, function(err, res) {
    var members = res.members,
        loaded = 0;

    if (typeof members === 'undefined') {
      console.log('No members found for organization.');
      self.ready();
      return;
    }

    Async.each(members, function(member, index) {
      // Do not parse non-members.
      if (typeof member.login === 'undefined') {
        return;
      }

      // Retrieve data on the individual member.
      github.events.getFromUserPublic({
        user: member.login,
        per_page: 100
      }, function(err, res) {

        if (err) {
          console.log(err);
          return;
        }

        // Increment number of loaded users.
        loaded++;

        if (res.length > 0) {
          // Add user data.
          self.added('userData', Random.id(), {member: member, contributions: res});
        }

        // If all users have been loaded, the publication is ready.
        if (loaded == members.length) {
          self.ready();
        }
      });
    });
  });
});

