<template>
  <div class="formRow">
    <label>{{{field.title}}}</label>
    <div class="blockMarginLeft">
      <input type="text" v-model="field.value" class="textbox block" />
    </div>
  </div>
</template>

<script>
import mixins from '../Mixins/Fields.js'
export default {
  mixins: [mixins]
}
</script>
