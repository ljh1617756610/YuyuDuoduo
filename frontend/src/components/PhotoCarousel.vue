<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 该地点 / 城市的照片数组：[{ src, caption }]
  photos: { type: Array, default: () => [] },
  // 用于 alt 与无障碍标签的称呼
  name: { type: String, default: '' },
  // 主体 / 模糊层的宽高比，如 '3 / 4'（竖版）或 '4 / 3'（横向）；仅影响比例
  ratio: { type: String, default: '3 / 4' },
  // 照片框角贴纸标识，如 'shu' = 上海大学徽章
  badge: { type: String, default: '' },
})

const PLACEHOLDER_COUNT = 6
// 有照片用真实照片，暂无则展示占位框（格式先搭好，待用户提供照片）
const wall = computed(() => {
  if (props.photos && props.photos.length) return props.photos
  return Array.from({ length: PLACEHOLDER_COUNT }, () => ({ src: '', caption: '' }))
})

// 轮播：一次看一张，自动滚动，两侧箭头切换，竖版 3:4
const current = ref(0)
const dir = ref('next') // 切换方向，用于决定进出场动画方向
const paused = ref(false)
const AUTOPLAY = 0 // 0 = 关闭自动播放；改成毫秒数（如 4500）即可恢复自动轮播
let timer = null

const total = computed(() => wall.value.length)
const cur = computed(() => wall.value[current.value] || wall.value[0])
// 左右两侧的「前一张 / 后一张」（模糊层次背景）
const prevIndex = computed(() => (current.value - 1 + total.value) % total.value)
const nextIndex = computed(() => (current.value + 1) % total.value)
const prevItem = computed(() => wall.value[prevIndex.value])
const nextItem = computed(() => wall.value[nextIndex.value])

function go(n, direction) {
  const len = total.value
  const target = ((n % len) + len) % len
  if (target === current.value) return
  dir.value = direction || (target > current.value ? 'next' : 'prev')
  current.value = target
}
const next = () => go(current.value + 1, 'next')
const prev = () => go(current.value - 1, 'prev')

function start() {
  stop()
  if (AUTOPLAY > 0) {
    timer = setInterval(() => {
      if (!paused.value) next()
    }, AUTOPLAY)
  }
}
function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <div class="carousel" @mouseenter="paused = true" @mouseleave="paused = false">
    <!-- 左侧：前一张（模糊层次背景）-->
    <div
      v-if="total > 1"
      class="peek peek-prev"
      @click="prev"
      role="button"
      aria-label="上一张"
    >
      <Transition name="peek">
        <img
          v-if="prevItem.src"
          :key="prevIndex"
          :src="prevItem.src"
          :alt="prevItem.caption || name"
          class="peek-img"
        />
        <div v-else class="peek-placeholder"><span class="ph-heart">❤</span></div>
      </Transition>
    </div>

    <button class="arrow prev" type="button" @click="prev" aria-label="上一张">
      <span class="arrow-glyph">‹</span>
    </button>

    <!-- 主体：当前清晰照片 -->
    <div class="slide-wrap">
      <!-- 上海大学特色徽章贴纸：斜贴照片框右上角 -->
      <div v-if="badge === 'shu'" class="photo-badge" aria-hidden="true">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47" fill="#a8121f" stroke="#e8c98e" stroke-width="3" />
          <circle cx="50" cy="50" r="39" fill="none" stroke="#e8c98e" stroke-width="1" />
          <text x="50" y="45" text-anchor="middle" font-size="20" font-weight="700" letter-spacing="1" fill="#fff4d6" font-family="serif">SHU</text>
          <text x="50" y="61" text-anchor="middle" font-size="7.5" letter-spacing="1.2" fill="#e8c98e" font-family="serif">SHANGHAI</text>
          <text x="50" y="73" text-anchor="middle" font-size="7" fill="#e8c98e" font-family="serif">1922</text>
        </svg>
      </div>
      <div class="slide">
        <Transition :name="'photo-' + dir">
          <img
            v-if="cur.src"
            :key="current"
            :src="cur.src"
            :alt="cur.caption || name"
            class="slide-img"
          />
          <div v-else class="slide-placeholder">
            <span class="ph-heart">❤</span>
            <span class="ph-text">照片待添加</span>
          </div>
        </Transition>
        <figcaption v-if="cur.caption" class="slide-cap">{{ cur.caption }}</figcaption>
      </div>
    </div>

    <button class="arrow next" type="button" @click="next" aria-label="下一张">
      <span class="arrow-glyph">›</span>
    </button>

    <!-- 右侧：后一张（模糊层次背景）-->
    <div
      v-if="total > 1"
      class="peek peek-next"
      @click="next"
      role="button"
      aria-label="下一张"
    >
      <Transition name="peek">
        <img
          v-if="nextItem.src"
          :key="nextIndex"
          :src="nextItem.src"
          :alt="nextItem.caption || name"
          class="peek-img"
        />
        <div v-else class="peek-placeholder"><span class="ph-heart">❤</span></div>
      </Transition>
    </div>
  </div>

  <div class="dots">
    <button
      v-for="(p, i) in wall"
      :key="i"
      type="button"
      class="dot"
      :class="{ active: i === current }"
      :aria-label="'第 ' + (i + 1) + ' 张'"
      @click="go(i)"
    ></button>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 30px auto 0;
}
.slide {
  position: relative;
  z-index: 3;
  aspect-ratio: v-bind(ratio);
  height: min(84vh, 744px);
  max-height: 744px;
  /* 横向 4:3 时高度上限降低，避免过宽；宽度据此自动计算 */
  max-width: v-bind(ratio == '4 / 3' ? '82vw' : '108vw');
  border: 1px solid rgba(232, 201, 142, 0.4);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(20, 16, 12, 0.5);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5),
    inset 0 0 40px rgba(232, 201, 142, 0.06);
  /* 景深透视：让切换时的 rotateY / scale 呈现 3D 纵深 */
  perspective: 1400px;
  perspective-origin: center center;
}
.slide-img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  backface-visibility: hidden;
}
.slide-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(212, 175, 110, 0.16),
    rgba(120, 90, 50, 0.05) 70%
  );
}
.ph-heart {
  font-size: 34px;
  color: #ff9bb0;
  text-shadow: 0 0 18px rgba(255, 155, 176, 0.6);
}
.ph-text {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: rgba(232, 201, 142, 0.75);
}
.slide-cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 46px 22px 18px;
  font-size: 15px;
  letter-spacing: 0.05em;
  color: #fff4d6;
  text-align: center;
  background: linear-gradient(180deg, transparent, rgba(10, 8, 6, 0.82));
}

