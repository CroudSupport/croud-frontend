/*
 * Vue resrouce default headers. Needs vue-resource.
 */

module.exports = {

    install: function (Vue, options) {

        Croud = Croud || {};
        Croud.systemSettings = Croud.systemSettings || {};

        Vue.http = Vue.http != undefined ? Vue.http : {};
        Vue.http.headers = Vue.http.headers != undefined ? Vue.http.headers  : {};
        Vue.http.headers.common = Vue.http.headers.common != undefined? Vue.http.headers.common : {};

        Vue.http.headers.common['Time-Offset'] = (new Date()).getTimezoneOffset();
        Vue.http.headers.common['UTC-Offset'] = (new moment()).utcOffset();
        Vue.http.headers.common['Current-User'] = Croud.systemSettings && Croud.systemSettings.user ? Croud.systemSettings.user.code : '';


        if (gateway_url) {
          Vue.http.options.root = `//${gateway_url}`
        }

        var rootUserCode = localStorage.getItem('jwt');

        if (rootUserCode) {
            Vue.http.headers.common.Authorization = 'Bearer ' + jwt;
        }

        Croud.systemSettings.timeOffset = Vue.http.headers.common['Time-Offset'];
        Croud.systemSettings.utcOffset = Vue.http.headers.common['Time-Offset'];
    },
}
