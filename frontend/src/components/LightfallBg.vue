<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 用 Canvas 模拟 Lightfall 风格光效背景（原 Lightfall 为 React 组件，Vue 项目用 canvas 实现）
const props = defineProps({
  colors: { type: Array, default: () => ['#A6C8FF', '#5227FF', '#FF9FFC'] },
  backgroundColor: { type: String, default: '#0A29FF' },
  speed: { type: Number, default: 0.5 },
  streakCount: { type: Number, default: 2 },
  density: { type: Number, default: 0.6 },
  twinkle: { type: Number, default: 1 },
  glow: { type: Number, default: 1 },
  backgroundGlow: { type: Number, default: 0.5 },
  zoom: { type: Number, default: 3 },
  mouseInteraction: { type: Boolean, default: true },
  mouseStrength: { type: Number, default: 0.5 },
  mouseRadius: { type: Number, default: 1 },
})

const canvas = ref(null)
let ctx = null
let raf = 0
let particles = []
let streaks = []
let mouse = { x: -9999, y: -9999 }
let w = 0, h = 0

function rand(a, b) { return a + Math.random() * (b - a) }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function hexToRgb(hex) {
  const s = hex.replace('#', '')
  return {
    r: parseInt(s.substring(0, 2), 16),
    g: parseInt(s.substring(2, 4), 16),
    b: parseInt(s.substring(4, 6), 16),
  }
}
function rgba(hex, a) {
  const c = hexToRgb(hex)
  return `rgba(${c.r},${c.g},${c.b},${a})`
}

function makeStreak() {
  const segs = 5
  const pts = []
  const startX = rand(w * 0.1, w * 0.9)
  for (let i = 0; i <= segs; i++) {
    pts.push({ x: startX + rand(-w * 0.25, w * 0.25), y: (h / segs) * i })
  }
  return pts
}

function init() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  const cv = canvas.value
  cv.width = w * dpr
  cv.height = h * dpr
  cv.style.width = w + 'px'
  cv.style.height = h + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const count = Math.floor(140 * props.density)
  particles = Array.from({ length: count }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.5, 2) * (props.zoom * 0.4),
    vx: rand(-0.25, 0.25) * props.speed,
    vy: rand(-0.25, 0.25) * props.speed,
    color: pick(props.colors),
    phase: rand(0, Math.PI * 2),
    ts: rand(0.008, 0.025),
  }))

  streaks = Array.from({ length: props.streakCount }, (_, i) => ({
    pts: makeStreak(),
    color: props.colors[i % props.colors.length],
    t: rand(0, 1),
    sp: rand(0.0015, 0.003) * props.speed,
  }))
}

function drawStreak(s) {
  const pts = s.pts
  ctx.save()
  ctx.shadowBlur = 18 * props.glow
  ctx.shadowColor = s.color
  ctx.lineWidth = 1.4
  ctx.lineCap = 'round'
  const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[pts.length - 1].x, pts[pts.length - 1].y)
  grad.addColorStop(0, rgba(s.color, 0))
  grad.addColorStop(Math.max(0, s.t - 0.2), rgba(s.color, 0))
  grad.addColorStop(s.t, rgba(s.color, 0.9))
  grad.addColorStop(Math.min(1, s.t + 0.2), rgba(s.color, 0))
  grad.addColorStop(1, rgba(s.color, 0))
  ctx.strokeStyle = grad
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2
    const yc = (pts[i].y + pts[i + 1].y) / 2
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc)
  }
  ctx.stroke()
  ctx.restore()
}

function draw() {
  // 背景辉光
  const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75)
  const bg = hexToRgb(props.backgroundColor)
  const ga = props.backgroundGlow
  g.addColorStop(0, `rgba(${Math.min(255, bg.r + 60 * ga)},${Math.min(255, bg.g + 60 * ga)},${Math.min(255, bg.b + 60 * ga)},1)`)
  g.addColorStop(1, props.backgroundColor)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // 流光
  streaks.forEach((s) => {
    s.t += s.sp
    if (s.t > 1) {
      s.t = 0
      s.pts = makeStreak()
    }
    drawStreak(s)
  })

  // 粒子
  const mr = 130 * props.mouseRadius
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.phase += p.ts
    if (p.x < -10) p.x = w + 10
    if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10

    let alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(p.phase)) * props.twinkle
    alpha = Math.max(0.05, Math.min(1, alpha))

    if (props.mouseInteraction) {
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < mr) {
        const f = (1 - d / mr) * props.mouseStrength
        p.x += (dx / (d || 1)) * f * 2.5
        p.y += (dy / (d || 1)) * f * 2.5
        alpha = Math.min(1, alpha + (1 - d / mr) * 0.6)
      }
    }

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.shadowBlur = 10 * props.glow
    ctx.shadowColor = p.color
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })

  raf = requestAnimationFrame(draw)
}

function onMove(e) { mouse.x = e.clientX; mouse.y = e.clientY }
function onLeave() { mouse.x = -9999; mouse.y = -9999 }
function onResize() { init() }

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  init()
  raf = requestAnimationFrame(draw)
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseout', onLeave)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseout', onLeave)
})
</script>

<template>
  <canvas ref="canvas" class="lightfall-bg"></canvas>
</template>

<style scoped>
.lightfall-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
</style>
