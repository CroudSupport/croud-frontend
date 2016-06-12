<style scoped>
.ui.relaxed.list:not(.horizontal) > .item
{
    padding-top:15px;
    padding-bottom:15px;
    line-height:1.6em;
}

.header {
  margin-bottom:5px !important;
}

.description div {
  margin-bottom:5px;
}

.documents {
  margin-top:10px
}

</style>
<template>
  <div>
    <div class="ui list relaxed celled">
      <div class="item" v-for="message in messages">
        <img class="ui avatar image":src="message.author.avatar">
        <div class="content">
          <div class="header">{{message.author.name}} {{message.date_created}}</div>
          <div class="description">{{{message.note}}}</div>
          <!-- {{message | json}} -->
            <div v-if="message.documents.length > 0" class="documents">
            <a v-for="document in message.documents" href="/document/download/id/{{document.id}}" class="ui label document-item">
              {{document.filename}}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      messages:  {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {

      }
    }
  }
</script>
