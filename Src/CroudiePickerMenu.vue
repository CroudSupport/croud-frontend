<style scoped>
    .close.icon {
        float: none;
        line-height: inherit;
    }

    .header.pointer {
        cursor: pointer;
    }
</style>

<template>
    <div class="accordion">
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
                            <input type="radio" v-model="croudie" :value="null">
                            <label>All</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" v-model="croudie" :value="1">
                            <label>Super Croudies</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" v-model="croudie" :value="0">
                            <label>Croudies</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item" v-if="croudie === 0">
            <i @click="online = null" v-show="online" class="ui right floated red close link icon"></i>
            <div>
                <semantic-form-dropdown inline :options="dateFilters" :model.sync="dateFilter"></semantic-form-dropdown>
                within the last...
            </div>
            <div class="ui form">
                <div class="grouped fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" v-model="online" value="days">
                            <label>Day</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" v-model="online" value="weeks">
                            <label>Week</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" v-model="online" value="months">
                            <label>Month</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item" v-if="croudie === 0">
            <div class="header">Hourly Rate <small>(<= £{{ rate }})</small></div>
            <input style="width:100%" type="range" min="0" :max="maxRate" v-model="rate" debounce="500"/>
            <croud-rate-histogram :rate.sync="rate" :sparks="rateHistogram"></croud-rate-histogram>
        </div>
        <input v-else value="0" v-model="rate" hidden/>
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
                <multi-search placeholder="Search countries..." :search="searchAddress" :items.sync="country"></multi-search>
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
                <populated-search placeholder="Search qualifications..." :url="searchQualification.url" :items.sync="qualification"></populated-search>
            </div>
        </div>
        <div class="item">
            <a class="title">
                <i class="dropdown icon"></i>
                <div class="ui mini blue circular label">{{ client.length }}</div>
                Clients
                <small v-if="client.length" @click.stop="client = []">clear</small>
            </a>
            <div class="content">
                <multi-search placeholder="Search clients..." :search="searchClient" :items.sync="client"></multi-search>
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
</template>

<script>
    import moment from 'moment'

    export default {
        props: {
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
            client: {
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
            online: {
                default() {
                    return null
                },
            },
            dateFilter: {
                default() {
                    return null
                },
            },
            rate: {
                default() {
                    return 15
                },
            },

            search: {
                default() {
                    return ''
                },
            },

            rateHistogram: {
                default() {
                    return []
                },
            },
        },

        data() {
            return {
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                dateFilters: [
                    {
                        id: 'last_login',
                        name: 'Logged in',
                    },
                    {
                        id: 'last_taskable',
                        name: 'Completed a Task',
                    },
                ],
                searchAddress: {
                    url: `${gateway_url}/api/country/?search={query}`,
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchLanguage: {
                    url: `${gateway_url}/api/language/?search={query}`,
                    fields: {
                        results: 'data',
                        title: 'name',
                        description : 'code',
                    },
                },

                searchQualification: {
                    url: `${gateway_url}/api/qualification?per_page=100&order_by=name,asc`,
                    fields: {
                        results: 'data',
                        title: 'name',
                    },
                },

                searchClient: {
                    url: `${gateway_url}/api/client/?search={query}`,
                    fields: {
                        results: 'data',
                        title: 'name',
                    },
                },
            }
        },

        computed: {
            maxRate() {
                if (!this.rateHistogram.length) {
                    return 100
                }

                return this.rateHistogram[this.rateHistogram.length -1].key + 10
            },
        },
    }
</script>
