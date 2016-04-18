import Ember from 'ember';
import $ from 'jquery';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: [-1, -1, -1, -1, -1, -1, -1, -1],
  maxPinDigit: (8 - 1),
  hold: [false],

  showGuide(destination) {
    var div = document.getElementById(destination);
    var interval = 30;
    var distance = 3;
    var times = 5;

    $(div).css('position', 'relative');

    for (var iter = 0; iter < (times + 1); iter++) {
      $(div).animate({
        left: ((iter % 2 == 0 ? distance : distance * -1))
      }, interval);
    }
    $(div).animate({left: 0}, interval);
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

    typeUsername(data, event) {
      // enter and tab
      if (event.keyCode == 13 || event.keyCode == 9) {
        event.preventDefault();
        this.get('hold')[0] = true;
        $('#0').focus();
      }
    },

    typePinDown(data, event) {
      // enter and tab
      if (event.keyCode == 13 || event.keyCode == 9) {
        event.preventDefault();
      }
    },

    typeLogin(data, event) {
      if (event.keyCode == 8) {
        event.preventDefault();
        this.get('hold')[0] = true;
        $('#' + this.get('maxPinDigit')).focus();
      }
    },

    typePin(data, event) {
      let field = event.target;
      let fieldId = parseInt(field.id);

      if (this.get('hold')[0]) {
        this.get('hold')[0] = false;
        return;
      }

      // backspace and left-arrow
      if (event.keyCode == 8 || event.keyCode == 37) {
        this.get('password')[fieldId] = -1;
        $(`#${fieldId}`).removeClass('input-done');

        if (fieldId <= 0) {
          $('#username-field').focus();
        } else {
          $(`#${fieldId - 1}`).focus();
        }

        // number and numpad
      } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
        let base = 48;
        if (event.keyCode >= 96) {
          base = 96
        }
        this.get('password')[fieldId] = event.keyCode - base;
        $(`#${fieldId}`).val('').addClass('input-done');
        if (fieldId >= this.get('maxPinDigit')) {
          $('#submit-btn').focus();
        } else {
          $('#' + (fieldId + 1)).focus();
        }
      } else {
        this.get('showGuide')(fieldId);
      }

      this.get('hold')[0] = false;
    },
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});