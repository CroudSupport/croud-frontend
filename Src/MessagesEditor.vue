<template>
  <div>
    <quill :content.sync="message.note" output="html"></quill>
    asddsadsdsaads asdadsdsadas
  </div>
</template>
<script>

export default {
  props: {
    source: {
      type: Object,
      default: () => {}
    },
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
      }
    }
  }

}
</script>
