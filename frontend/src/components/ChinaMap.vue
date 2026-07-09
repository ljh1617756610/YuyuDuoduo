<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import chinaGeo from 'china-geojson'
import { cities } from '../data/cities.js'

// focus：传入某城市坐标时，地图放大并居中到该城市（用于城市专属页面）
// compact：城市页使用更小高度
const props = defineProps({
  focus: { type: Array, default: null },
  compact: { type: Boolean, default: false },
})
const el = ref(null)
const router = useRouter()
let chart = null

// 三个城市之间的“恋爱轨迹”飞线（已删除 丽江↔广州 一段）
const bySlug = (s) => cities.find((c) => c.slug === s)
const lines = [
  { coords: [bySlug('shanghai').coord, bySlug('guangzhou').coord] }, // 上海 → 广州
  { coords: [bySlug('lijiang').coord, bySlug('shanghai').coord] }, // 丽江 → 上海
]

function buildOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(28,24,20,0.94)',
      borderColor: 'rgba(232,201,142,0.6)',
      borderWidth: 1,
      padding: [16, 20],
      textStyle: { color: '#f3e6c8', fontSize: 13 },
      formatter: (p) => {
        if (p.seriesType === 'effectScatter') {
          const m = cities.find((x) => x.name === p.name)
          // 北京：地图 hover 只显示城市名，不显示浪漫介绍
          if (m.noIntro) {
            return `<div style="font-size:15px;font-weight:700;color:#ffe9b0;">${m.name}</div>`
          }
          return `<div style="font-size:15px;font-weight:700;color:#ffe9b0;margin-bottom:8px;">${m.name} · ${m.en}</div><div style="max-width:300px;line-height:1.7;color:#f3e6c8;"><div style="margin-bottom:4px;">${m.noteCn}</div><div style="color:#e8c98e;font-style:italic;">${m.noteEn}</div></div>`
        }
        return p.name || ''
      },
    },
    geo: {
      map: 'china',
      roam: true, // 允许鼠标滚轮缩放 + 拖拽移动
      zoom: props.focus ? 5 : 1.28, // 约 1.39 的 0.92 倍；城市页进一步放大
      center: props.focus || undefined,
      layoutCenter: ['50%', '52%'],
      layoutSize: '100%',
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.85,
          colorStops: [
            { offset: 0, color: 'rgba(212,175,110,0.20)' },
            { offset: 1, color: 'rgba(120,90,50,0.05)' },
          ],
        },
        borderColor: 'rgba(232,201,142,0.92)',
        borderWidth: 1.2,
        shadowColor: 'rgba(232,201,142,0.5)',
        shadowBlur: 30,
      },
      emphasis: {
        itemStyle: { areaColor: 'rgba(232,201,142,0.35)' },
        label: { show: false },
      },
    },
    series: [
      // 恋爱轨迹飞线（动画）
      {
        name: '我们的轨迹',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.35,
          symbol: 'arrow',
          symbolSize: 6,
          color: 'rgba(255,225,160,0.95)',
        },
        lineStyle: {
          color: 'rgba(232,201,142,0.5)',
          width: 1.2,
          opacity: 0.6,
          curveness: 0.3,
        },
        data: lines,
      },
      // 三个城市回忆坐标（涟漪 + 可点击跳转 + hover 高亮）
      {
        name: '回忆坐标',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: cities
          .filter((m) => !m.noMap)
          .map((m) => ({
            name: m.name,
            value: [...m.coord, 1],
          })),
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 3.4, period: 4 },
        itemStyle: {
          color: '#ffe9b0',
          shadowColor: 'rgba(255,225,160,0.9)',
          shadowBlur: 14,
        },
        label: {
          show: false,
          position: 'right',
          formatter: (p) => p.name,
          color: '#ffe9b0',
          fontSize: 14,
          fontWeight: 700,
          textShadowColor: 'rgba(0,0,0,0.6)',
          textShadowBlur: 6,
        },
        emphasis: {
          scale: 2.6,
          label: { show: true },
        },
        zlevel: 2,
      },
    ],
  }
}

function render() {
  echarts.registerMap('china', chinaGeo.China)
  chart = echarts.init(el.value, null, { renderer: 'canvas' })
  chart.setOption(buildOption())
  // 点击城市点 → 跳转该城市专属页面
  chart.on('click', (p) => {
    if (p.seriesType === 'effectScatter') {
      const c = cities.find((x) => x.name === p.name)
      if (c) router.push('/city/' + c.slug)
    }
  })
}

function resize() {
  if (chart) chart.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', resize)
})

// 城市页之间切换时，重新定位地图
watch(
  () => props.focus,
  () => {
    if (chart) chart.setOption(buildOption())
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (chart) chart.dispose()
})
</script>

<template>
  <div class="map-wrap" :class="{ compact }">
    <div class="map-glow"></div>
    <div ref="el" class="map-canvas"></div>
  </div>
</template>

<style scoped>
.map-wrap {
  position: relative;
  width: 125%;
  margin-left: -12.5%;
  height: 92vh;
  min-height: 640px;
}
.map-wrap.compact {
  height: 40vh;
  min-height: 320px;
}
.map-glow {
  position: absolute;
  inset: 6% 10%;
  background: radial-gradient(
    ellipse at center,
    rgba(232, 201, 142, 0.22),
    transparent 70%
  );
  filter: blur(46px);
  z-index: 0;
  pointer-events: none;
}
.map-canvas {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* 窄屏恢复满宽，避免横向溢出 */
@media (max-width: 720px) {
  .map-wrap {
    width: 100%;
    margin-left: 0;
  }
}
</style>
