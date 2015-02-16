/**
 * @file
 * Contains code pertaining to the home page route.
 */
/* globals Router, Template, $ */

Router.route('/', {
  action: function () {
    this.render('home');
  }
});

Template.home.rendered = function() {
  this.$('[name="organization-entry"]').submit(function(e) {
    e.preventDefault();
    var organization = $('#enter-organization').val();
    if (organization) {
      Router.go('/org/' + organization);
      return false;
    }
  });
};

Template.registerHelper('formatDate', function(date) {
  /**
	 * Formats a date to be displayed in a template.
	 * @todo: Perhaps we should register global helpers elsewhere?
	 */
  date = new Date(date);

  // Moment (or another library) might be a better solution.
  var format = "MM/DD/YYYY";
  // Calculate date parts and replace instances in format string accordingly
  format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
  format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
  format = format.replace("YYYY", date.getFullYear());
  return format;
});
