import Ember from 'ember';
import AuthUtil from '../../utils/auth-util';

export default Ember.Component.extend({
  password: [-1, -1, -1, -1, -1, -1, -1, -1],
  maxPinDigit: (8 - 1),
  hold: [false],

  showGuide(destination) {
    AuthUtil.showGuide(this, destination);
  },

  didInsertElement(){
    $('.pin-form-control').tooltip({
      'trigger':'manual',
      'title': 'Must be digits only'
    });
  },

  actions: {
    createAccount() {
      this._resetForm();

      let identification = this.get('identification');
      let p = this.get('password');
      let password = [p[0], p[1], p[2], p[3]].join('');
      let passwordConfirmation = [p[4], p[5], p[6], p[7]].join('');

      Ember.$
        .ajax({
          method: 'POST',
          url: '/api/v1/users',
          dataType: 'json',
          data: {
            user: {
              username: identification,
              password: password,
              password_confirmation: passwordConfirmation,
            }
          }
        })
        .then(
          (response) => {
            this.set('successMessage', response.message);
            this.set('errorMessage', undefined);
            this.sendAction('afterSignup', identification, password);
          },
          (xhr, textStatus) => {
            this.set('successMessage', undefined);
            try {
              this.set('errorMessage', xhr.responseJSON.errors[0]);
            } catch (e) {
              this.set('errorMessage', textStatus);
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
