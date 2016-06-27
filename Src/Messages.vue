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

        <div class="right floated content">
          <button v-if="isNewMessage(message)" v-bind:class="buttonClass(message)" @click.prevent="markAsRead(message, $event, $index)">Mark As Read</button>
        </div>

        <img class="ui avatar image":src="message.author.avatar">
        <div class="content">
          <div class="header">
            {{message.author.name}} &bull; {{dateCreated(message)}}
          </div>
          <div class="description">{{{message.note}}}</div>
            <div v-if="message.documents && message.documents.length > 0" class="documents">
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
  import _ from 'underscore'
  export default {
    props: {
      current_user: null,
      display_read_by: false,
      messages:  {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        updating: false
      }
    },
    methods: {
      buttonClass(message) {
        const className = ['ui yellow basic tiny button right aligned'];
        if (message.updating) className.push('loading')
        return className.join(' ')
      },
      isClient(user) {
        return ['client', 'organisation'].indexOf(user.type) >= 0
      },
      markAsRead(message, event, index)
      {
        if (message.updating) return
        message.updating = true
        this.$http.post('/api/message-user/post', {user: this.current_user, message}).then((response)=>{
          event.target.parentElement.removeChild(event.target);
          message.updating = false
        })
      },
      isNewMessage(message) {

        if (this.isClient(this.current_user) && this.isClient(message.author))
          return false

        if (this.current_user.type == 'supercroud' && message.author.type == 'supercroud')
          return false

        const users = this.isClient(this.current_user) && message.author.type == 'supercroud'
        ? message.clients : message.supercrouds

        if (!users) return true

        if (!users.length) return true

        return false

        // return _.find(users, (user) => {
        //   user.id == this.current_user.id
        // }).length == 0

      },
      dateCreated(message) {
        const offset = (new moment()).utcOffset();
        return moment(message.date_created).utcOffset(offset).format('ll HH:mm')
      }
    }
  }
</script>
