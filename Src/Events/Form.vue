<style>
.formContainerGroups {
  margin-bottom:20px;
}

.dz-drag-hover .formRow {
  background: rgba(251, 189, 8, 0.2) !important;
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
      <div class="ui segment basic secondary form">
        <div class="formRow" v-if="presets.length > 1 && !form_event.id">
          <label>Preset</label>
          <div class="blockMarginLeft">
            <semantic-form-dropdown :options="presetList" :model.sync="selected_preset_id" title_field="title"></semantic-form-dropdown>
          </div>
        </div>
        <div v-for="field in selected_fields">
          <component :is="field.field" :preset_id="selected_preset_id" :field.sync="field" :index="$index"></component>
        </div>
      </div>
      <div v-if="!event.id" class="ui segment basic center aligned">
        <button class="ui button yellow" @click="saveEvent">Submit This Request</button>
      </div>
      <div v-else class="ui segment basic center aligned">
        <button class="ui button grey" @click="cancelEvent">Cancel</button>
        <button class="ui button yellow" @click="saveEvent">Update These Details</button>
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
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected_preset_id: '',
      selected_preset: {},
      selected_fields : [],
      form_event: {}
    }
  },
  methods: {
    notify(message) {
      Croud.notifications.addMessage(message)
    },
    cancelEvent() {
      this.editing = false
    },
    saveEvent() {
        const data = {
          fields: this.selected_fields,
          event: this.form_event,
          preset_id: this.selected_preset_id
        }

        const message = this.form_event.id ? 'Your request has been updated.' : 'Your request has been sent.';

        this.$http.post('/partners/content-manager/save', data).then((response)=>{
          this.$dispatch('reload-data')
          this.$set('form_event', {})
          this.notify(message)
        })
    },
    buildEvent() {
      this.form_event = JSON.parse(JSON.stringify(this.event))
      this.buildFields()
    },
    buildFields() {

      let fields = []
      if (this.form_event && this.form_event.fields) {
        this.selected_fields =  JSON.parse(JSON.stringify(this.form_event.fields))
        return
      }

      if (!this.selected_preset_id || !this.selectedPreset.fields) {
        this.selected_fields = []
      }

      this.selected_fields = JSON.parse(JSON.stringify(this.selectedPreset.fields))
    }
  },
  watch: {

    editing() {
      if (this.event && this.event.preset_id) {
        this.selected_preset_id = this.event.preset_id
        this.selected_preset = _.findWhere(this.presets, {id: this.event.preset_id})
      }
      this.buildEvent()
    },
    presets() {
      if (this.presets.length == 1){
        this.selected_preset_id = this.presets[0]['id']
        this.selected_preset = this.presets[0]
      }
    },
  },
  computed: {
    presetList() {
      if (!this.presets) return [{id: '', name: ''}]
      // this.presets.unshift({id: '', title: 'Choose an event type'})
      return this.presets
    },
    selectedPreset() {
      if (!this.selected_preset_id) return
      const preset = _.find(this.presets, {id: parseInt(this.selected_preset_id)})
      return preset;
    },
  },
  ready() {
    if (this.presets.length == 1){
      this.selected_preset_id = this.presets[0]['id']
      this.selected_preset = this.presets[0]
    }
    // this.buildFields()
  },
  events: {
    'reset-fields'() {
      this.form_event = {}
      this.selected_fields = {}

      // this.$log(this.event)
      this.$nextTick(()=>{
        this.buildEvent()
      })

      // this.buildFields()
    }
  }
}
</script>
