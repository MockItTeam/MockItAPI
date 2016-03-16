import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  sender_id: DS.attr('number'),
  recipient_id: DS.attr('number'),
  project_id: DS.attr('number'),
  project: DS.belongsTo('project')
});
