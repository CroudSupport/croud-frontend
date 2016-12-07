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
    <div class="ui middle aligned relaxed divided list" :transition="transition">
      <div class="item" v-for="message in messages">
        <div class="right floated content">
          <button v-if="isNewMessage(message)" v-bind:class="buttonClass(message)" @click.prevent="markAsRead(message, $event, $index)">Mark As Read</button>
        </div>
        <img class="ui avatar mini image":src="author(message).avatar">
        <div class="content">
          <div class="header">
            <span v-html="author(message).name"></span> &bull; {{dateCreated(message)}}
          </div>
          <div class="description" v-html="description(message)"></div>
            <div v-if="files(message).length > 0" class="documents">
            <a v-for="file in files(message)" :href="path(file)" class="ui label document-item">
              {{filename(file)}}
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
      transition: 'fade',
      current_user: null,
      display_read_by: false,
      emit_save: false,
      legacy:  true,
      download_path: '/document/download/id/',
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
      author(message) {
        return this.legacy ? message.author : message.author.data
      },
      files(message) {
        return this.legacy ? message.documents : message.files.data
      },
      description(message) {
        return this.legacy ? message.note : message.message
      },
      path(file) {
        return `${this.download_path}${file.id}`
      },
      filename(file) {
        return this.legacy || file.filename ? file.filename : file.name
      },
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
        const callback = () => {
          event.target.parentElement.removeChild(event.target);
          message.updating = false
        }

        message.updating = true
        if (this.emit_save) {
          this.$emit('update-message', {
            message, callback, user: this.current_user
          })
          return
        }

        this.$http.post('/api/message-user/post', {user: this.current_user, message}).then((response)=>{
          event.target.parentElement.removeChild(event.target);
          message.updating = false
        })
      },
      isNewMessage(message) {
        return false

        if (this.isClient(this.current_user) && this.isClient(message.author))
          return false

        if (this.current_user.type == 'supercroud' && this.author(message).type == 'supercroud')
          return false

        const users = this.isClient(this.current_user) && this.author(message).type == 'supercroud'
        ? message.clients : message.supercrouds

        if (!users) return true
        if (!users.length) return true
        return false
      },
      dateCreated(message) {

        const date = this.legacy ? message.date_created : message.created_at
        const offset = (new moment()).utcOffset();
        return moment(date).utcOffset(offset).format('ll HH:mm')
      }
    }
  }
</script>
