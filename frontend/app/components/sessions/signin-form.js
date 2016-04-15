import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),
  password: [-1, -1, -1, -1],
  hold: [false],
  showGuide: function(destination) {
    var div = document.getElementById(destination);
    var interval = 30;
    var distance = 3;
    var times = 5;

    $(div).css('position', 'relative');

    for (var iter = 0; iter < (times + 1) ; iter++) {
        $(div).animate({
            left: ((iter % 2 == 0 ? distance : distance * -1))
        }, interval);
    }                                                                                                          
    $(div).animate({ left: 0 }, interval);
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
      if (event.keyCode == 13) {
        event.preventDefault();
        $('#0').focus();
      }
    },

    typePinDown(data, event) {
      if (event.keyCode == 13 || event.keyCode == 9) {
        event.preventDefault();
      }
    },

    typeLogin(data, event) {
      if (event.keyCode == 8) {
        event.preventDefault();
        $('#3').focus();
        this.get('hold')[0] = true;
      }
    },

    typePin(data, event) {
      let field = event.target;
      let fieldId = parseInt(field.id);

      if ((event.keyCode == 8 && this.get('hold')[0] == false) || event.keyCode == 37) {
        this.get('password')[fieldId] = -1;
        $('#' + fieldId).removeClass('input-done');
        if (fieldId <= 0) {
          $('#username-field').focus();
        } else {
          $('#' + (fieldId-1)).focus();
        }
      } else if (event.keyCode >= 48 && event.keyCode <= 57) {
        this.get('password')[fieldId] = event.keyCode - 48;
        $('#' + fieldId).val('');
        $('#' + fieldId).addClass('input-done');
        if (fieldId >= 3) {
          $('#login-btn').focus();
        } else {
          $('#' + (fieldId+1)).focus();
        }
      } else {
        this.get('showGuide')(fieldId);
        // $('#' + fieldId).effect('shake');
      }

      this.get('hold')[0] = false;
    },

    onFocus(data, event) {
      $(this).val('');
      $(this).removeClass('input-done');
    }
  },

  _resetForm() {
    this.set('errorMessage', null);
  }
});