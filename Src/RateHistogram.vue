<style scoped>
    div {
        position: relative;
        width: 100%;
    }
    svg {
        margin-top: -3px;
        margin-bottom: -15px;
        max-height: 55px;
        width: 100%;
        padding-left: 7.5px;
        padding-right: 7.5px;
    }
    rect {
        fill: rgba(33, 133, 208, 0.15);
        stroke: #fff;
        stroke-width: 1px;
        cursor: pointer;
    }
    rect:hover {
        fill: rgba(33, 133, 208, 0.4);
    }
</style>

<template>
    <div v-el:container>
        <svg>
            <line v-for="rect in rects" v-if="rect.x != '0%'" :x1="rect.x" :x2="rect.x" y1="0" y2="4" style="stroke: rgba(100, 100, 100, 1); stroke-width: 1;"></line>
            <text v-for="rect in rects" v-if="rect.x != '0%'" text-anchor="middle" :x="rect.x" y="12" font-size="8.5">{{ rect.rate }}</text>
            <g transform="scale(1 -1) translate(0 -55)">
                <rect v-for="rect in rects" :x="rect.x" y="0%" :width="rect.width" :height="rect.height" @click="rate = rect.rate + 10">
                    <title>{{ rect.title }}</title>
                </rect>
            </g>
        </svg>
    </div>
</template>

<script>
    export default {
        props: {
            sparks: {},
            rate: {},
        },

        computed: {
            rects() {
                if (!this.sparks.length) {
                    return []
                }
                const width = 100 / this.sparks.length
                let largest = 0
                this.sparks.map(spark => {
                    largest = Math.sqrt(spark.doc_count) > largest ? Math.sqrt(spark.doc_count) : largest
                    return spark
                })

                return this.sparks.map((spark, index) => {
                    return {
                        rate: spark.key,
                        width: `${width}%`,
                        height: (40 / largest) * Math.sqrt(spark.doc_count),
                        x: `${index * width}%`,
                        title: `${spark.doc_count} croudies`
                    }
                })
            },
        },

    }
</script>
