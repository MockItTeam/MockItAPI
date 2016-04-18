import Ember from 'ember';
import AuthUtil from '../../utils/auth-util';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: [-1, -1, -1, -1],
  maxPinDigit: (4 - 1),
  hold: [false],

  showGuide(destination) {
    AuthUtil.showGuide(this, destination);
  },

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

    typeUsername(data, event) {
      AuthUtil.typeUsername(this, data, event);
    },

    typePinDown(data, event) {
      AuthUtil.typePinDown(this, data, event);
    },

    typeLogin(data, event) {
      AuthUtil.typeLogin(this, data, event);
    },

    typePin(data, event) {
      AuthUtil.typePin(this, data, event);
    },

    onFocus(data, event) {
      AuthUtil.onFocus(this, data, event);
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});