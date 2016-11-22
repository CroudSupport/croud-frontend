module.exports = {
  install: function (Vue, options) {
      var MultiSearch = require('../Src/MultiSearch.vue');
      Vue.component('multi-search', MultiSearch);
  },
}
