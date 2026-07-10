<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import AudioPlayer from './components/AudioPlayer.vue'

// 水蓝蓝贴纸图片（public 目录，构建后位于 /static/shuilanlan.jpg）
import shuilanlanImg from './assets/shuilanlan.png'

// 路由变化时让标题区重新挂载，从而重播出场动画（返回首页也会重播）
const route = useRoute()

// 彩蛋：点击「昱昱」弹出多多最爱照片
const EGG_PHOTOS = [
  '/static/easter-egg/egg-01.jpg',
  '/static/easter-egg/egg-02.jpg',
  '/static/easter-egg/egg-03.jpg',
  '/static/easter-egg/egg-04.jpg',
  '/static/easter-egg/egg-05.jpg',
  '/static/easter-egg/egg-06.jpg',
]

const showEgg = ref(false)
const eggSrc = ref('')
let eggTimer = null
const clickCount = ref(0)
const showTease = ref(false)
let teaseTimer = null

function triggerEgg() {
  if (eggTimer) clearTimeout(eggTimer)
  // 随机选一张
  eggSrc.value = EGG_PHOTOS[Math.floor(Math.random() * EGG_PHOTOS.length)]
  showEgg.value = true
  // 2秒后消失
  eggTimer = setTimeout(() => {
    showEgg.value = false
  }, 2000)

  // 连续点击计数：满 15 次弹出俏皮提示
  clickCount.value += 1
  if (clickCount.value >= 15) {
    clickCount.value = 0
    if (teaseTimer) clearTimeout(teaseTimer)
    showTease.value = true
    teaseTimer = setTimeout(() => {
      showTease.value = false
    }, 2800)
  }
}
</script>

<template>
  <div class="site">
    <header class="hero" :key="route.path">
      <p class="eyebrow">OUR LOVE STORY · 恋爱回忆录</p>
      <h1 class="title">
        <!-- 水蓝蓝：标题左侧贴纸，点击跳转到洛克王国主题页 -->
        <RouterLink
          to="/city/luoke"
          class="shuilanlan"
        >
          <span class="lan-inner">
            <img :src="shuilanlanImg" alt="" draggable="false" />
          </span>
          <span class="lan-tip">梦开始的地方</span>
        </RouterLink>
        <span class="name">昱昱</span>
        <span class="amp">&amp;</span>
        <span class="name">多多</span>
      </h1>
      <p class="subtitle">走过中国的每一寸山河，收藏我们的每一次心动</p>
      <div class="divider"><span></span><i class="heart">❤</i><span></span></div>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <!-- 彩蛋：悬停显示调皮提示，点击弹出随机照片 -->
      <span class="easter-trigger" @click="triggerEgg">
        昱昱
        <span class="egg-tip">多多最爱的昱昱（别打我）<i class="tip-heart">💗</i></span>
      </span> &amp; 多多 · FROM THE DAY WE MET · TO LOVE WITHOUT END
    </footer>

    <!-- 彩蛋弹出的照片 + 连点 15 次的俏皮提示 -->
    <div class="egg-stage">
      <Transition name="tease">
        <div v-if="showTease" class="egg-tease">别点了~我想你了！</div>
      </Transition>
      <Transition name="egg-slide">
        <div v-if="showEgg" class="egg-popup">
          <img :src="eggSrc" alt="" />
        </div>
      </Transition>
    </div>

    <AudioPlayer />
  </div>
</template>

<style scoped>
.site {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
  padding: 70px 56px 48px;
  text-align: center;
}
.hero {
  margin-bottom: 30px;
}
.eyebrow {
  font-family: "Cormorant Garamond", Georgia, "Songti SC", "Times New Roman",
    serif;
  letter-spacing: 0.38em;
  font-size: 15px;
  font-weight: 600;
  color: rgba(232, 201, 142, 0.9);
  text-transform: uppercase;
  margin-bottom: 18px;
}
.title {
  position: relative;
  font-size: clamp(48px, 9vw, 104px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 0.04em;
  background: linear-gradient(120deg, #f6e7c1 0%, #e8c98e 40%, #fff4d6 70%, #d9b877 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 30px rgba(232, 201, 142, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.title .amp {
  margin: 0 0.22em;
  font-weight: 400;
  font-style: italic;
  background: linear-gradient(120deg, #ffd9e0, #e8c98e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ===== 水蓝蓝贴纸（标题左侧，绝对定位不干扰文字居中）===== */
.shuilanlan {
  display: inline-flex;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(90px, 12vw, 150px);
  height: auto;
  cursor: pointer;
  text-decoration: none !important;
}
/* 旋转与浮动放在内层，气泡外层保持端正不歪 */
.lan-inner {
  display: block;
  width: 100%;
  transform: rotate(-18deg);
  animation: lan-float 4s ease-in-out infinite;
}
.lan-inner img {
  width: 100%;
  height: auto;
  border-radius: 40% 38% 42% 36%;
  transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;
  /* 贴纸感：轻微投影 + 柔光 */
  box-shadow:
    2px 6px 16px rgba(100, 180, 255, 0.25),
    inset 0 0 12px rgba(255, 255, 255, 0.15);
  filter: drop-shadow(0 3px 8px rgba(80, 160, 240, 0.3));
}
.shuilanlan:hover .lan-inner img {
  transform: scale(1.15) rotate(8deg);
  filter: drop-shadow(0 5px 14px rgba(100, 190, 255, 0.55));
  box-shadow:
    4px 10px 24px rgba(100, 180, 255, 0.4),
    inset 0 0 16px rgba(255, 255, 255, 0.22);
}
/* 轻柔浮动动画 */
@keyframes lan-float {
  0%, 100% { transform: rotate(-18deg) translateY(-4px); }
  50% { transform: rotate(-15deg) translateY(-10px); }
}

/* ===== 悬停气泡：轻奢金主题 ===== */
.lan-tip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) scale(0.7);
  transform-origin: bottom center;
  white-space: nowrap;
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "宋体", serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff4d6;
  background: linear-gradient(135deg, rgba(42, 33, 20, 0.94), rgba(22, 17, 10, 0.94));
  padding: 8px 18px;
  border-radius: 14px;
  border: 1px solid rgba(232, 201, 142, 0.55);
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.5),
    0 0 18px rgba(232, 201, 142, 0.2),
    inset 0 0 0 1px rgba(255, 244, 214, 0.08);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 65;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
/* 气泡下方小箭头，指向水蓝蓝 */
.lan-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: rgba(28, 22, 13, 0.94);
}
.shuilanlan:hover .lan-tip {
  visibility: visible;
  animation: lan-tip-pop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes lan-tip-pop {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.6); }
  60% { opacity: 1; transform: translateX(-50%) translateY(-5px) scale(1.08); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
.subtitle {
  margin-top: 18px;
  font-size: clamp(15px, 2.4vw, 19px);
  color: rgba(243, 230, 200, 0.72);
  letter-spacing: 0.06em;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 26px;
}
.divider span {
  width: 90px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232, 201, 142, 0.7), transparent);
}
.divider .heart {
  color: #ff9bb0;
  font-style: normal;
  font-size: 16px;
  text-shadow: 0 0 14px rgba(255, 155, 176, 0.6);
}
.content {
  margin-top: 8px;
}
.footer {
  margin-top: 40px;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: rgba(232, 201, 142, 0.6);
}

