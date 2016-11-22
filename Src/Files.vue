<template>
  <div class="field">
    <div v-if="noFiles">{{message}}</div>
    <div v-else>
      <div class="ui tiny icon buttons" v-for="file in files">
        <button @click.prevent="downloadFile(file)" class="ui button">{{file.name}}</button>
        <button v-if="editable" @click.prevent="removeFile($index)" class="ui button"><i class="icon delete"></i></button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    files: {
      type: Array,
      default: () => []
    },
    editable: {
      default: false
    },
    message: {
      default: 'No files attached'
    }
  },
  computed: {
    noFiles () {
      if (!this.files.length === 0) return true
      return this.files.length === 0
    }
  },
  methods: {
    downloadFile (file) {
      window.location = `/document/download-api/id/${file.reference}/`
    },
    removeFile (index) {
      this.$emit('remove-file', index)
    }
  }
}
</script>
