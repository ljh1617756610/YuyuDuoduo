<script setup>
import ChinaMap from '../components/ChinaMap.vue'
import LightfallBg from '../components/LightfallBg.vue'
</script>

<template>
  <LightfallBg
    :colors="['#A6C8FF','#5227FF','#FF9FFC']"
    background-color="#0e0c0a"
    :speed="0.5"
    :streak-count="2"
    :density="0.6"
    :twinkle="1"
    :glow="1"
    :background-glow="0.5"
    :zoom="3"
    :mouse-interaction="true"
    :mouse-strength="0.5"
    :mouse-radius="1"
  />
  <section class="map-section">
    <ChinaMap />
    <p class="caption">点亮的坐标，是我们共同走过的城市 —— 点击城市，开启那段回忆</p>
  </section>
</template>

<style scoped>
.map-section {
  margin-top: 60px;
  margin-bottom: 70px;
}
.caption {
  margin-top: 18px;
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "宋体", serif;
  font-size: 15px;
  color: rgba(243, 230, 200, 0.72);
  letter-spacing: 0.12em;
}
</style>
