<style>
    .close.icon {
        float: none;
        line-height: inherit;
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
            <div class="header">Hourly Rate <small>(<= £{{ rate }})</small></div>
            <input style="width:100%" type="range" min="1" max="50" v-model="rate" debounce="500"/>
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
        },

        data() {
            return {
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
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
                    url: '/core/api/qualification?per_page=100&order_by=name,asc',
                    fields: {
                        results: 'data',
                        title: 'name',
                    },
                },
            }
        },
    }
</script>
