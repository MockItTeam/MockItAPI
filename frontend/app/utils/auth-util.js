class AuthUtil {

  static showGuide(that, destination) {
    var div = document.getElementById(destination);
    $(div).tooltip('show');
    $(div).on('shown.bs.tooltip', function() {
      setTimeout(function() {
        $(div).tooltip('hide');
      }, 1000);
    });
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
  }

  static typeUsername(that, data, event) {
    // enter and tab
    if (event.keyCode == 13 || event.keyCode == 9) {
      event.preventDefault();
      that.get('hold')[0] = true;
      $('#0').focus();
    }
  }

  static typePinDown(that, data, event) {
    // enter and tab
    if (event.keyCode == 13 || event.keyCode == 9) {
      event.preventDefault();
    }
  }

  static typeLogin(that, data, event) {
    if (event.keyCode == 8) {
      event.preventDefault();
      that.get('hold')[0] = true;
      $('#' + that.get('maxPinDigit')).focus();
    }
  }

  static typePin(that, data, event) {
    let field = event.target;
    let fieldId = parseInt(field.id);

    if (that.get('hold')[0]) {
      that.get('hold')[0] = false;
      return;
    }

    // backspace and left-arrow
    if (event.keyCode == 8 || event.keyCode == 37) {
      that.get('password')[fieldId] = -1;
      $(`#${fieldId}`).removeClass('input-done');

      if (fieldId <= 0) {
        $('#username-field').focus();
      } else {
        $(`#${fieldId - 1}`).focus();
      }

    } else if (event.keyCode >= 48 && event.keyCode <= 57) { // Normal nnumber on keyboard
      that.get('password')[fieldId] = event.keyCode - 48;
      AuthUtil.focusNext(that, fieldId);
    } else if (event.keyCode >= 96 && event.keyCode <= 105) { // Numpad on keyboard
      that.get('password')[fieldId] = event.keyCode - 96;
      AuthUtil.focusNext(that, fieldId);
    } else if (event.keyCode == 229) { // Android virtual keyboard (Some company e.g. Samsung)
      let inputValue = Number($(`#${fieldId}`).val());
      if (inputValue >= 0 && inputValue <= 9) {
        that.get('password')[fieldId] = inputValue;
        AuthUtil.focusNext(that, fieldId);
      } else {
        that.get('showGuide')(fieldId);
      }
    }
    else {
      that.get('showGuide')(fieldId);
    }

    that.get('hold')[0] = false;
  }

  static onFocus(that, data, event) {
    $(that).val('').removeClass('input-done');
  }

  static focusNext(that, fieldId) {
    $(`#${fieldId}`).val('').addClass('input-done');
    if (fieldId >= that.get('maxPinDigit')) {
        $('#submit-btn').focus();
      } else {
        $('#' + (fieldId + 1)).focus();
      }
  }

}

export default AuthUtil;
