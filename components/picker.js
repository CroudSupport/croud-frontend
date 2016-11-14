module.exports = {
  install: function (Vue, options) {
    var CroudiePicker = require('../Src/CroudiePicker.vue');
    Vue.component('croudie-picker', CroudiePicker);
  },
}
