<style scoped>
    .ui.accordion.menu a.title.item {
        padding: 0.92857143em 1.14285714em;
        background: rgba(0, 0, 0, 0.05);
    }

    .ui.fluid.card {
        cursor: pointer;
    }
</style>

<template>
    <span>
        <div v-if="show_picker_button">
            <strong>
                <a @click="show">Croudie Picker</a>
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
                        <h2 class="ui header">Croudie Picker <small v-show="filteredCroudies.length > 1">({{filteredCroudies.length}} found)</small></h2>
                    </div>
                    <div class="right floated right aligned column">
                        <a v-if="filteredCroudies.length > 1 && filteredCroudies.length < 50" transition="fade" class="ui blue basic button" @click="addAll">Select all {{ filteredCroudies.length }} croudies</a>
                        <a class="ui blue basic button" @click="showModal = false">Continue</a>
                    </div>
                </div>
            </div>
            <div class="ui stackable grid">
                <div class="ui five wide secondary column">
                    <div class="ui basic segment">
                        <div v-el:accordion class="ui vertical accordion fluid menu">
                            <!-- <a class="active title item">
                                <i class="dropdown icon"></i>
                                Rules
                            </a> -->
                            <div class="active content">
                                <croudie-picker-menu :croudie.sync="croudie" :language.sync="language" :country.sync="country" :qualification.sync="qualification" :availability.sync="availability" :rate.sync="rate" :search.sync="search"></croudie-picker-menu>
                            </div>

                            <!-- <a class="title item">
                                <i class="dropdown icon"></i>
                                Filters
                            </a>
                            <div class="content">
                                <filter-menu :rules.sync="filters"></filter-menu>
                            </div> -->
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
                            <span v-if="croudie.rate" class="right floated time">
                                <div class="ui basic label">
                                  &pound;{{croudie.rate}}
                                </div>
                            </span>
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
    import FilterMenu from './FilterMenu.vue'
    import CroudiePickerMenu from './CroudiePickerMenu.vue'

    export default {
        props: {
            show_picker_button : {
                default() {
                    return true
                },
            },
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
                default() {
                    return null
                },
            },
        },

        data() {
            return {
                croudies: [],
                loading: true,
                showModal: false,
                search: '',
                rate: 15,
                limit: 5,
            }
        },

        ready() {
            $(this.$els.accordion).accordion()
            $.fn['iCheck'] = function() {}
        },

        components: {
            FilterMenu,
            CroudiePickerMenu,
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
                    return this.selected.map((s) => s.code).indexOf(croudie.code) === -1
                })
            },

            addAll() {
                this.filteredCroudies.map(croudie => {
                    this.add(croudie)
                })
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
                    include: true,
                }

                this.loading = true
                this.$http.post('/core/api/user/pick', data).then((response) => {
                    this.$set('croudies', response.data.data)
                    this.loading = false
                    this.limit = 5
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

        watch: {
            croudie(value) {
                if (value === 0 && parseFloat(this.rate, 10) < 1) {
                    this.rate = 15
                }
            },
        },

        events: {
            'open-croudie-picker'() {
                this.show()
            },
            'filter-change'(filter) {
                this.currentFilter = filter
                this.language = filter.rules.data[0].languages.data
                this.country = filter.rules.data[0].countries.data
                this.qualification = filter.rules.data[0].qualifications.data
                this.availability = filter.rules.data[0].availability.data.map(day => day.day_of_week)
                this.croudie = filter.rules.data[0].system
                this.rate = parseFloat(filter.rules.data[0].rate, 10)
            },
        },
    }
</script>
