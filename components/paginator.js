module.exports = {
  install: function (Vue, options) {
      var paginator = require('./Src/[p]aginator.vue'),
      Vue.component('paginator', paginator);
  },
}
