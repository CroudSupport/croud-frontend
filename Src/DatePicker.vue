

<template>
    <span>
        <div class="ui action input">
            <input v-el:pickerfield @click.prevent.enter="updateDate" value="{{display_date}}" type="text" placeholder="{{placeholder}}">
            <button @click.prevent v-el:pickerbutton class="ui icon button">
                <i class="calendar outline icon"></i>
            </button>
        </div>
    </span>
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
        min_date: {
            default: null
        },
        max_date: {
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
            display_date: null,
            picker: null
        }
    },
    watch: {
      date() {
         if (this.date.toJSON() !== this.picker.getMoment().toJSON()) {
            this.picker.setMoment(this.date)
        }
      },
      min_date() {
          if (!this.picker) return
        //   this.picker.setMinDate(this.min_date)
      },
      max_date() {
          if (!this.picker) return
        //   this.picker.setMaxDate(this.max_date)
      },
    },
    methods: {
        updateDate() {
            this.date = moment(croudDate(this.display_date))
        },
        create() {
            const inst = this
            if (this.picker) this.picker.destroy()
            let settings = {
                format: this.display,
                field: this.$els.pickerfield,
                trigger: this.$els.pickerbutton,
                onSelect: (date) => {
                    this.date = moment(date)
                    this.display_date = this.date.format(this.display)
                    if (this.settings.afterSelect && typeof this.settings.afterSelect == 'function')
                        this.settings.afterSelect(this.date)
                }
            }

            this.picker = new Pikaday(_.extend(settings, this.settings))

            if (this.date) this.picker.setMoment(this.date)
        }
    },
    ready() {
        this.display_date = this.date ? this.date.format(this.display) : moment().format(this.display)

        this.create()
    }
}

</script>
