<template>
  <svg class="radar-chart" :width=500 :height="height">
    <g :transform="`translate(${padding}, ${padding})`">
      <g :transform="`translate(0, ${descriptionHeight})`">
        <text class="dimension-label" v-for="(label, i) in dimensions" :transform="`translate(${(radarRaidus + textRasius * Math.sin(angles[i]) - padding/2).toFixed()}, ${(radarRaidus - textRasius * Math.cos(angles[i]) + padding/6).toFixed()})`" @click="onClickDimensionLabel(i)">{{label}}</text>
        <polygon v-for="(n, i) in nets" :points="n" :style="{fill: 'none', stroke: 'gray'}"></polygon>
        <line v-for="(p, i) in mostOutsizePolygon" :x1="p.x" :y1="p.y" :x2="radarRaidus" :y2="radarRaidus" :style="{stroke: 'gray'}"></line>
        <text v-for="(v, i) in netValues" :transform="`translate(${radarRaidus + 4}, ${radarRaidus * (450-v)/450})`">{{v}}</text>
      </g>
      <g class="group" v-for="item in dataPolygons" @click="onClickGroup(item.index)" v-on:mouseover="onGroupHover(item.index)">
        <g class="label" :transform="`translate(${90*item.index}, 0)`">
          <rect :x="-60" :y="-25" :width="20" :height="8" :fill="dataset[item.index].color"></rect>
          <text :x="-38" :y="-17" fill="#000">{{dataset[item.index].label}}</text>
        </g>
        <g :transform="`translate(0, ${descriptionHeight})`">
          <polygon class="data-polygon" :points="item.d" :style="{fill: dataset[item.index].color, stroke: dataset[item.index].color}"></polygon>
        </g>
      </g>
    </g>
  </svg>

</template>

<script>

  import _cloneDeep from 'lodash/cloneDeep'

  const padding = 70
  const descriptionHeight = 0

  export default {
    name: 'radar-chart',

		components: {
		},

    props: {
      dataset: {
        type: Array,
        required: true
      },
      dimensions: {
        type: Array,
        required: true
      },
      width: { // chart width
        type: Number,
        required: true
      },
    },

    data () {
      return {
        padding,
        descriptionHeight,
        netValues: [450, 360, 270, 180, 90],
        focusIndex: 0,
        ACT_CLICK: 1,
        ACT_CLICK_DIMENSION_LABEL: 2
      }
    },

		watch: {
    },

    computed: {
      height () {
        return this.width + descriptionHeight
      },
      dataViewHeight () {
        return this.height - 2*this.padding
      },
      dataViewWidth () {
        return this.width - 2*this.padding
      },
      radarRaidus () {
        return this.dataViewWidth/2
      },
      textRasius () {
        return this.radarRaidus + this.padding/2
      },
      // return each layer's data of nets to svg polygon
      nets () {
        return this.netValues.map(v => {
          return this.dimensions.map((label, i) => {
            const point = this.valueToPoint(v, i)
            return point.x + ',' + point.y
          }).join(' ')
        })
      },
      // outer layers index
      mostOutsizePolygon () {
        return this.dimensions.map((_, i) => {
          return this.valueToPoint(450, i)
        })
      },

      dataPolygons () {

        const ds = _cloneDeep(this.dataset).map((d, i) => {
          d.index = i
          return d
        })
        const focusItem = ds[this.focusIndex]
        ds.splice(this.focusIndex, 1)
        ds.push(focusItem)

        // construct Polygons
        return ds.map(item => {
          const d = item.d.map((v, i) => {
            const point = this.valueToPoint(v, i)
            return point.x + ',' + point.y
          }).join(' ')
          return {
            index: item.index,
            d
          }
        })
      },
      angles () {
        var total = this.dimensions.length
        return this.dimensions.map((_, i) => Math.PI * 2 / total * i)
      }
    },

    mounted() {
    },

    methods: {
      valueToPoint (value, index) {
        var total = this.dimensions.length
        var r = this.radarRaidus
        var x     = 0
        var y     = -r*value/450
        var angle = Math.PI * 2 / total * index
        var cos   = Math.cos(angle)
        var sin   = Math.sin(angle)
        var tx    = x * cos - y * sin + r
        var ty    = x * sin + y * cos + r
        return {
          x: tx.toFixed(2),
          y: ty.toFixed(2)
        }
      },
      onClickGroup (i) {
        this.$emit('action', {
          origin: this,
          act: this.ACT_CLICK,
          payload: i
        })
      },
      onClickDimensionLabel (i) {
        this.$emit('action', {
          origin: this,
          act: this.ACT_CLICK_DIMENSION_LABEL,
          payload: i
        })
      },
      onGroupHover (i) {
        this.focusIndex = i
      }
    },
  }
</script>

<style>
  .label{
    opacity: 1;
  }
  .dimension-label {
    font-size: 12px;
    opacity: 1;
  }
  .polygon{
    stroke-width: 2;
    fill-opacity: 0.2;
  }
  .data-polygon {
    stroke-width: 2;
    fill-opacity: 0.2;
  }
  .data-polygon:hover {
    fill-opacity: 1;
  }
  .label:hover {
    opacity: 0.5;
  }
  .dimension-label:hover {
    opacity: 0.5;
  }
</style>
