import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: [-1, -1, -1, -1],
  maxPinDigit: (4 - 1),
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

    onFocus(data, event) {
      $(this).val('').removeClass('input-done');
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});