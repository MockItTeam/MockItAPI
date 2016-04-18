import DS from 'ember-data';

export default DS.Model.extend({
  owner_name: DS.attr('string'),
  image_url: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  owner: DS.belongsTo('user', {
    inverse: 'ownerRawImage'
  }),
});
