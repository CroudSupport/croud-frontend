<template>
    <div>
        <semantic-search v-if="local" :local="local" :fields="search.fields" :placeholder="placeholder"></semantic-search>
        <semantic-search v-else :url="search.url" :fields="search.fields" :placeholder="placeholder" :search-delay="searchDelay"></semantic-search>
        <div class="ui list" v-if="display_results">
            <div class="item" v-for="item in items">
                <semantic-label size="small" colour="blue" >
                    <i v-if="flag" class="{{ item.code.toLowerCase() }} flag"></i>
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
            display_results: true,
            placeholder: '',
            search: {},
            local: {},
            items: {},
            flag: {
                default: false,
            },
            searchDelay: {
                default: 500,
            },
        },

        methods: {
            remove(item) {
                this.items.$remove(item)
            },
        },

        events: {
            select(result) {
                if (this.items.map((item) => item.id).indexOf(result.id) === -1) {
                    this.items.push(result)
                }
            },
        },
    }
</script>
