module.exports = {
  install: function (Vue, options) {
      var paginator = require('../Src/paginator.vue');
      Vue.component('paginator', paginator);
  },
}
