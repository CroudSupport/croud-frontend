
var Dropzone = require('./dropzone'),
    Messages = require('../Src/Messages.vue'),
    MessagesEditor = require('../Src/MessagesEditor.vue');

module.exports = {

    install: function (Vue, options) {

      Dropzone.install(Vue, options)

      Vue.component('croud-messages', Messages);
      Vue.component('croud-messages-editor', MessagesEditor);
    },
}
