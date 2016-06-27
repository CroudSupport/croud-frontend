

<template>
    <div>
      <div v-el:dropzone>
          <slot name="dropzone-container">
              <slot name="dropzone-message">Drop files here to upload</slot>
          </slot>
      </div>
    </div>
</template>

<script>

import Dropzone from 'dropzone';
export default {

    props : {
        start: null,
        autostart: {
            default: true
        },
        multiple : {
            default : false
        },
        path : {
            default : '/document/upload-unlinked/'
        },
        file : {
            default : 'user_file'
        },
        files : {
            type: Array,
            default : () => []
        },
        target : {
            default : 'dropzone'
        },
        clickable : {
            default : false
        },
        previewTemplate : {
            default : '<div style="display:none"></div>'
        },
        createImageThumbnails : {
            default : false
        },
        uploading: false,
    },
    data() {
        return {
            initialised: false
        }
    },
    computed: {
        multipleUploads() {
            return this.multiple ? true : false;
        }
    },
    watch: {
        start() {
            if (this.autostart || this.initialised) return
            this.build()
        }
    },
    methods: {
        build() {
            if (this.initialised) return

            Dropzone.autoDiscover = false;
            const params = {
                url: this.path,
                multiple: this.multiple,
                paramName: this.file,
                createImageThumbnails: this.createImageThumbnails,
                clickable: this.clickable,
                previewTemplate: this.previewTemplate
            };

            // let dz = new Dropzone(this.target, params);
            const dz = new Dropzone(this.$els.dropzone, params);

            dz.on("sending", (file) => {
                this.$dispatch('file-sending', file);
                this.uploading = true
            });

            dz.on("addedfile", (file) => {
                this.$dispatch('file-added', file);
            });

            dz.on("success", (file, response) => {
                this.$dispatch('file-upload-success', response);
                this.uploading = false
                if (!this.files) this.files = [];

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                this.files.push(response);
            });

            dz.on("error", (file, errorMessage, xhr) => {
                this.uploading = false
                this.$dispatch('file-upload-error', {
                    file: file,
                    response: response,
                    xhr: xhr
                });
            });

            dz.on("queuecomplete", (file) => {
                this.$dispatch('file-upload-queue-completed', file);
            });

            this.initialised = true
        }
    },
    ready() {
        if (this.autostart)
            this.build()
    }
}

</script>
