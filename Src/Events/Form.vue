<style>
.formContainerGroups {
  margin-bottom:20px;
}

input, textarea, select, .textbox, select.textbox{
  background: #fff !important;
  background-color: #fff !important;
}
</style>
<template>
  <div>
    <div class="formContainerGroups">
      <h2 class="yellow">Request Form</h2>
      <!-- <pre>
        {{event | json}}
      </pre> -->
      <div class="ui segment basic secondary">
        <div class="formRow">
          <label>Preset</label>
          <div class="blockMarginLeft">
            <semantic-form-dropdown :options="presets" :model.sync="selected_preset_id" title_field="title"></semantic-form-dropdown>
          </div>
        </div>
        <div  v-for="field in selectedFields">
          <pre>
            {{field | json}}
          </pre>
          <component :is="field.field" :preset_id="selected_preset_id" :field="field" :index="$index"></component>
        </div>
      </div>
      <div class="ui segment basic center aligned">
        <button class="ui button yellow" @click="saveEvent">Submit This Request</button>
      </div>
    </div>
  </div>
</template>
<script>

import _ from 'underscore'
import checkbox from './Fields/Checkbox.vue'
import files from './Fields/Files.vue'
import hidden from './Fields/Hidden.vue'
import selectbox from './Fields/Selectbox.vue'
import textbox from './Fields/Textbox.vue'
import textarea from './Fields/Textarea.vue'
import separator from './Fields/Separator.vue'


export default {
  components: {
    checkbox, files, hidden, selectbox, textbox, textarea, separator,
  },
  props: {
    presets: {
      type: Array,
      default: () => []
    },
    event: {
      type: Object,
      default(){
        return {
          id: null,
          preset_id: null,
          fields: {}
        }
      },
      fields: []
    },
  },
  data() {
    return {
      selected_preset_id: '',
      selected_preset: {},
      fields : [],
    }
  },
  methods: {
    notify() {
      Croud.notifications.addMessage('Your request has been sent.')
    },
    saveEvent() {
        const data = {
          fields: this.selectedFields,
          event: this.event,
          preset_id: this.selected_preset_id
        }

        this.$http.post('/partners/content-manager/save', data).then((response)=>{
          this.$dispatch('reload-data')
          this.selected_preset_id = null
          this.event = null
          this.notify()
        })
    }
  },
  watch: {
    'event.id'() {
      if (this.event.preset_id) {
        this.selected_preset_id = this.event.preset_id
        this.selected_preset = _.findWhere(this.presets, {id: this.event.preset_id})
      }
    }
  },
  computed: {
    presetList() {
      if (!this.presets) return [{id: '', name: ''}]
      let presetList = this.presets.map(function(preset){
        return {id : preset.id, name: preset.title}
      })
    },
    selectedFields() {

      let slug

      if (!this.selected_preset_id || !this.selectedPreset.fields) return []

      return this.selectedPreset.fields.map((field) => {
        slug = field.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
        if (this.event.fields && this.event.fields[slug])
          field.value = this.event.fields[slug].value

        return field
      });

      // .map((field) => {
      //     slug = field.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
      //     field.value = this.event.fields[slug] ?
      //
      //
      //   // if (this.event.fields) {
      //   //   field.value = _.reduce(this.event.fields, (event_field)=>{
      //   //       return event_field. ==
      //   //   })
      //   // }
      //   // return field
      // })


    },
    selectedPreset() {
      if (!this.selected_preset_id) return
      const preset = _.find(this.presets, {id: parseInt(this.selected_preset_id)})
      return preset;
    },
    // buildEvent(){
    //   if (!this.event || !this.event.preset_id) return
    //   this.selected_preset = _.findWhere(this.presets, {id: this.event.preset_id})
    // }
  }
}
</script>
