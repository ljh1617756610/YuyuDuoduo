<script setup>
import { ref } from 'vue'

// 音乐文件约定放在 frontend/public/music/bgm.mp3
// 经 Vite 构建后位于 dist/music/bgm.mp3，Django 以 /static/music/bgm.mp3 托管
const SRC = '/static/music/bgm.mp3'

const audio = ref(null)
const playing = ref(false)
const missing = ref(false)

function toggle() {
  const el = audio.value
  if (!el) return
  if (el.paused) {
    el.play()
      .then(() => {
        playing.value = true
        missing.value = false
      })
      .catch(() => {
        // 多数情况是文件尚未放入（404），保持暂停态并提示
        missing.value = true
        playing.value = false
      })
  } else {
    el.pause()
    playing.value = false
  }
}
</script>

<template>
  <div class="audio-player">
    <button
      class="play-btn"
      :class="{ 'is-playing': playing }"
      type="button"
      :aria-label="playing ? '暂停音乐' : '播放音乐'"
      :title="playing ? '暂停音乐' : '播放音乐'"
      @click="toggle"
    >
      <svg v-if="!playing" viewBox="0 0 24 24" class="ico" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="ico" aria-hidden="true">
        <rect x="6.5" y="5.5" width="3.6" height="13" rx="1.2" />
        <rect x="13.9" y="5.5" width="3.6" height="13" rx="1.2" />
      </svg>
    </button>
    <span class="hint" :class="{ on: playing, warn: missing }">
      {{ missing ? '未找到音乐文件' : (playing ? '好的昱昱' : '哈喽华住（嗲') }}
    </span>
    <audio ref="audio" :src="SRC" loop preload="auto"></audio>
  </div>
</template>

<style scoped>
.audio-player {
  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
}
.play-btn {
  position: relative;
  width: 56px;
  height: 56px;
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
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, background 0.25s ease,
    box-shadow 0.25s ease, border-color 0.25s ease;
}
.play-btn:hover {
  background: rgba(232, 201, 142, 0.18);
  border-color: rgba(232, 201, 142, 0.95);
  box-shadow: 0 0 22px rgba(232, 201, 142, 0.5);
  transform: scale(1.08);
}

/* ===== 播放中：胶片光环旋转 + 按钮脉动 + 双竖线变跳动音波 ===== */
.play-btn.is-playing {
  border-color: rgba(232, 201, 142, 0.95);
  background: rgba(232, 201, 142, 0.16);
  animation: btn-pulse 1.6s ease-in-out infinite;
}
/* 内圈：虚线圆环顺时针旋转，像胶片孔在走 */
.play-btn.is-playing::before {
  content: "";
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 2px dashed rgba(232, 201, 142, 0.8);
  animation: disc-spin 4s linear infinite;
  pointer-events: none;
}
/* 外圈：细环反向慢转，增加层次 */
.play-btn.is-playing::after {
  content: "";
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px solid rgba(232, 201, 142, 0.28);
  animation: disc-spin 7s linear infinite reverse;
  pointer-events: none;
}
@keyframes disc-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes btn-pulse {
  0%,
  100% {
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4),
      0 0 0 0 rgba(232, 201, 142, 0.4);
  }
  50% {
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4),
      0 0 20px 5px rgba(232, 201, 142, 0.32);
  }
}
/* 播放时暂停图标的两根竖线变成跳动的音波柱 */
.play-btn.is-playing .ico rect {
  transform-box: fill-box;
  transform-origin: center;
  animation: bar-jump 0.9s ease-in-out infinite;
}
.play-btn.is-playing .ico rect:nth-child(2) {
  animation-delay: 0.35s;
}
@keyframes bar-jump {
  0%,
  100% {
    transform: scaleY(0.55);
  }
  50% {
    transform: scaleY(1);
  }
}
.ico {
  width: 24px;
  height: 24px;
  fill: url(#g);
  fill: #fff4d6;
  filter: drop-shadow(0 0 6px rgba(232, 201, 142, 0.55));
}
.hint {
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "宋体", serif;
  font-size: 18px;
  letter-spacing: 0.05em;
  white-space: nowrap;
  /* 粉金流光渐变文字 */
  background: linear-gradient(
    100deg,
    #ffd9e0 0%,
    #e8c98e 25%,
    #ffb3c8 50%,
    #ffe9b0 75%,
    #ffd9e0 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 6px rgba(255, 180, 200, 0.35));
  /* 流光流动 + 随乐轻轻摇摆 */
  animation: hint-flow 4s linear infinite, hint-sway 3s ease-in-out infinite;
  transform-origin: center;
}
.hint.on {
  /* 播放中：流光更快、摇摆更欢，像跟着情歌律动 */
  animation-duration: 2.2s, 1.5s;
  filter: drop-shadow(0 0 11px rgba(255, 180, 200, 0.6));
}
.hint.on::after {
  content: "♪";
  margin-left: 5px;
}
.hint.warn {
  /* 文件缺失：静态粉色 + 仅摇摆，不流光 */
  background: none;
  -webkit-text-fill-color: #ff9bb0;
  color: #ff9bb0;
  animation: hint-sway 3s ease-in-out infinite;
  filter: none;
}
@keyframes hint-flow {
  to {
    background-position: 200% center;
  }
}
@keyframes hint-sway {
  0%,
  100% {
    transform: rotate(-2.5deg) translateY(0);
  }
  50% {
    transform: rotate(2.5deg) translateY(-2px);
  }
}
</style>
