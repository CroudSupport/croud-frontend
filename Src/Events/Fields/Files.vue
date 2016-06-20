<template>
  <div>
    <div class="blockMarginLeft" slot="dropzone-container">
      <croud-dropzone :multiple="true" :clickable="uploaderClass"
      :files.sync="field.value"
      :autostart="true"
      :start="init_dropzone">
        <div slot="dropzone-container">
          <div class="formRow">
            <label>{{field.title}}</label>
            <div class="blockMarginLeft">
              <div>
                <a href="#"v-for="document in field.value" class="ui label document-item" @click.prevent="removeDocument(document)">
                {{document.name}}
                <i class="delete icon"></i>
              </a>
              </div>
              <button @click.prevent class="ui tiny blue right labeled icon button {{uploader}}">
                Attach Files
                <i class="right upload icon"></i>
              </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import mixins from '../Mixins/Fields.js'
export default {
  mixins: [mixins],
  data() {
    return {
      init_dropzone: null
    }
  },
  methods: {
    removeDocument(document) {
      this.field.value = _.reject(this.field.value, (doc) =>{
        return document.id == doc.id
      })
    }
  },
  computed: {
    uploader() {
      return `file-upload-${this.preset_id}-${this.index}`
    },
    uploaderClass() {
      return `.${this.uploader}`
    }
  }
}
</script>
