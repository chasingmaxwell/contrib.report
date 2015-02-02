/**
 * @file
 * Contains code pertaining to the /org/:organization route.
 */
/* globals Meteor, Router, Template, UserData, Repos, _ */

Router.route('/org/:organization', {
  waitOn: function() {
    var self = this;
    return Meteor.subscribe('github', this.params.organization, {
      onError: function(err) {
        if (err.error === 404) {
          self.render('notFound');
          return;
        }
        self.render('miscError');
      }
    });
  },
  action: function () {
    var userData = UserData.find().fetch();

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
  },
  languages: function() {
    var languages = {},
        totalBytes = 0;

    // Iterate over repos collecting language data.
    _.each(Repos.find().fetch(), function(repo, index) {
      _.each(repo.languages, function(bytes, language) {
        if (typeof languages[language] !== 'undefined') {
          languages[language].bytes += bytes;
        }
        else {
          languages[language] = {language: language, bytes: bytes};
        }
        totalBytes += bytes;
      });
    });

    // Calculate language percentages.
    _.each(languages, function(language) {
      languages[language.language].percentage = ((language.bytes * 100) / totalBytes).toFixed(2);
    });

    // Sort languages by bytes.
    languages = _.sortBy(languages, 'bytes');

    // Return a languages array with the highest number of bytes at the top.
    return _.values(languages).reverse();
  }
});
