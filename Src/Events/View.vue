<template>
    <div>

    <div v-if="event.description" class="ui header modal-description">{{{event.description}}}</div>
    <p class="body">Runs between <strong>{{event.start.date}}</strong> and <strong>{{event.end.date}}</strong> ({{event.timezone}})</p>
        summary: {{event.summary | json}}<br />
        start: {{event.start | json}}<br />
        Status: {{event.status | json}}<br />
        description: {{event.end| json}}<br />
        start: {{event.start| json}}<br />
        end: {{event.end| json}}<br />
        documents: {{event.documents| json}}<br />
        {{event.fields | json}}
    </div>
</template>

<script>
export default {
    props: {
      event: {
        type: Object,
        default: () => {}
      }
    }
}
</script>
