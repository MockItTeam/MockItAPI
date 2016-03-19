import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string', {defaultValue: ''}),
  json_elements: DS.attr('string'),
  status: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  project: DS.belongsTo('project'),

  owner: DS.belongsTo('user', {
    inverse: 'ownerMockups'
  }),

  raw_image: DS.belongsTo('rawImage')
});
