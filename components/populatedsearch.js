module.exports = {
  install: function (Vue, options) {
      var PopulatedSearch = require('./Src/PopulatedSearch.vue'),
      Vue.component('populated-search', PopulatedSearch);
  },
}
