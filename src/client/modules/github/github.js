/**
 * @file
 * Contains code pertaining to the /org/:organization route.
 */
/* globals Meteor, Router, Template, UserData, OrgData, _ */

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
    var orgData = OrgData.find().fetch();

    if (userData.length === 0) {
      this.render('notFound');
      return;
    }

    this.render('github', {
      data: function () {
        return {
          userData: userData,
          orgData: orgData
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
  },
  activityIcon: function() {
    /**
		 * Change the activity icon class depending on what type of event it is.
		 */
    switch (this.type) {
      case 'CommitCommentEvent':
        return 'mdi-communication-forum';
      case 'CreateEvent':
        return 'mdi-content-add-box';
      case 'DeleteEvent':
        return 'mdi-navigation-close';
      case 'DeploymentEvent':
        return '';
      case 'DeploymentStatusEvent':
        return '';
      case 'DownloadEvent':
        return '';
      case 'FollowEvent':
        return 'mdi-action-visibility';
      case 'ForkEvent':
        return 'mdi-communication-call-split';
      case 'ForkApplyEvent':
        return '';
      case 'GistEvent':
        return 'mdi-action-assignment';
      case 'IssueCommentEvent':
        return 'mdi-communication-forum';
      case 'IssuesEvent':
        return 'mdi-content-inbox';
      case 'MemberEvent':
        return '';
      case 'MembershipEvent':
        return '';
      case 'PageBuildEvent':
        return '';
      case 'PublicEvent':
        return '';
      case 'PullRequestEvent':
        return 'mdi-content-forward flip';
      case 'PullRequestReviewCommentEvent':
        return 'mdi-communication-forum';
      case 'PushEvent':
        return 'mdi-content-forward';
      case 'ReleaseEvent':
        return '';
      case 'PageBuildEvent':
        return '';
      case 'RepositoryEvent':
        return '';
      case 'StatusEvent':
        return '';
      case 'TeamAddEvent':
        return 'mdi-action-group-work';
      case 'WatchEvent':
        return 'mdi-action-visibility';
      default:
        return 'mdi-action-language';
    }
  }
});