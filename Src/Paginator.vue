<template>
    <div v-if="totalPages" class="ui center aligned basic segment">
        <a @click="current = 1" v-if="current > 1" class="ui circular basic mini blue button">
            First
        </a>
        <a @click="current -= 1" v-if="current > 1" class="ui circular basic mini icon blue button">
            <i class="left arrow icon"></i>
        </a>
        <div class="ui tiny label">{{ current }} / {{ totalPages }}</div>
        <a @click="current += 1" v-if="current < totalPages" class="ui circular basic mini icon blue button">
            <i class="right arrow icon"></i>
        </a>
        <a @click="current = totalPages" v-if="current < totalPages" class="ui circular basic mini blue button">
            Last
        </a>
    </div>
</template>

<script>
    export default {
        props: {
            total: {},
            current: {},
            limit: {},
        },

        computed: {
            totalPages() {
                return parseInt(this.total / this.limit, 10)
            },
        },
    }
</script>
