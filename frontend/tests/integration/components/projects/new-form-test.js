import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projects/new-form', 'Integration | Component | projects/new form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{projects/new-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#projects/new-form}}
      template block text
    {{/projects/new-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
