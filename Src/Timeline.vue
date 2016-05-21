<style scoped>
    div.timeline {
        overflow: auto;
    }

    .rows rect {
        fill: #fff;
    }
    .rows rect:nth-child(even) {
        fill: #f5f5f5;
    }

    .blocks rect {
        fill: #c6dafc;
        transition: all 400ms;
        filter: url(#dropshadow);
    }
    .block:hover {
        stroke: #ddd;
        stroke-width: 3px;
        cursor: pointer;
    }

    text {
        cursor: default;
        -webkit-user-select: none;
        -webkit-font-smoothing: antialiased;
        font-family: Arial;
        font-size: 13px;
    }
</style>

<template>
    <div v-el:container>
        <div class="ui top menu">
            <div class="item">
                <div class="ui icon input">
                    <i v-if="search" @click="search=''" class="red close link icon"></i>
                    <i v-else class="search link icon"></i>
                    <input v-model="search" />
                </div>
            </div>
            <div class="right menu">
                <div class="item">
                    <div class="ui input">
                        <select class="ui label dropdown" v-model="category">
                            <option :value="null">All</option>
                            <option v-for="cat in categories">{{ cat.name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="timeline">
            <svg v-el:svg :width="svgWidth" :height='limits.height'>
                <filter id="dropshadow" height="130%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="0" dy="3" result="offsetblur"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <g>
                    <g class="rows">
                        <rect v-for="block in groupings" x:"0" :y="blockHeight * $index" width="100%" :height="blockHeight" stroke="#f5f5f5" stroke-width="2"></rect>
                    </g>

                    <g v-for="block in groupings">
                        <title>{{ block }}</title>
                        <text @click="select(block)" text-anchor="right" :x="5" :y="($index * blockHeight) + 5 +(blockHeight / 2)">{{ block | truncate 20 }}</text>
                    </g>

                    <g class="graph" transform="translate(175, 0)">
                        <g>
                            <g v-for="line in gridLines">
                                <line :x1='$index * scaleWidth' y1='0%' :x2='$index * scaleWidth' y2='100%' style='stroke: rgba(234, 243, 234, 0.5); stroke-width: 1;'></line>
                                <line v-if="$index % smartGrids === 0" :x1='$index * scaleWidth' y1='0%' :x2='$index * scaleWidth' y2='99%' style='stroke: rgba(234, 243, 234, 0.9); stroke-width: 5;'></line>
                                <text v-if="$index % smartGrids === 0" text-anchor="middle" :x="$index * hourWidth" y="99.5%">{{ line }}</text>
                            </g>
                        </g>

                        <g class="paths">
                            <path v-for="link in linkPaths | orderBy 'critical'" :d="link.path" :class="{critical: link.critical}" />
                        </g>

                        <g class="blocks" >
                            <g class="block" v-for="block in nodes">
                                <rect @click="select(block)" rx="5" ry="5" :x="block.x" :y='block.y' :width='block.width' :height='block.height' :style="{fill: block.label}">
                                    <title>{{ block.title }}</title>
                                </rect>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import _ from 'underscore'

    export default {
        props: {
            events : {
                type: Array,
                default: () => []
            },
            selected: {
                twoWay: true,
            },
            autoScale: {
                default: false,
            },
            criticalPath: {
                default: true,
            },
        },

        data() {
            return {
                showModal: false,

                search: '',

                xPadding: 5,
                links: [],
                finalBlock: {},
                highestDuration: 0,
                hourWidth: 29.1,

                totalWidth: 873 - 120,

                blockHeight: 50,
                scale: 'days',
                scaleWidth: 29.1,
                events: [],
                groupings: [],
                categories: [],
                category: null,
            }
        },

        computed: {
            limits() {
                const limits = {
                    start: false,
                    end: false,
                    range: 0,
                    units: this.scale,
                    height: this.groupings.length * this.blockHeight + 40,
                }

                this.events.map((event) => {
                    if (limits.start === false || moment(event.start).isBefore(limits.start)) {
                        limits.start = moment(event.start).startOf('week')
                    }

                    if (limits.end === false || moment(event.end).isAfter(limits.end)) {
                        limits.end = moment(event.end).endOf('week')
                    }

                    return event
                })

                limits.range = moment(limits.end).diff(limits.start, this.scale)

                return limits
            },

            nodes() {
                const limits = this.limits
                const filterBy = Vue.filter('filterBy')
                this.groupings = []

                return filterBy(filterBy(this.events, this.category, 'category'), this.search, 'title').map(event => {
                    event.x = (moment(event.start).diff(limits.start, this.scale)) * this.scaleWidth
                    event.width = (moment(event.end).diff(event.start, this.scale)) * this.scaleWidth
                    event.height = this.blockHeight - 15

                    if (this.categories.map(c => { return c.id }).indexOf(event.category) === -1) {
                        this.categories.push({ id: event.category, name: event.category })
                    }

                    if (this.groupings.indexOf(event.title) === -1) {
                        this.groupings.push(event.title)
                    }

                    event.y = (this.groupings.indexOf(event.title) * this.blockHeight) + 7.5
                    return event
                })
            },

            svgWidth() {
                if (this.autoScale) {
                    return '100%'
                }

                return this.hourWidth * this.limits.range + 200
            },

            linkPaths() {
                return this.links.map(link => {
                    const startX = (link[0].start + link[0].duration / 2) * this.hourWidth
                    const startY = (link[0].lane * this.blockHeight) - 7.5
                    const laneTop = (link[1].lane - 1) * this.blockHeight
                    const endX = (link[1].start) * this.hourWidth
                    const endY = (link[1].lane * this.blockHeight) - (this.blockHeight / 2)
                    link.path = `M${startX} ${startY}
                                L ${startX} ${laneTop}
                                a 25 25 0 0 0 25 25
                                L ${endX} ${endY}
                                M ${endX - 10} ${endY - 7}
                                L ${endX} ${endY}
                                L ${endX - 10} ${endY + 7}`
                    link.critical = link[2] ? link[2] : false

                    return link
                })
            },

            smartGrids() {
                if (this.scale === 'hours') {
                    return 24
                }

                return 7
            },

            gridDateFormat() {
                if (this.scale === 'hours') {
                    return 'Do MMM HH:mm'
                }

                return 'Do MMM'
            },

            gridLines() {
                return Array.apply(null, Array(this.limits.range + 2)).map((a, i) => {
                    return moment(this.limits.start).add(i, this.scale).format(this.gridDateFormat)
                })
            },
        },

        created() {
            // this.$set('events', require('../../assets/event_data.json'))

            this.events.map((event, index) => {
                this.events.$set(index, _.extend({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                }, event))
                return event
            })
        },

        filters: {
            truncate(val, length) {
                if (val.length < length) {
                    return val
                }
                return `${val.substring(0, length - 3)}...`
            },
        },

        ready() {
            this.totalWidth = this.$els.svg.getBoundingClientRect().width - 120
        },

        methods: {
            select(block) {
                this.selected = block
                this.$dispatch('select', block)
            },
        },
    }
</script>
