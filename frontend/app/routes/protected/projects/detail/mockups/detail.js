import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return this.store.findRecord('mockup', params.mockup_id, {reload: true})
      .then((mockup) => {
        mockup.set('json_elements', JSON.parse(mockup.get('json_elements')));
        return mockup;
      });
  },

  actions: {
    didTransition() {
      let serialized_json = this.modelFor('protected.projects.detail.mockups.detail');

      Ember.run.schedule('afterRender', this, () => {
        $('.droppable-el').css({
          'width': serialized_json.json_elements.width,
          'height': serialized_json.json_elements.height
        });
      });
    },

    dropped: Ember.on('didTransition', function (event, ui, _self) {
      _self.$().droppable({
        accept: '.draggable-el',
        drop(event, ui) {
          var newClone = $(ui.helper)
            .clone()
            .removeClass('draggable-el')
            .addClass('new-draggable-el')
            .draggable({
              cursor: 'pointer',
              helper: 'original'
            }).css('position', 'absolute');
          $(this).append(newClone);
        }
      });
    }),

    dragged: Ember.on('didTransition', function (event, ui, _self) {

    })
  }
});
