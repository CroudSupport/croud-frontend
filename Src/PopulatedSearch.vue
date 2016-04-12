<style scoped>
    .ui.search.dropdown {
        border-radius: 500rem;
    }
    .ui.search.dropdown.active {
        border-radius: inherit;
    }
</style>

<template>
    <div>
        <div v-el:dropdown :class="dropdownClasses">
            <input type="hidden" name="user">
            <i class="dropdown icon"></i>
            <div class="default text">Search Qualifications...</div>
            <div class="menu">
                <div class="item" v-for="item in searchItems" :data-value="item[value]">
                    {{ item[title] }}
                </div>
            </div>
        </div>
        <div class="ui list">
            <div class="item" v-for="item in items">
                <semantic-label size="small" colour="blue" >
                    {{ item.name }}
                    <semantic-icon icon="close" link @click="remove(item)"></semantic-icon>
                </semantic-label>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: {},
            title: {
                default: 'name',
            },
            value: {
                default: 'id',
            },
            items: {
                default() {
                    return []
                },
            },
        },

        data() {
            return {
                searchItems: [],
                loading: false,
            }
        },

        ready() {
            this.loading = true
            this.$http.get(this.url).then(response => {
                this.loading = false
                this.$set('searchItems', response.data.data)

                $this = this
                $(this.$els.dropdown).dropdown({
                    fullTextSearch: true,
                    onChange(value) {
                        $this.addItem(value)
                    },
                })
            })
        },

        computed: {
            dropdownClasses() {
                return {
                    ui: true,
                    loading: this.loading,
                    fluid: true,
                    search: true,
                    selection: true,
                    dropdown: true,
                }
            },
        },

        methods: {
            addItem(value) {
                if (this.items.map(i => i[this.value]).indexOf(parseInt(value, 10)) !== -1) {
                    return
                }

                this.searchItems.map(item => {
                    if (item[this.value] == value) {
                        this.items.push(item)
                    }
                })

            },
            
            remove(item) {
                this.items.$remove(item)
            },
        },
    }
</script>
