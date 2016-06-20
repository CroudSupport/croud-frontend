<template>
  <span>
    <input type="hidden" v-model="field.value" />
  </span>
</template>

<script>
import mixins from '../Mixins/Fields.js'

export default {
  mixins: [mixins]
}
</script>
