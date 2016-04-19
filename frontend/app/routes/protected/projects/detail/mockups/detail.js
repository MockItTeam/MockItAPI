import Ember from 'ember';

export default Ember.Route.extend({

  activate() {
    $('body').addClass('is-editor');

    // For mobile
    $('meta[name=viewport]').attr('content', 'width=1170');
  },

  deactivate() {
    // Remove Listener
    let $body = $('body');
    $body.removeClass('is-editor');
    $body.off('click');
    $body.off('keydown');
    $body.off('keyup');

    // For mobile
    $('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1');
    let mockup = this.modelFor('protected.projects.detail.mockups.detail');
    mockup.set('json_elements', JSON.stringify(mockup.get('json_elements')));
  },

  model(params) {
    return this.store.findRecord('mockup', params.mockup_id, {reload: true})
      .then((mockup) => {
        let json_elements = mockup.get('json_elements')? JSON.parse(mockup.get('json_elements')) : {};
        mockup.set('json_elements', json_elements);
        return mockup;
      });
  },

  actions: {

    didTransition() {
      let mockup = this.modelFor('protected.projects.detail.mockups.detail');

      Ember.run.schedule('afterRender', this, () => {
        $('.droppable-el .html-div').css({
          'width': mockup.get('json_elements').width,
          'height': mockup.get('json_elements').height
        });
      });
    }
  }
});
