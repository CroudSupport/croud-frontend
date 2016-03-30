<template>
    <span>
        <a @click="show">
            <i class="users icon"></i>
            Croudie Picker
        </a>
        <semantic-modal size="large" :active.sync="show_modal">
            <div v-if="filters"></div>
            <div class="ui basic segment">
                <div class="ui top aligned two column grid">
                    <div class="column">
                        <h2 class="ui header">Croudie Picker</h2>
                    </div>
                    <div class="right floated right aligned column">
                        <a class="ui blue button">Continue</a>
                    </div>
                </div>
            </div>
                <div class="ui stackable grid">
                    <div class="ui five wide secondary column">
                        <div class="ui basic segment">
                            <div v-el:accordion class="ui vertical accordion fluid menu">
                                <div class="item">
                                    <div class="ui transparent icon input">
                                        <input class="prompt" type="text" placeholder="Search croudies..." v-model="search">
                                        <i class="search link icon"></i>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="ui form">
                                        <div class="grouped fields">
                                            <div class="field">
                                                <div class="ui radio checkbox">
                                                    <input type="radio" v-model="croudie" value="">
                                                    <label>All</label>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="ui radio checkbox">
                                                    <input type="radio" v-model="croudie" value="1">
                                                    <label>Super Croudies</label>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="ui radio checkbox">
                                                    <input type="radio" v-model="croudie" value="0">
                                                    <label>Croudies</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="header">Hourly Rate <small>(< £{{ rate }})</small></div>
                                    <input style="width:100%" type="range" min="1" max="50" v-model="rate" />
                                </div>
                                <div class="item">
                                    <a class="title">
                                        <i class="dropdown icon"></i>
                                        <div class="ui mini blue circular label">{{ language.length }}</div>
                                        Languages
                                    </a>
                                    <div class="content">
                                        <multi-search placeholder="Search languages..." :search="searchLanguage" :items.sync="language"></multi-search>
                                    </div>
                                </div>
                                <div class="item">
                                    <a class="title">
                                        <i class="dropdown icon"></i>
                                        <div class="ui mini blue circular label">{{ country.length }}</div>
                                        Countries
                                    </a>
                                    <div class="content">
                                        <multi-search :flag="true" placeholder="Search countries..." :search="searchAddress" :items.sync="country"></multi-search>
                                    </div>
                                </div>
                                <div class="item">
                                    <a class="title">
                                        <i class="dropdown icon"></i>
                                        <div class="ui mini blue circular label">{{ qualification.length }}</div>
                                        Qualifications
                                    </a>
                                    <div class="content">
                                        <multi-search placeholder="Search qualifications..." :search="searchQualification" :items.sync="qualification"></multi-search>
                                    </div>
                                </div>
                                <div class="item">
                                    <a class="title">
                                        <i class="dropdown icon"></i>
                                        <div class="ui mini blue circular label">{{ availability.length }}</div>
                                        Availability
                                    </a>
                                    <div class="content">
                                        <div class="ui form">
                                            <div class="grouped fields">
                                                <div class="field" v-for="day in days">
                                                    <div class="ui checkbox">
                                                        <input type="checkbox" id="{{ day }}" value="{{ day }}" v-model="availability">
                                                        <label for="{{ day }}">{{ day }}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ui seven wide column">
                        <div :class="dimmerClasses">
                            <div class="ui text large loader">Loading</div>
                        </div>
                        <div v-if="selected.indexOf(croudie) === -1" v-for="croudie in croudies | filterBy search" @click="add(croudie)" class="ui fluid yellow card" >
                            <div class="content">
                                <div class="header">{{ croudie.name }}</div>
                                <div class="meta">{{ croudie.email }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="ui four wide column">
                        <div class="ui basic segment">
                            <strong class="ui header">Selected Croudies</strong>
                            <div class="ui list">
                                <div class="item" v-for="croudie in selected" transition="fade">
                                    <semantic-icon icon="close" colour="red" link @click="remove(croudie)"></semantic-icon>
                                    {{ croudie.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </semantic-modal>
    </span>
</template>

<script>
    import MultiSearch from './MultiSearch.vue'

    export default {
        props: {
            selected: {
                default() {
                    return []
                },
            },
        },

        data() {
            return {
                loading: true,
                show_modal: false,
                croudie: '',
                croudies: [],
                search: '',
                language: [],
                country: [],
                qualification: [],
                availability: ['Tuesday'],
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                rate: 13,

                searchAddress: {
                    url: '/api/country/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchLanguage: {
                    url: '/api/language/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchQualification: {
                    url: '/api/qualification/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchDays: {
                    fields: {
                        results: 'data',
                        title: 'name',
                    },
                },
            }
        },

        components: {
            MultiSearch,
        },

        ready() {
            this.$http.post('/api/user/pick', this.filters).then((response) => {
                this.$set('croudies', response.data.data)
            })
            $(this.$els.accordion).accordion()
        },

        methods: {
            show() {
                this.show_modal = true
            },

            add(croudie) {
                this.selected.push(croudie)
            },

            remove(croudie) {
                this.selected.$remove(croudie)
            },
        },

        computed: {
            filters() {
                const data = {
                    languages: this.language.map((language) => language.id),
                    countries: this.country.map((country) => country.id),
                    qualifications: this.qualification.map((qualification) => qualification.id),
                    availability: this.availability,
                    tags: this.tags,
                    system: this.croudie,
                }

                this.loading = true
                this.$http.post('/api/user/pick', data).then((response) => {
                    this.$set('croudies', response.data.data)
                    this.loading = false
                })

                return data
            },

            dimmerClasses() {
                return {
                    ui: true,
                    active: this.loading,
                    inverted:true,
                    dimmer: true,
                }
            },
        },
    }
</script>
