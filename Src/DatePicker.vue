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
          internal_date: null,
          internal_min_date: null,
          internal_max_date: null,
          display_date: null,
          picker: null
        }
    },
    watch: {
      date (value) {
        if (value && this.picker && this.internal_date && value.format() !== this.internal_date.format()) {
            this.picker.setMoment(value)
        }
      },
      min_date (value) {
        this.setMinDate(value)
      },
      max_date (value) {
        this.setMaxDate(value)
      },
    },
    methods: {
      init () {
        if (this.date) {
          this.internal_date = moment(this.date)
          this.display_date = this.internal_date.format(this.display)
        }
        this.create()
      },
      getDateFromMoment(value) {
        if (moment.isMoment(value)) {
          return value.toDate()
        }
        return value
      },
      updateDate () {
        this.internal_date = moment(croudDate(this.display_date))
      },
      setMinDate (value) {
        if (!this.picker) return
        this.picker.setMinDate(this.getDateFromMoment(value))
      },
      setMaxDate (value) {
        if (!this.picker) return
        this.picker.setMaxDate(this.getDateFromMoment(value))
      },
      create() {
        const inst = this
        if (this.picker) this.picker.destroy()

        let settings = {
          format: this.display,
          field: this.$els.pickerfield,
          trigger: this.$els.pickerbutton,
          onSelect: (date) => {
            this.internal_date = moment(date)
            this.$emit('date-selected', this.internal_date)
            if (this.settings.afterSelect && typeof this.settings.afterSelect === 'function')
              this.settings.afterSelect(this.internal_date)
          }
        }
        this.picker = new Pikaday(_.extend(settings, this.settings))
        if (this.internal_date) this.picker.setMoment(this.internal_date)
        if (this.min_date) this.setMinDate(this.min_date)
        if (this.max_date) this.setMaxDate(this.max_date)
      }
    },
    beforeDestroy () {
      if (this.picker) this.picker.destroy()
    },
    mounted () {
      this.init()
    },
    ready () {
      this.init()
    }
}
</script>
