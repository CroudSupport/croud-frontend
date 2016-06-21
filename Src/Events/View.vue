<template>
    <div>

        <div v-if="event.description" class="ui header modal-description">{{{event.description}}}</div>

        <table class="ui table">
          <tbody>
              <tr v-if="event.title">
                <td width="40%">Title</td>
                <td>{{{event.title}}}</td>
              </tr>
              <tr v-if="event.id">
                <td width="40%">Event ID</td>
                <td>{{{event.id}}}</td>
              </tr>
              <tr v-if="event.description">
                <td width="40%">Description</td>
                <td>{{{eventDescription}}}</td>
              </tr>
              <tr>
                <td width="40%">Created At</td>
                <td>{{eventCreated}} ({{event.timezone}})</td>
              </tr>
              <tr>
                <td width="40%">Current Status</td>
                <td>{{event.status}}</td>
              </tr>
              <tr v-if="event.description">
                <td width="40%">Created</td>
                <td>{{{eventCreated}}}</td>
              </tr>
              <tr>
                <td width="40%">Event Due Between</td>
                <td>{{startText}} - {{endText}} </td>
              </tr>
            <tr v-for="field in event.fields">
              <td width="40%">{{{field.title}}}</td>
              <td>
                  <div v-if="field.field === 'files'">
                  <a v-for="document in field.value" href="/document/download/id/{{document.id}}" class="ui label document-item">
                      {{document.name}}
                  </a>
                  </div>
                  <div v-else>
                    {{{field.value}}}
                  </div>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="editable">
              <th colspan="2">
                <div class="ui right aligned">
                    <button @click="editing = !editing" class="ui button tiny blue">Edit these details</button>
                </div>
            </th>
          </tfoot>
        </table>
    </div>
</template>

<script>
export default {
    props: {
      editing: false,
      editable: false,
      event: {
        type: Object,
        default: () => {}
        },
    },
    computed: {
        eventCreated() {
            if (!this.event) return ''
            return moment(this.event.date_created).format('ll HH:mm')
            // return moment(event.start.date).format()
        },
        startText() {
            if (!this.event) return ''
            return moment(this.event.start).format('ll HH:mm')
            // return moment(event.start.date).format()
        },
        endText() {
            if (!this.event) return ''
            return moment(this.event.end).format('ll HH:mm')
            // return moment(event.start.date).format()
        },
        eventDescription() {
            return event.description.replace(/\n/g, "<br />");
        }
    },
    methods: {
    }
}
</script>
