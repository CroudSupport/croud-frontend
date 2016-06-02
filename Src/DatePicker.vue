<template>
  <div>
    <div class="ui action input">
      <input v-el:pickerfield v-model="display" type="text" placeholder="{{placeholder}}">
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
        default: 'ddd YYYY'
      },
      settings: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        display: null
      }
    },
    watch: {
      display() {
        let type = this.reference ? 'end' : 'start',
            date = croudDate(this.date, moment(), 'start');

        this.date = croudDate(this.date, this.reference, type);
      }
    },
    ready() {

        let settings = {
          field: this.$els.pickerfield,
          trigger: this.$els.pickerbutton,
          onSelect: (date) => {
            this.model = date
            // console.log(date);
               // field.value = picker.toString();
           }
       }

          // new Pikaday(
          // {
          //     field: document.getElementById('datepicker'),
          //     trigger: document.getElementById('datepicker-button'),
          //     minDate: new Date(2000, 0, 1),
          //     maxDate: new Date(2020, 12, 31),
          //     yearRange: [2010,2020]
          // });

       new Pikaday(_.extend({}, this.settings, settings));

    }
  }
</script>
