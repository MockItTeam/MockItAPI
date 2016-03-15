import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),

  actions: {
    authenticate() {
      this._resetForm();
      let { identification, password } = this.getProperties('identification', 'password');
      this
        .get('session')
        .authenticate('authenticator:oauth2', identification, password)
        .catch((response) => {
          if (response.error_description) {
            this.set('errorMessage', response.error_description);
          } else {
            this.set('errorMessage', response.error);
          }
        });
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});