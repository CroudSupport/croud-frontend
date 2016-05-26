<style scoped>

</style>

<template>
    <div v-el:calendar id="calendar"></div>
</template>

<script>

    import _ from 'underscore'

    require('fullcalendar')

    export default {
        props: {
            events: {
                default() {
                    return []
                },
            },
            settings: {
                type: Object,
                default() {
                    return {}
                }
            }
        },

        ready() {
            const cal = $(this.$els.calendar),
                self = this,
                settings = _.extend({}, {
                    header: {
                        left:   'prev,next today',
                        center: 'title',
                        right:  'month,agendaWeek,agendaDay'
                    },
                    defaultView: 'agendaWeek',
                    editable: true,
                    selectable: true,
                    selectHelper: true,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    events: self.events,
                    eventRender(event, element) {
                        self.events = cal.fullCalendar('clientEvents')
                    },

                    eventDestroy(event) {
                        self.events = cal.fullCalendar('clientEvents')
                    },

                    eventClick(event, element) {
                        self.$dispatch('select-calendar', event, element)
                    },

                    select(start, end, jsEvent) {
                        cal.fullCalendar('renderEvent', {
                            title: 'Available',
                            start,
                            end,
                        }, true)
                    }
                }, this.settings)

            $(this.$els.calendar).fullCalendar(settings)

        }
    }
</script>
