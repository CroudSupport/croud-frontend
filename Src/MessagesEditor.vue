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
    <croud-dropzone :multiple="true" clickable=".fileuploader" :files.sync="new_message.documents" :autostart="false" :start="init_dropzone">
      <div slot="dropzone-container" class="message-editor-container">
        <div class="ui segment secondary basic">
          <quill :content.sync="new_message.note" output="html"></quill>
          <div class="message-submit">
            <button class="ui small yellow right labeled icon button" @click.prevent="save()">
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
              <button @click.prevent class="ui tiny blue right labeled icon button fileuploader">
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
    source_type: '',
    messages: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
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
  },
  watch: {
    source() {
        this.$broadcast('set-html', '')
    }
  },
  methods: {
    removeDocument(document) {
      this.new_message.documents.$remove(document)
    },
    resetMessage() {
      this.$set('new_message', _.extend({}, this.message))
    },
    save(){

      // if (this.new_message.note == ''
      // && this.this.new_message.documents.length == 0) return

      const data = {
        message: this.new_message,
        source: this.source,
        source_type: 'event'
      }
      this.$http.post('/api/message/post/', data).then((response) => {
        this.source.notes.push(response.data)
        this.resetMessage()
        this.$broadcast('set-html', '')
        this.new_message.documents = []


      });
    }
  },
  ready() {
      this.new_message = _.extend({}, this.message)
      this.$nextTick(()=>{
        this.init_dropzone = true
      })
  }
}
</script>
