<style scoped>

    .rows rect {
        fill: #fff;
    }
    .rows rect:nth-child(even) {
        fill: #f5f5f5;
    }

    #daily-pointer {
        stroke: #FFD156;
        stroke-width: 10;
    }

    #timeline-events .rows rect:hover {
        fill: rgba(255, 209, 86, 0.4)
    }

    .blocks rect {
        fill: #c6dafc;
        transition: all 400ms;
        /*filter: url(#dropshadow);*/
    }
    .block:hover {
        stroke: #ddd;
        stroke-width: 5px;
        cursor: pointer;
    }

    #timeline-container {
        /*height:500px;
        width:400px;*/
    }

    #timeline {
        height:300px;
        width:400px;
        display: block;
        overflow: auto;
    }

    #timeline-header {
        margin-left:300px;
        overflow:hidden;
        border-bottom: 1px solid rgba(76, 76, 76, 0.4);
    }

    #event-types {
        width: 300px;
        flex: 0 0 auto;
    }

    #timeline-content {
        flex: 1 1 auto;
        overflow:auto;
    }
    #timeline-events {
        overflow: auto;
    }

    #timeline-index {
        height:30px;
    }

    text {
        font-weight:normal;
    }

    #timeline-search-header .ui.selection.dropdown {
        width: 300px
    }

    #timeline-sidebar {
        position:absolute;
        padding-top:30px;
        overflow: hidden;
        border-right: 5px solid rgba(200, 200, 200, 1);
    }

</style>

<template>
    <div v-el:container>
        <div id="timeline-search-header" class="ui basic segment secondary">
            <div class="ui grid two columns">
                <div class="column">
                    <div class="ui icon input">
                        <i v-if="search" placeholder="search.." @click="search=''" class="red close link icon"></i>
                        <i v-else class="search link icon"></i>
                        <input v-model="search" />
                    </div>
                </div>
                <div class="column right aligned">
                    <div class="ui input">
                        <semantic-form-dropdown :options="categoryOptions" :model.sync="category"></semantic-form-dropdown>
                    </div>
                </div>
            </div>
         </div>

         <div id="timeline-sidebar">
             <svg id="event-types" v-el:svg :width="300" :height='limits.height'>
                 <g class="rows" transform="translate(0, 0)">
                     <rect v-for="block in groupings" x:"0" :y="blockHeight * $index" width="100%" :height="blockHeight" stroke="#f5f5f5" stroke-width="2"></rect>
                 </g>
                 <g v-for="block in groupings" transform="translate(0, 0)">
                     <title>{{ block }}</title>
                     <text @click="select(block)" text-anchor="right" :x="5" :y="($index * blockHeight) + 5 +(blockHeight / 2)">{{ block | truncate 35 }}</text>
                 </g>
             </svg>
        </div>

         <div id="timeline-header">
             <div id="timeline-index">
                 <svg id="" :width="svgWidth" height="30">

                     <g transform="translate(40, 0)">
                         <g>
                             <g v-for="line in gridLines">
                                 <line :x1='$index * scaleWidth' y1='95%' :x2='$index * scaleWidth' y2='100%' style='stroke: rgba(234, 243, 234, 0.5); stroke-width: 1;'></line>
                                 <line v-if="$index % smartGrids === 0" :x1='$index * scaleWidth' y1='65%' :x2='$index * scaleWidth' y2='99%' style='stroke: rgba(230, 230, 230, 0.7); stroke-width: 5;'></line>
                                 <text v-if="$index % smartGrids === 0" text-anchor="middle" :x="$index * hourWidth" y="50%">{{ line }}</text>
                             </g>
                         </g>
                 </svg>
            </div>
        </div>
        <div id="timeline-container">
            <div id="timeline">
                <svg id="timeline-events" v-el:svg :width="svgWidth" :height='limits.height'>
                    <g>
                        <g class="rows">
                            <rect v-for="block in groupings" x:"0" :y="blockHeight * $index" width="100%" :height="blockHeight" stroke="#f5f5f5" stroke-width="2"></rect>
                        </g>
                        <g class="graph" transform="translate(40, 0)">
                            <line id="daily-pointer" :x1='dailyWidth' :x2="dailyWidth" y1='0%' y2='100%'></line>
                            <g>
                                <g v-for="line in gridLines">
                                    <line :x1='$index * scaleWidth' y1='0%' :x2='$index * scaleWidth' y2='100%' style='stroke: rgba(200, 200, 200, 0.3); stroke-width: 1;'></line>
                                    <line v-if="$index % smartGrids === 0" :x1='$index * scaleWidth' y1='0%' :x2='$index * scaleWidth' y2='100%' style='stroke: rgba(230, 230, 230, 0.7); stroke-width: 5;'></line>
                                    <!-- <text v-if="$index % smartGrids === 0" text-anchor="middle" :x="$index * hourWidth" y="99.5%">{{ line }}</text> -->
                                </g>
                            </g>

                            <g class="paths">
                                <path v-for="link in linkPaths | orderBy 'critical'" :d="link.path" :class="{critical: link.critical}" />
                            </g>

                            <g class="blocks" >
                                <g class="block" v-for="block in nodes">
                                    <rect @click="select(block)" rx="3" ry="3" :x="block.x" :y='block.y' :width='block.width' :height='block.height' :style="{fill: block.label}">
                                        <title>{{ block.title }}</title>
                                    </rect>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
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
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
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
                blockHeight: 45,
                scale: 'days',
                scaleWidth: 29.1,
                groupings: [],
                categories: [],
                categoryWidth : 300,
                category: null,
            }
        },

        computed: {
            categoryOptions() {
                let categories = this.categories.map((category)=>{
                    return {
                        id : category.name,
                        name : category.name,
                    }

                }).filter((category)=>{
                    return category.name !== null && category.name !== ''
                })

                categories.unshift({
                    id : '',
                    name : 'View All Events'
                })

                return categories
            },

            limits() {
                const limits = {
                    start: false,
                    end: false,
                    range: 0,
                    units: this.scale,
                    height: (this.groupings && this.blockHeight) ? this.groupings.length * this.blockHeight : 0,
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

                limits.current = moment().diff(limits.start, this.scale)
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

            dailyWidth() {

                if (!this.hourWidth || !this.limits.current) return 0

                return this.hourWidth * this.limits.current
            },

            svgWidth() {
                if (this.autoScale) {
                    return '100%'
                }

                if (!this.hourWidth || !this.limits.range) return 0

                return this.hourWidth * this.limits.range + 130
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
                if (!this.limits || !this.limits.range) return null
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

            let left,
                top,
                height,
                target,
                obj = $('#timeline'),
                $window = $(window),
                container = $('#adpcalendar'),
                sidebar = $('#timeline-sidebar'),
                events = document.getElementById('event-types'),
                heading = document.getElementById('timeline-index'),

                resize = () =>
                {
                    height = ($window.height() - (this.top + this.bottom)),
                    obj.width(($window.width() - (this.left + this.right)) - this.categoryWidth);
                    obj.css({'margin-left': this.categoryWidth, 'height' : height})
                    sidebar.height(height);
                },
                scroll = () =>
                {
                    heading.style['margin-left'] = '-' + obj.scrollLeft() + 'px'
                    events.style['margin-top'] = '-' + obj.scrollTop() + 'px'
                }

                resize()
                scroll()

                obj.scrollLeft(this.dailyWidth - ((obj.width() / 2) - (this.hourWidth * 2)))

                $window.on('resize', resize)
                obj.on('scroll', scroll)
        },

        methods: {
            select(block) {
                this.selected = block
                this.$dispatch('select', block)
            },
        },
    }
</script>
