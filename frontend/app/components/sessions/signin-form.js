import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: new Array(4),

  actions: {
    authenticate() {
      this._resetForm();
      let identification = this.get('identification');
      let password = this.get('password').join('');

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
    },

    moveOnMax(data, event) {
      let field = event.target;
      let fieldId = parseInt(field.id);

      if (field.value.length == 1 && fieldId < 4) {
        this.get('password')[fieldId] = data;
        fieldId += 1;
        $('#' + fieldId).focus();
      }
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});