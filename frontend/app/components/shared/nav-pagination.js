import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['pagination'],

  perPage: Ember.computed(
    'pagination.total_pages',
    'pagination.total_count',
    'pagination.current_page',
    'model.length', function() {
      let currentPage = this.get('pagination.current_page');
      let totalPages = this.get('pagination.total_pages');
      let totalCount = this.get('pagination.total_count');
      let currentLength = this.get('model.length');

      if (currentPage < totalPages) {
        return currentLength;
      }

      if (totalPages <= 1) {
        return totalCount;
      }

      return Math.round((totalCount - currentLength) / (totalPages - 1));
    }),

  paginationRange: Ember.computed(
    'pagination.total_count',
    'pagination.current_page',
    'perPage', function() {
      let currentPage = this.get('pagination.current_page');
      let totalCount = this.get('pagination.total_count');
      let perPage = this.get('perPage');

      let offset = (currentPage - 1) * perPage;
      return `${offset + Math.min(1, perPage)} - ${Math.min(offset + perPage, totalCount)}`;
    }),

  actions: {
    pagination(page) {
      if(this.get('type')) {
        this.sendAction('paginationAction', page, this.get('type'));
      } else {
        this.sendAction('paginationAction', page);
      }
    }
  }
});