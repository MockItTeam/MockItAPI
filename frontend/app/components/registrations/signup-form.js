import Ember from 'ember';
import $ from 'jquery';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: new Array(4),
  passwordConfirmation: new Array(4),

  actions: {
    createAccount() {
      this._resetForm();

      let identification = this.get('identification');
      let password = this.get('password').join('');
      let passwordConfirmation = this.get('passwordConfirmation').join('');

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

            Ember.run.later((() => {
              this.sendAction('afterSignup');
            }), 3000);
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

    typePin(data, event) {
      let field = event.target;
      let fieldId = parseInt(field.id);

      if (field.value.length == 1 && event.keyCode != 8) {
        this.get('password')[fieldId] = data;
        fieldId += 1;
      } else {
        this.get('password')[fieldId] = '';
        fieldId -= 1;
      }

      $('#' + fieldId).focus();
    },

    typePinConfirmation(data, event) {
      let field = event.target;
      let fieldId = parseInt(field.id);

      if (field.value.length == 1 && event.keyCode != 8) {
        this.get('passwordConfirmation')[fieldId] = data;
        fieldId += 1;
      } else {
        this.get('passwordConfirmation')[fieldId] = '';
        fieldId -= 1;
      }

      $('#0' + fieldId).focus();
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});