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
  var self = this;

  async.series({
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

    async.each(members, function(member, index) {
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

