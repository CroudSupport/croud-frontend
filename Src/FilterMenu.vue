<template>
    <div>
        <div class="menu">
            <div v-if="currentFilter.id" class="item">
                <semantic-icon icon="save" title="Update this Filter" circular colour="blue" @click="updateFilter" link></semantic-icon>
                <semantic-icon icon="fork" title="Fork this Filter" circular colour="yellow" @click="saveFilter" link></semantic-icon>
                <semantic-icon icon="trash" title="Delete this Filter" circular @click="deleteFilter" link></semantic-icon>

                <div class="header">Current Filter</div>
                <div class="ui transparent large icon input">
                    <input class="prompt" type="text" placeholder="Title" v-model="currentFilter.name"/>
                </div>
                <div class="ui transparent icon input">
                    <input class="prompt" type="text" placeholder="Description" v-model="currentFilter.content"/>
                </div>
            </div>
            <a v-else class="item" @click="saveFilter">
                <semantic-icon icon="plus" title="Create a new Filter" circular colour="yellow" inverted size="mini"></semantic-icon>
                <div class="header">Save</div>
                <small>Save current rules as a filter</small>
            </a>
        </div>
        <div class="item">
            <div class="ui transparent icon input">
                <input class="prompt" type="text" placeholder="Search filters..." v-model="search" debounce="500">
                <i v-if="search" class="red close link icon" @click="search = ''"></i>
                <i v-else class="search link icon"></i>

            </div>

        </div>
        <div class="item">
            <div class="menu">
                <a v-for="filter in filters | filterBy search | orderBy 'updated_at.date' -1 | limitBy limit" class="item" @click="useFilter(filter)">
                    <div class="header">
                        <strong class="ui blue header">{{ filter.name }}</strong>
                        <div><small>{{ filter.updated_at.date | moment "calendar" }}</small></div>
                    </div>
                    {{ filter.content }}
                </a>
                <a v-if="filters.length > limit" class="item" @click="loadMore">
                    Show more
                    <semantic-icon class="dropdown"></semantic-icon>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            currentFilter: {
                default() {
                    return {
                        name: 'New Filter',
                        content: 'Give it a short description',
                    }
                },
            },
            rules: {},
        },

        data() {
            return {
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

        methods: {
            refresh() {
                this.$http.get('/core/api/me?include=filters').then(response => {
                    this.limit = 3
                    this.$set('filters', response.data.data.filters.data)
                })
            },

            loadMore() {
                this.limit += 3
            },

            saveFilter() {
                this.filterResource.save(this.filterRules).then((response) => {
                    this.refresh()
                    this.$set('currentFilter', response.data.data)
                })
            },

            updateFilter() {
                this.filterResource.update({id: this.currentFilter.id}, this.filterRules).then(() => {
                    this.refresh()
                })
            },

            deleteFilter() {
                this.filterResource.delete({id: this.currentFilter.id}).then(() => {
                    this.refresh()
                    this.$set('currentFilter', {
                        name: 'New Filter',
                        content: 'Give it a short description',
                    })
                })
            },

            useFilter(filter) {
                this.currentFilter = filter
                this.$dispatch('filter-change', filter)
            }
        },

        computed: {
            filterRules() {
                return {
                    name: this.currentFilter.name,
                    content: this.currentFilter.content,
                    rules: [
                        this.rules,
                    ],
                }
            },
        },

    }
</script>
