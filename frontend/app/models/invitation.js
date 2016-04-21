import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  sender_name: DS.attr('string'),
  recipient_name: DS.attr('string'),
  project_name: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  project: DS.belongsTo('project'),

  sender: DS.belongsTo('user',{
    inverse: 'senders'
  }),

  recipient: DS.belongsTo('user', {
    inverse: 'recipients'
  })
});
