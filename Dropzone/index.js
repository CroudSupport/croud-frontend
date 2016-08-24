var Dropzone = require('../Src/Dropzone.vue');

module.exports = {
    install: function (Vue, options) {
        Vue.component('croud-dropzone', Dropzone);
    }
}
