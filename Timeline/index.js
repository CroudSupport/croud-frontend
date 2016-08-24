var Timeline = require('./Src/Timeline.vue');

module.exports = {
    install: function (Vue, options) {
      Vue.component('croud-timeline', Timeline);
    }
}
