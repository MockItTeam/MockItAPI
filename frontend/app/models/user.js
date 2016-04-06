import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  project: DS.hasMany('project', {
    inverse: 'owner'
  }),

  senders: DS.hasMany('invitation', {
    inverse: 'sender'
  }),

  recipients: DS.hasMany('invitation', {
    inverse: 'recipient'
  }),

  projects: DS.hasMany('project', {
    inverse: 'members'
  }),

  firstLetter: Ember.computed('username', function() {
    return this.get('username')[0];
  })
});
