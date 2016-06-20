export default {
  props: {
    index: null,
    field: {
      type: Object,
      default() {
        return {
          id: null,
          slug: null,
          field: null,
          title: null,
          value: '',
          required: null,
          options: null,
          sort_order: null,
          preset_id: null,
          client_id: null,
          status: null
        }
      }
    },
    preset_id: '',
    event: {
      type: Object,
      default() {
        return {
          id: null,
          preset_id: null,
          fields: {}
        }
      }
    }
  },
  data() {
    return {
      field_value: ''
    }
  },
  watch: {
    field_value() {
      this.event.fields[this.fieldLabel] = field
    }
  },
  methods: {
    toSlug(text) {
      return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
    }
  },
  computed: {
    fieldLabel() {
      return this.toSlug(this.field.title)
    },
    fieldValue() {
      return 'adsdsadsa'
    }
  },
  ready() {
    this.field.slug = this.toSlug(this.field.title)

    if (!this.event.id)
      this.event.preset_id = this.preset_id

    if (this.event.fields && this.event.fields[this.toSlug(this.field.title)]) {

    }
  }
}
