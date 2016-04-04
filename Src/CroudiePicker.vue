<template>
    <span>
        <div>
            <strong>
                <slot name="croudie_picker_button">
                    <a @click="show">Croudie Picker</a>
                </slot>
            </strong>
        </div>
        <div v-if="show_selected && selected.length">
            <span v-for="croudie in selected">
                <img class="ui mini circular inline image" :title="croudie.name" :src="croudie.avatar">
            </span>
        </div>
        <semantic-modal size="large" :active.sync="showModal">
            <div v-if="filters"></div>
            <div class="ui basic segment">
                <div class="ui top aligned two column grid">
                    <div class="column">
                        <h2 class="ui header">Croudie Picker</h2>
                    </div>
                    <div class="right floated right aligned column">
                        <a v-if="filteredCroudies.length > 1" transition="fade" class="ui blue basic button" @click="addAll">Select all {{ filteredCroudies.length }} croudies</a>
                        <a class="ui blue basic button" @click="showModal = false">Continue</a>
                    </div>
                </div>
            </div>
                <div class="ui stackable grid">
                    <div class="ui five wide secondary column">
                        <div class="ui basic segment">
                            <div v-el:accordion class="ui vertical accordion fluid menu">
                                <div class="item">
                                    <div class="ui transparent icon input">
                                        <input class="prompt" type="text" placeholder="Search croudies..." v-model="search" debounce="500">
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
                                    <div class="header">Hourly Rate <small>(<= £{{ rate }})</small></div>
                                    <input style="width:100%" type="range" min="1" max="50" v-model="rate" debounce="500"/>
                                </div>
                                <div class="item">
                                    <a class="title">
                                        <i class="dropdown icon"></i>
                                        <div class="ui mini blue circular label">{{ language.length }}</div>
                                        Languages
                                        <small v-if="language.length" @click.stop="language = []">clear</small>
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
                                        <small v-if="country.length" @click.stop="country = []">clear</small>
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
                                        <small v-if="qualification.length" @click.stop="qualification = []">clear</small>
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
                                        <small v-if="availability.length" @click.stop="availability = []">clear</small>
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

                    <div class="ui seven wide center aligned column">
                        <div v-if="filteredCroudies.length === 0 && croudies.length > 0" class="ui very padded basic segment">
                            <h4 class="ui icon grey header">
                                <i class="circular users icon"></i>
                                All croudies in this filter have been selected
                            </h4>
                        </div>
                        <div v-if="croudies.length === 0" class="ui very padded basic segment">
                            <h4 class="ui icon grey header">
                                <i class="circular users icon"></i>
                                No croudies match this filter
                            </h4>
                        </div>
                        <div :class="dimmerClasses">
                            <div class="ui text large loader">Loading</div>
                        </div>
                        <div v-for="croudie in filteredCroudies | limitBy limit" @click="add(croudie)" class="ui fluid yellow card" >
                            <div class="left aligned content">
                                <img v-if="croudie.avatar" class="left floated mini circular ui image" :src="croudie.avatar" />

                                <div class="header">{{ croudie.name }}</div>
                                <div class="meta">{{ croudie.email }}</div>
                            </div>
                        </div>
                        <a v-if="filteredCroudies.length > limit" class="ui circular basic icon button" @click="loadMore">
                            Show more
                            <semantic-icon class="dropdown"></semantic-icon>
                        </a>
                    </div>

                    <div class="ui four wide column">
                        <div class="ui basic segment">
                            <strong class="ui header">Selected Croudies <small v-if="selected.length" @click.stop="selected = []">clear</small></strong>
                            <div class="ui relaxed list">
                                <div class="item" v-for="croudie in selected" transition="fade">
                                    <img v-if="croudie.avatar" class="left floated mini circular ui image" :src="croudie.avatar" />
                                    {{ croudie.name }}
                                    <semantic-icon icon="close" colour="red" link @click="remove(croudie)"></semantic-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </semantic-modal>
    </span>
</template>

<script>
    import Vue from 'vue'

    export default {
        props: {
            show_selected: {
                default() {
                    return false
                },
            },
            selected: {
                default() {
                    return []
                },
            },
            language: {
                default() {
                    return []
                },
            },
            country: {
                default() {
                    return []
                },
            },
            qualification: {
                default() {
                    return []
                },
            },
            availability: {
                default() {
                    return []
                },
            },
            croudie: {
                default: '',
            },
        },

        data() {
            return {
                croudies : [],
                loading: true,
                showModal: false,
                search: '',
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                rate: 0,
                limit: 5,

                searchAddress: {
                    url: '/core/api/country/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchLanguage: {
                    url: '/core/api/language/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchQualification: {
                    url: '/core/api/qualification/?search={query}',
                    fields: {
                        results: 'data',
                        title: 'name',
                    },
                },
            }
        },

        ready() {
            $(this.$els.accordion).accordion()
            $.fn['iCheck'] = function() {}
        },

        methods: {
            show() {
                this.showModal = true
            },

            add(croudie) {
                this.selected.push(croudie)
            },

            remove(croudie) {
                this.selected.$remove(croudie)
            },

            loadMore() {
                this.limit += 5
            },

            hideSelected(data) {
                return data.filter(croudie => {
                    return this.selected.map((s) => s.id).indexOf(croudie.id) === -1
                })
            },

            addAll() {
                this.filteredCroudies.map(croudie => {
                    this.add(croudie)
                })
            },

            saveFilter() {
                this.$http.post('/core/api/filter', this.filterRules).then((response) => {})
            },
        },

        computed: {
            filteredCroudies() {
                const filterBy = Vue.filter('filterBy')

                return filterBy(this.hideSelected(this.croudies), this.search, 'name')
            },

            filters() {
                const data = {
                    languages: this.language.map((language) => language.id),
                    countries: this.country.map((country) => country.id),
                    qualifications: this.qualification.map((qualification) => qualification.id),
                    availability: this.availability,
                    tags: this.tags,
                    system: this.croudie,
                    rate: this.rate,
                }

                this.loading = true
                this.$http.post('/core/api/user/pick', data).then((response) => {
                    this.$set('croudies', response.data.data)
                    this.loading = false
                    this.limit = 5
                })

                return data
            },

            filterRules() {
                return {
                    name: 'Test',
                    content: 'Test Filter',
                    rules: [
                        this.filters,
                    ],
                }
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
