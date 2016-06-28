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
      <div class="ui segment basic secondary form">
        <div class="formRow" v-if="presets.length > 1 && !form_event.id">
          <label>Preset</label>
          <div class="blockMarginLeft">
            <semantic-form-dropdown :options="presetList" :model.sync="selected_preset_id" title_field="title"></semantic-form-dropdown>
          </div>
        </div>

        <div v-for="field in selected_fields">
          <component :is="fieldComponent(field)" :preset_id="selected_preset_id" :field.sync="field" :index="$index"></component>
        </div>
      </div>
      <div v-if="!event.id" class="ui segment basic center aligned">
        <button class="{{saveButtonClass}}" @click="saveEvent">Submit This Request</button>
      </div>
      <div v-else class="ui segment basic center aligned">
        <button v-if="closable" class="ui button grey" @click.prevent="cancelEvent">Cancel</button>
        <button class="{{saveButtonClass}}" @click.prevent="saveEvent">Update These Details</button>
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
    closable: {
      type: Boolean,
      default: true
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
    },
    save_path: {
      type: String,
      default: '/partners/content-manager/save'
    },
    reset_on_save: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selected_preset_id: '',
      selected_preset: {},
      selected_fields : [],
      form_event: {},
      saving: false,
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
        this.saving = true
        this.$http.post(this.save_path, data).then((response)=>{
          this.$dispatch('reload-data')
          this.notify(message)
          this.saving = false
          if (this.reset_on_save)
            this.$set('form_event', {})
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
    },
    fieldComponent(field) {
      let fieldType;

      switch(field.field) {
        case 'select':
          fieldType = 'selectbox'
          break;
        default:
        fieldType = field.field;
      }
      return fieldType
    }
  },
  watch: {

    editing() {
      if (this.event && this.event.preset_id) {
        this.selected_preset_id = this.event.preset_id
        this.selected_preset = _.findWhere(this.presets, {id: this.event.preset_id})
      } else if (this.event && this.event.preset) {
        this.selected_preset_id = this.event.preset.id
        this.selected_preset = this.event.preset
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
    saveButtonClass() {
      let className = ['ui button yellow']

      if (this.saving)
        className.push('loading')

      return className.join(' ')
    },
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
    } else if (this.event && this.event.preset) {
      this.selected_preset_id = this.event.preset.id
      this.selected_preset =this.event.preset
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
