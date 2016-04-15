<style scoped>

.item.active {
    background: rgba(0, 0, 0, 0.0470588)
}
</style>
<template>
    <div class="menu">
        <div class="item">
            <div class="ui transparent icon input">
                <input class="prompt" type="text" placeholder="Search filters..." v-model="search" debounce="500">
                <i v-if="search" class="red close link icon" @click="search = ''"></i>
                <i v-else class="search link icon"></i>
            </div>
        </div>
        <!-- <a v-for="filter in filters | filterBy search | orderBy 'updated_at.date' -1 | limitBy limit" class="item" @click="useFilter(filter)"> -->
        <div v-for="filter in filters | filterBy search | orderBy 'updated_at.date' -1 | limitBy limit" :class="filterClass(filter)">
            <strong class="ui blue header" @click="useFilter(filter)">{{ filter.name }} </strong>
            <semantic-icon icon="close" colour="red" link @click.prevent="deleteFilter(filter)"></semantic-icon>
            <div><small>{{ filter.updated_at.date | moment "calendar" }}</small></div>
        </div>
        <a v-if="filters.length > limit" class="item" @click="loadMore">
            Show more
            <semantic-icon class="dropdown"></semantic-icon>
        </a>
    </div>
</template>

<script>

    import _ from 'underscore'

    export default {
        props: {
            show_filter_popup : {
                default() {
                    return false
                }
            },
            currentfilter: {
                default() {
                    return {
                        name: 'New Filter',
                        content: 'Give it a short description',
                    }
                },
            },
            rules: {},
            selected_users: []
        },

        data() {
            return {
                use_selected_users: false,
                filters: [],
                search: '',
                total: 0,
                limit: 3,
                filterResource: this.$resource('/core/api/filter{/id}')
            }
        },

        ready() {
            this.refresh()
        },

        events : {
            'save-filter' : function(data){

                this.new_filter_name = data.new_filter_name
                // this.use_selected_users = data.new_filter_users
                this.use_selected_users = true

                this.$nextTick(()=>{
                    if (data.record_type == 'update') {
                        this.updateFilter()
                    } else {
                        this.saveFilter()
                    }
                })
            }
        },

        methods: {

            filterClass(filter) {
                return (this.currentfilter && filter.id === this.currentfilter.id) ? 'item active' : 'item'
            },

            refresh() {
                this.$http.get('/core/api/filter/all').then(response => {
                    this.limit = 3
                    this.$set('filters', response.data.data)
                })
            },

            loadMore() {
                this.limit += 3
            },

            saveFilter() {

                let rules = this.filterRules
                rules.name = this.new_filter_name

                this.$dispatch('close-save-dialog')

                this.filterResource.save(rules).then((response) => {
                    this.refresh()
                    this.$set('currentfilter', response.data.data)
                })
            },

            updateFilter() {

                let rules = this.filterRules
                rules.name = this.new_filter_name

                this.$dispatch('close-save-dialog')

                this.filterResource.update({id: this.currentfilter.id}, rules).then(() => {
                    this.refresh()
                })
            },

            deleteFilter(filter) {
                // this.filterResource.delete({id: this.currentfilter.id}).then(() => {

                this.filters.$remove(filter)

                this.filterResource.delete({id: filter.id}).then(() => {
                    // this.refresh()
                    this.$set('currentfilter', {
                        name: 'New Filter',
                        content: 'Give it a short description',
                    })
                })
            },

            useFilter(filter) {
                this.currentfilter = filter

                // if (filter.rules.data[0].users.data.length) this.selected_users = filter.rules.data[0].users.data

                this.$dispatch('filter-change', filter)
            }
        },

        computed: {
            filterRules() {
                return {
                    name: this.currentfilter ? this.currentfilter.name : '',
                    content: this.currentfilter ? this.currentfilter.content : '',
                    rules: [
                        this.rules,
                    ],
                    users : this.use_selected_users ? this.selected_users.map(function(user){return user.id}) : []
                }
            },
        },

    }
</script>