/* ===== 左右模糊层次（前一张 / 后一张）===== */
.peek {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(0.9);
  width: clamp(130px, 20vw, 240px);
  aspect-ratio: v-bind(ratio);
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(232, 201, 142, 0.2);
  background: rgba(20, 16, 12, 0.5);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.45);
  filter: blur(7px) brightness(0.68);
  opacity: 0.42;
  z-index: 1;
  cursor: pointer;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.peek:hover {
  opacity: 0.85;
  filter: blur(1.5px) brightness(0.95);
  transform: translateY(-50%) scale(1.02);
}
.peek-prev {
  right: 100%;
  margin-right: -6%;
}
.peek-next {
  left: 100%;
  margin-left: -6%;
}
.peek-img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.peek-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(212, 175, 110, 0.16),
    rgba(120, 90, 50, 0.05) 70%
  );
}

/* ===== 切换照片的丝滑动画（带方向感的滑动 + 缩放 + 景深模糊）===== */
/* 进/出同时进行的 crossfade，用 ease-out expo 曲线极顺滑；进场从远处带模糊「浮近」，
   出场向反方向「退远」并模糊，营造景深纵深感。 */
.photo-next-enter-active,
.photo-next-leave-active,
.photo-prev-enter-active,
.photo-prev-leave-active {
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity, filter;
}
/* 下一张：新图从右侧远处浮近，旧图向左退远 */
.photo-next-enter-from {
  opacity: 0;
  transform: translateX(9%) scale(1.12) rotateY(-6deg);
  filter: blur(12px);
}
.photo-next-leave-to {
  opacity: 0;
  transform: translateX(-7%) scale(0.9) rotateY(5deg);
  filter: blur(9px);
}
/* 上一张：新图从左侧远处浮近，旧图向右退远 */
.photo-prev-enter-from {
  opacity: 0;
  transform: translateX(-9%) scale(1.12) rotateY(6deg);
  filter: blur(12px);
}
.photo-prev-leave-to {
  opacity: 0;
  transform: translateX(7%) scale(0.9) rotateY(-5deg);
  filter: blur(9px);
}

.peek-enter-active,
.peek-leave-active {
  transition: opacity 0.6s ease, filter 0.6s ease;
}
.peek-enter-from,
.peek-leave-to {
  opacity: 0;
  filter: blur(12px);
}

/* ===== 左右箭头（主题金 + 发光）===== */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
  width: 52px;
  height: 52px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(232, 201, 142, 0.6);
  border-radius: 50%;
  background: rgba(18, 14, 10, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease,
    box-shadow 0.25s ease, border-color 0.25s ease;
}
.arrow.prev {
  left: -18px;
}
.arrow.next {
  right: -18px;
}
.arrow:hover {
  background: rgba(232, 201, 142, 0.18);
  border-color: rgba(232, 201, 142, 0.95);
  box-shadow: 0 0 22px rgba(232, 201, 142, 0.5);
  transform: translateY(-50%) scale(1.1);
}
.arrow-glyph {
  font-size: 30px;
  line-height: 1;
  font-weight: 300;
  background: linear-gradient(120deg, #fff4d6, #e8c98e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ===== 圆点指示器 ===== */
.dots {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
.dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 1px solid rgba(232, 201, 142, 0.55);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}
.dot:hover {
  border-color: rgba(232, 201, 142, 0.95);
}
.dot.active {
  background: linear-gradient(120deg, #fff4d6, #e8c98e);
  border-color: transparent;
  box-shadow: 0 0 12px rgba(232, 201, 142, 0.6);
}

/* 窄屏不显示两侧模糊层次，避免横向溢出 */
@media (max-width: 720px) {
  .peek {
    display: none;
  }
}

/* 无障碍：减少动态偏好时关闭夸张位移/旋转，仅保留淡入 */
@media (prefers-reduced-motion: reduce) {
  .photo-next-enter-active,
  .photo-next-leave-active,
  .photo-prev-enter-active,
  .photo-prev-leave-active {
    transition: opacity 0.4s ease;
  }
  .photo-next-enter-from,
  .photo-prev-enter-from,
  .photo-next-leave-to,
  .photo-prev-leave-to {
    transform: none;
    filter: none;
  }
}

/* ===== 照片框角徽章贴纸（如上海大学）===== */
.slide-wrap {
  position: relative;
  z-index: 3;
}
.photo-badge {
  position: absolute;
  top: -16px;
  right: -16px;
  z-index: 5;
  width: 58px;
  height: 58px;
  transform: rotate(-15deg);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.55));
  pointer-events: none;
  animation: badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}
.photo-badge svg {
  display: block;
  width: 100%;
  height: 100%;
}
@keyframes badge-pop {
  from {
    opacity: 0;
    transform: rotate(-15deg) scale(0.3);
  }
  to {
    opacity: 1;
    transform: rotate(-15deg) scale(1);
  }
}
</style>
