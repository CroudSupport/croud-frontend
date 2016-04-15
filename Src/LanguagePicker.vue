<template>
    <table class="ui very basic table">
        <thead>
            <tr>
                <th>
                    <semantic-search v-else :url="search.url" :fields="search.fields" placeholder="Add Language...."></semantic-search>
                </th>
                <th>Primary Language</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="language in user.languages.data | orderBy level -1">
                <td>
                    {{ language.name }} -
                    <semantic-form-dropdown inline :options="levels" :model="language.level"></semantic-form-dropdown>
                </td>
                <td>
                    <div class="ui toggle checkbox">
                        <input type="radio" :value="language.id" v-model="primary">
                        <label>&nbsp</label>
                    </div>
                    <i class="red circular close link icon" @click="remove(language)"></i>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        props: {
            user: {},
        },

        data() {
            return {
                levels: [
                    {
                        id: 1,
                        name: 'Basic understanding',
                    },
                    {
                        id: 2,
                        name: 'Fluent speaking',
                    },
                    {
                        id: 3,
                        name: 'Native language',
                    },
                ],

                search: {
                    url: '/core/api/language/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },
            }
        },

        computed: {
            primary: {
                get() {
                    let value = 0

                    if (!this.user.languages) {
                        return value
                    }

                    this.user.languages.data.map(language => {
                        if (language.primary) {
                            value = language.id
                        }
                    })

                    return value
                },

                set(value) {
                    this.user.languages.data.map(language => {
                        language.primary = language.id === value ? 1 : 0
                    })
                },
            },
        },

        methods: {
            remove(language) {
                this.user.languages.data.$remove(language)
            },
        },

        events: {
            select(result) {
                if (this.user.languages.data.map(l => l.id).indexOf(result.id) === -1) {
                    result.primary = 0
                    result.level = 1
                    this.user.languages.data.push(result)
                }
            },
        },
    }
</script>
