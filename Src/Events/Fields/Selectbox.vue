<template>
  <div class="formRow">
    <label>{{{field.title}}}</label>
    <div class="blockMarginLeft">
      <semantic-form-dropdown :fluid="true" :options="selectOptions" :model.sync="field.value"></semantic-form-dropdown>
    </div>
  </div>
</template>
<script>
import mixins from '../Mixins/Fields.js'
export default {
  mixins: [mixins],
  computed: {
    selectOptions() {
      return this.field.options.split('|').map((option)=>{
        return {
          id: option,
          name: option
        }
      });
    }
  }
}
</script>
