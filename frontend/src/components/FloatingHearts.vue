<script setup>
// 首页背景漂浮的粉色模糊爱心
// 纯 CSS 动画，随机大小/位置/时长，缓慢上浮 + 轻微摇摆 + 明灭
const COUNT = 14

function rand(min, max) {
  return Math.random() * (max - min) + min
}

const hearts = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  left: rand(2, 96),            // 起始水平位置 %
  size: rand(42, 135),         // 爱心大小 px（放大约1.5倍）
  duration: rand(30, 56),      // 上浮一轮时长 s（更慢）
  delay: rand(-50, 0),         // 负延迟让首屏就已分布在各高度
  blur: rand(5, 12),           // 模糊 px（更模糊）
  opacity: rand(0.12, 0.4),    // 最大不透明度
  drift: rand(-40, 40),        // 水平漂移幅度 px
  hue: Math.random() > 0.5 ? '#ff9fc4' : '#ffb8d6', // 两种粉
}))
</script>

<template>
  <div class="hearts-layer" aria-hidden="true">
    <span
      v-for="h in hearts"
      :key="h.id"
      class="heart"
      :style="{
        left: h.left + '%',
        width: h.size + 'px',
        height: h.size + 'px',
        filter: `blur(${h.blur}px)`,
        animationDuration: h.duration + 's',
        animationDelay: h.delay + 's',
        '--peak': h.opacity,
        '--drift': h.drift + 'px',
        '--hue': h.hue,
      }"
    ></span>
  </div>
</template>

<style scoped>
.hearts-layer {
  position: fixed;
  inset: 0;
  z-index: -1;           /* 在光效背景之上、内容之下 */
  pointer-events: none;
  overflow: hidden;
}
.heart {
  position: absolute;
  bottom: -12vh;
  opacity: 0;
  transform: translateY(0) rotate(-45deg);
  background: var(--hue);
  animation-name: heart-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}
/* 用两个伪元素拼出爱心的两瓣 */
.heart::before,
.heart::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--hue);
  border-radius: 50%;
}
.heart::before {
  top: -50%;
  left: 0;
}
.heart::after {
  left: 50%;
  top: 0;
}
@keyframes heart-rise {
  0% {
    transform: translateY(0) translateX(0) rotate(-45deg) scale(0.9);
    opacity: 0;
  }
  12% {
    opacity: var(--peak);
  }
  50% {
    transform: translateY(-60vh) translateX(var(--drift)) rotate(-45deg) scale(1.05);
  }
  88% {
    opacity: var(--peak);
  }
  100% {
    transform: translateY(-120vh) translateX(0) rotate(-45deg) scale(0.85);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .heart {
    animation: none;
    opacity: 0;
  }
}
</style>
