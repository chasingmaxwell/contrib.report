Router.route('/', {
  action: function () {
    this.render('home');
  }
});

Template.home.rendered = function() {
  this.$('[name="enter-organization"]').submit(function(e) {
    e.preventDefault();
    var organization = $('#enter-organization').val();
    if (organization) {
      Router.go('/org/' + organization);
      return false;
    }
  });
};