/* ===== 彩蛋触发文字 ===== */
.easter-trigger {
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  border-bottom: 1px dashed transparent;
}
.easter-trigger:hover {
  color: rgba(255, 200, 160, 0.95);
  text-shadow: 0 0 10px rgba(255, 200, 160, 0.5);
  border-bottom-color: rgba(232, 201, 142, 0.5);
}

/* ===== 俏皮悬停气泡 ===== */
.egg-tip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) scale(0.7);
  transform-origin: bottom center;
  white-space: nowrap;
  font-family: "YouYuan", "幼圆", "Yuanti SC", "STKaiti", "Comic Sans MS",
    cursive;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff2f6;
  background: linear-gradient(135deg, #ff8aa8 0%, #ffba8c 100%);
  padding: 9px 18px;
  border-radius: 20px;
  box-shadow: 0 10px 26px rgba(255, 140, 170, 0.45),
    inset 0 0 0 2px rgba(255, 255, 255, 0.25);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 60;
}
.egg-tip .tip-heart {
  font-style: normal;
  margin-left: 4px;
  font-size: 17px;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
}
/* 气泡下方小箭头，指向「昱昱」 */
.egg-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #ffba8c;
}
.easter-trigger:hover .egg-tip {
  visibility: visible;
  animation: tip-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes tip-pop {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(10px) scale(0.6) rotate(-7deg);
  }
  60% {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px) scale(1.1) rotate(-2deg);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1) rotate(-3deg);
  }
}

/* ===== 彩蛋弹出照片（左侧滑入）+ 俏皮提示 ===== */
.egg-stage {
  position: fixed;
  left: 28px;
  bottom: 60px;
  z-index: 9999;
  width: clamp(180px, 26vw, 300px);
}
.egg-popup {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(232, 201, 142, 0.15);
  border: 1.5px solid rgba(232, 201, 142, 0.25);
  pointer-events: none; /* 不阻挡交互 */
}
.egg-popup img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 左侧滑入 + 淡入过渡 */
.egg-slide-enter-active {
  transition: all 0.65s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.egg-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.egg-slide-enter-from {
  opacity: 0;
  transform: translateX(-50px) scale(0.88);
}
.egg-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.94);
}

/* ===== 连点 15 次：俏皮提示「别点了~我想你了！」===== */
.egg-tease {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 0;
  white-space: nowrap;
  font-family: "YouYuan", "幼圆", "Yuanti SC", "STKaiti", "Comic Sans MS",
    cursive;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff2f6;
  background: linear-gradient(135deg, #ff8aa8 0%, #ffba8c 100%);
  padding: 10px 20px;
  border-radius: 22px;
  box-shadow: 0 10px 26px rgba(255, 140, 170, 0.45),
    inset 0 0 0 2px rgba(255, 255, 255, 0.25);
  transform: rotate(-7deg);
  pointer-events: none;
}
.tease-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tease-leave-active {
  transition: all 0.4s ease;
}
.tease-enter-from {
  opacity: 0;
  transform: rotate(-7deg) translateY(20px) scale(0.4);
}
.tease-leave-to {
  opacity: 0;
  transform: rotate(-7deg) translateY(-10px) scale(0.9);
}

/* 窄屏微调位置 */
@media (max-width: 600px) {
  .egg-stage {
    left: 14px;
    bottom: 80px;
    width: clamp(140px, 36vw, 220px);
  }
  .shuilanlan {
    width: clamp(60px, 14vw, 100px);
  }
  .title {
    gap: 6px;
  }
}

/* ===== 首屏丝滑出场动画（页面加载即播放一次）===== */
.eyebrow {
  animation: fade-up 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
.shuilanlan {
  animation: lan-enter 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.2s both;
}
.title {
  animation: fade-up 1s cubic-bezier(0.22, 0.61, 0.36, 1) 0.35s both;
}
.subtitle {
  animation: fade-up 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.55s both;
}
.divider {
  animation: fade-up 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) 0.75s both;
}
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 水蓝蓝：保持垂直居中 translateY(-50%)，叠加缩放浮现 */
@keyframes lan-enter {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}
</style>
