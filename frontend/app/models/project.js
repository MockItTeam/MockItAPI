import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string', {defaultValue: ''}),
  image: DS.attr('file'),
  image_url: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  owner: DS.belongsTo('user', {
    inverse: 'project'
  }),

  members: DS.hasMany('user', {
    inverse: 'projects'
  }),

  invitations: DS.hasMany('invitation', {async: true}),
  mockups: DS.hasMany('mockup', {async: true})
});
