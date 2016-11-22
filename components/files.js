var Files = require('../Src/Files.vue');

module.exports = {
    install: function (Vue, options) {
        Vue.component('croud-files', Files);
    }
}
