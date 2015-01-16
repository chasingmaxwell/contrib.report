Router.route('/org/:organization', {
  waitOn: function() {
    return Meteor.subscribe('github', this.params.organization);
  },
  action: function () {
    userData = UserData.find().fetch();

    if (userData.length === 0) {
      this.render('notFound');
      return;
    }

    this.render('github', {
      data: function () {
        return {
          userData: userData
        };
      }
    });
  }
});

Template.github.helpers({
  totalCount: function() {
    var totalCount = 0;
    this.userData.forEach(function(member, index, list) {
      totalCount += member.contributions.length;
    });
    return totalCount;
  },
  count: function() {
    return this.contributions.length;
  },
  orgName: function() {
    return Router.current().params.organization;
  }
});
