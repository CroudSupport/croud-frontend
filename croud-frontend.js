var CroudiePicker = require('./Src/CroudiePicker.vue')

module.exports = {
    install: function (Vue, options) {
        Vue.component('croudie-picker', CroudiePicker);

        Vue.directive('chosen', {
            twoWay: true, // note the two-way binding
            bind: function () {

                var $el = $(this.el),
                searchLimit = $el.data('searchlimit'),
                    width = $el.data('width'),
                    params = {
                        inherit_select_classes: true,
                        width: width ? isNaN(width) ? width : parseInt(width) : 'inherit',
                        disable_search_threshold: searchLimit ? searchLimit : 10
                    };

                $el
                    .chosen(params)
                    .change(function (ev) {
                        this.set($el.value);
                        $el.trigger('select-changed');
                    }.bind(this));
            },
            update: function (nv, ov) {
                // note that we have to notify chosen about update
                $(this.el).trigger("chosen:updated");
            }
        });


        Vue.filter('toOrdinal', function (n) {
            var s = ["th", "st", "nd", "rd"], v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        });

        Vue.filter('dayLabel', function (day) {
            var eventLabels = {
                first: 'The first',
                second: 'The second',
                third: 'The third',
                fourth: 'The fourth',
                alternate: 'Every alternate',
                every: 'Every',
                last: 'The last',
                saturday: 'Saturday',
                sunday: 'Sunday',
                monday: 'Monday',
                tuesday: 'Tuesday',
                wednesday: 'Wednesday',
                thursday: 'Thursday',
                friday: 'Friday',
                workday: 'workday',
                day: 'Day',
                monthly: 'of the month',
                bimonthly: 'every other month',
                quarterly: ' per quarter',
            }

            return eventLabels[day] ? eventLabels[day] : day;
        });

        Vue.filter('greaterThanZero', function (value) {
            return !isNaN(value) && parseInt(value) > 0;
        });

        Vue.filter('toSlug', function (string) {
            return string.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().replace(/\s/g, '-');
        });

        Vue.filter('formatUkDateToString', function (value) {

            if (!value || value == '')
                return '';

            //var filter = /^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20)\d\d$/;

            return (moment(value, "DD/MM/YYYY").format("MMMM Do YYYY"));
        });


        Vue.filter('formatDateTimeToString', function (value) {

            if (!value || value == '')
                return '';

            //var filter = /^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20)\d\d$/;

            return (moment(value, "YYYY-MM-DD HH:mm:ss").format("Do MMMM YYYY"));
        });


        Vue.filter('addEss', function(label, value) {

            return parseInt(value) == 1 ? label : label + 's';

        });

        Vue.filter('pluralise', function (value, singlar, plural) {

            if (!value || value == '' || isNaN(value))
                return value;

            value = parseInt(value);

            return value == 1 ? value + ' ' + singlar : value + ' ' + plural;

        });


        Vue.filter('formatDateToHuman', function (value) {
            var filter = /^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20|[1-9]|[1-9])\d\d$/;

            return (moment(value).format("dddd, MMMM Do YYYY, H:mm"));
        });


        Vue.filter('formatDate', function (value) {
            var filter = /^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[1-9])[- /.](19|20|[1-9]|[1-9])\d\d$/;

            if (value.match(filter))
                return value;

            return (moment(value).format("DD/MM/YYYY"));
        });

        Vue.filter('formatTime', function (value) {
            var filter = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\d\d$/;

            if (value.match(filter))
                return value;

            return (moment(value).format("HH:mm"));
        });

        Vue.filter('minutesToHours', function(time, showSeconds) {
            if (isNaN(time)) return '00:00'; // need to check properly

            var hours = Math.floor( time / 60),minutes = time % 60;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            minutes = '' + minutes;

            if (!showSeconds && minutes.indexOf('.') >= 0)
            {
                minutes = minutes.substring(0, minutes.indexOf('.'));
            }

            return hours + ':' + minutes;
        });
    },
}
