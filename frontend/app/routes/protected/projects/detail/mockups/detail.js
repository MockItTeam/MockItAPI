import Ember from 'ember';

export default Ember.Route.extend({

  activate() {
    $('body').addClass('is-editor');
  },

  deactivate() {
    $('body').removeClass('is-editor');
    $('body').off('click');
    $('body').off('keydown');
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
        $('.droppable-el').css({
          'width': mockup.get('json_elements').width,
          'height': mockup.get('json_elements').height
        });
      });
    }
  }
});
