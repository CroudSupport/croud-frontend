<style>
.message-editor-container {
  position:relative;
}

.document-item {
  margin:0 4px 4px 0 !important;
}

.message-documents {
  margin-top:10px;
  margin-right:220px;
  min-height:40px;
}

.dz-drag-hover .ui.segment.secondary {
  background: rgba(251, 189, 8, 0.2);
}

.message-submit {
  position:absolute;
  right:10px;
  margin-top:10px;
  text-align:right;
  width:100%;
}
</style>
<template>
  <div>
    <croud-dropzone
    :multiple="true"
    clickable=".fileuploader"
    :path="path"
    :headers="headers"
    :files.sync="new_message.documents"
    :autostart="false"
    :start="init_dropzone"
    v-on:uploading="setUploading"
    >
      <div slot="dropzone-container" class="message-editor-container">
        <div class="ui segment secondary basic">
          <quill :content.sync="new_message.note" output="html"></quill>
          <div class="message-submit">
            <button v-show="!saving && can_cancel" class="ui small grey button" @click.prevent="cancel()">
              Cancel
            </button>
            <button v-bind:class="saveButtonClass" @click.prevent="save()">
              Save Message
              <i class="right plus icon"></i>
            </button>
          </div>
          <div class="message-documents">
            <a v-for="document in new_message.documents" class="ui label document-item" @click.prevent="removeDocument(document)">
              {{document.name}}
              <i class="delete icon"></i>
            </a>
            <div>
              <button @click.prevent v-bind:class="['ui', 'tiny', 'blue', 'right', 'labeled', 'icon', 'button', 'fileuploader' , {'loading' : uploading}]">
                Attach Files
                <i class="right upload icon"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </croud-dropzone>
  </div>
</template>
<script>

import _ from 'underscore'

export default {
  props: {
    source: {
      type: Object,
      default: () => {}
    },
    can_cancel: true,
    auto_focus: false,
    auto_close: false,
    path: null,
    headers: null,
    visible: true,
    source_type: '',
    emit_save: false,
    messages: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      uploading: false,
      saving: false,
      message: {
        note: '',
        documents: [],
        author: {},
        status: 'active',
        supercrouds: [],
        clients: []
      },
      new_message: {
        note: '',
        documents: []
      },
      init_dropzone: null
    }
  },
  computed: {
    saveButtonClass() {
      const classNames = ['ui small yellow right labeled icon button']

      if (this.saving)
        classNames.push('loading')

      return classNames.join(' ')
    }
  },
  watch: {
    source() {
        this.$broadcast('set-html', '')
    },
    visible() {
      if (this.visible && this.auto_focus)
      this.$nextTick(() => {
        this.$broadcast('focus-editor')
      })
    }
  },
  methods: {
    setUploading (opt) {
      this.uploading = opt
    },
    removeDocument(document) {
      this.new_message.documents.$remove(document)
    },
    resetMessage() {
      this.documents = []
      this.$broadcast('set-html', '')
    },
    cancel() {
      this.resetMessage()
      this.visible = false
    },
    save(){

      if (this.saving) return

      const callback = ()=> {
        this.resetMessage()
        this.$broadcast('set-html', '')
        this.new_message.documents = []
        if (this.auto_close) {
          this.visible = false
        }
        this.saving = false
      }

      if (this.emit_save) {
        this.saving = true
        this.$emit('save-message', {
          message: this.new_message,
          callback
        })
        return;
      }
      const data = {
        message: this.new_message,
        source: this.source,
        source_type: 'event'
      }
      this.saving = true
      this.$http.post('/api/message/post/', data).then((response) => {
        this.source.notes.push(response.data)
        callback()
      });
    }
  },
  ready() {
      this.$set('new_message', JSON.parse(JSON.stringify(this.message)))
      this.$nextTick(()=>{
        this.init_dropzone = true
      })
  }
}
</script>
