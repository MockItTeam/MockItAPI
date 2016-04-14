import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  json_elements: DS.attr('string'),
  status: DS.attr('string'),
  image: DS.attr('file'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  project: DS.belongsTo('project'),

  owner: DS.belongsTo('user', {
    inverse: 'ownerMockups'
  }),

  raw_image: DS.belongsTo('rawImage')
});
