

<template>

<div>
    <div class="ui action input">
        <input v-el:pickerfield v-model="display_date" type="text" placeholder="{{placeholder}}">
        <button v-el:pickerbutton class="ui icon button">
            <i class="calendar outline icon"></i>
        </button>
    </div>
</div>

</template>

<script>

import _ from 'underscore'
import Pikaday from 'pikaday'
import croudDate from 'croud-date-parser'
export default {
    props: {
        placeholder: {
            default: 'Date..'
        },
        date: {
            default: null
        },
        reference: {
            default: null
        },
        display: {
            default: 'D MMM YYYY'
        },
        settings: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data() {
        return {
            display_date: null
        }
    },
    watch: {
      display_date() {
        // let type = this.reference ? 'end' : 'start',
        //     date = croudDate(this.date, moment(), 'start');

        this.date = moment(croudDate(this.display_date));
      }
    },
    ready() {

        this.display_date = this.date ? this.date.format(this.display) : moment().format(this.display)

        // console.log(display_date)

        let settings = {
            format: this.display,
            // defaultDate: this.display_date,
            field: this.$els.pickerfield,
            trigger: this.$els.pickerbutton,
            onSelect: (date) => {
                this.date = moment(date)
            }
        }

        new Pikaday(_.extend({}, this.settings, settings));

    }
}

</script>
