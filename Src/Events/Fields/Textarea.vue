<template>
  <div class="formRow">
    <label>{{{field.title}}}</label>
    <div class="blockMarginLeft">
      <textarea v-model="field.value" class="textbox block"></textarea>
    </div>
  </div>
</template>

<script>
import mixins from '../Mixins/Fields.js'
export default {
  mixins: [mixins]
}
</script>
