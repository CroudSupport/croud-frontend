<template>
    <div>
        <div class="menu">
            <div v-if="currentFilter.id" class="item">
                <semantic-icon icon="save" title="Update this Filter" circular colour="blue" @click="updateFilter"></semantic-icon>
                <semantic-icon icon="fork" title="Fork this Filter" circular colour="yellow" @click="saveFilter"></semantic-icon>
                <div class="header">Current Filter</div>
                <div class="ui transparent large icon input">
                    <input class="prompt" type="text" placeholder="Title" v-model="currentFilter.name"/>
                </div>
                <div class="ui transparent icon input">
                    <input class="prompt" type="text" placeholder="Description" v-model="currentFilter.content"/>
                </div>
            </div>
            <a v-else class="item">
                <semantic-icon icon="plus" title="Create a new Filter" circular colour="yellow" inverted size="mini" @click="saveFilter"></semantic-icon>
                <div class="header">Save</div>
                <small>Save current rules as a filter</small>
            </a>
        </div>
        <div class="item">
            <div class="ui transparent icon input">
                <input class="prompt" type="text" placeholder="Search filters..." v-model="search" debounce="500">
                <i class="search link icon"></i>
            </div>

        </div>
        <div class="item">
            <div class="menu">
                <a v-for="filter in filters | filterBy search | orderBy 'updated_at.date' -1" class="item" @click="useFilter(filter)" transition="fade">
                    <div class="header">
                        <strong class="ui header">{{ filter.name }}</strong>
                        <div><small>{{ filter.updated_at.date | moment "calendar" }}</small></div>
                    </div>
                    {{ filter.content }}
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
            }
        },

        ready() {
            this.refresh()
        },

        methods: {
            refresh() {
                this.$http.get('/core/api/filter').then(response => {
                    this.$set('filters', response.data.data)
                })
            },

            saveFilter() {
                this.$http.post('/core/api/filter', this.filterRules).then((response) => {
                    this.refresh()
                    this.$set('currentFilter', response.data.data)
                })
            },

            updateFilter() {
                this.$http.put(`/core/api/filter/${this.currentFilter.id}`, this.filterRules).then(() => {
                    this.refresh()
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
