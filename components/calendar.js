module.exports = {
    install: function (Vue, options) {
        var Calendar = require('../Src/Calendar.vue');
        Vue.component('croud-calendar', Calendar);
    },
}
