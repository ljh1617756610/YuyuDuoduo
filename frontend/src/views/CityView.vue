<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { cities } from '../data/cities.js'
import PhotoCarousel from '../components/PhotoCarousel.vue'
import FloatingHearts from '../components/FloatingHearts.vue'

const route = useRoute()
const city = computed(
  () => cities.find((c) => c.slug === route.params.slug) || cities[0]
)

// 有子地点（如上海）：每个地点一个轮播
const hasPlaces = computed(() => city.value.places && city.value.places.length > 0)

const PLACEHOLDER_COUNT = 6
// 某地点/城市的照片墙：有照片用真实照片，暂无则展示占位框（格式先搭好，待用户提供照片）
function wallFor(target) {
  if (target.photos && target.photos.length) return target.photos
  return Array.from({ length: PLACEHOLDER_COUNT }, () => ({ src: '', caption: '' }))
}
</script>

<template>
  <FloatingHearts />
  <section class="city-page">
    <div class="city-head">
      <h2 class="city-title" v-reveal>{{ city.name }}</h2>
      <p class="city-en" v-reveal="120">{{ city.en }}</p>
    </div>
    <p class="city-note" v-reveal="120" v-if="!city.noIntro && (city.noteCn || city.noteEn)">
      <span class="note-cn">{{ city.noteCn }}</span>
      <span class="note-en">{{ city.noteEn }}</span>
    </p>

    <!-- 有子地点：每个地点一个轮播（竖版 3:4）-->
    <template v-if="hasPlaces">
      <div v-for="place in city.places" :key="place.slug" class="place-block">
        <h3 class="place-title" v-reveal>{{ place.name }}</h3>
        <div class="place-photos" v-reveal="80">
          <PhotoCarousel :photos="wallFor(place)" :name="place.name" :badge="place.badge" />
        </div>
      </div>
    </template>

    <!-- 无子地点（广州 / 丽江 / 洛克王国）：同样轮播 -->
    <template v-else>
      <PhotoCarousel
        :photos="wallFor(city)"
        :name="city.name"
        :ratio="city.landscape ? '4 / 3' : '3 / 4'"
        :badge="city.badge"
      />
    </template>

    <RouterLink to="/" class="back" v-reveal>← 返回地图</RouterLink>
  </section>
</template>

<style scoped>
.city-page {
  margin-top: 8px;
  text-align: center;
}
.city-title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(120deg, #f6e7c1 0%, #e8c98e 40%, #fff4d6 70%, #d9b877 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 30px rgba(232, 201, 142, 0.18);
}
.city-en {
  margin-top: 6px;
  letter-spacing: 0.3em;
  font-size: 13px;
  color: rgba(232, 201, 142, 0.8);
  text-transform: uppercase;
}
.city-note {
  margin: 18px auto 10px;
  max-width: 560px;
  font-size: clamp(14px, 2.2vw, 17px);
  color: rgba(243, 230, 200, 0.78);
  line-height: 1.7;
  letter-spacing: 0.04em;
}
.note-cn {
  display: block;
}
.note-en {
  display: block;
  margin-top: 6px;
  font-size: clamp(12px, 1.8vw, 14px);
  font-style: italic;
  letter-spacing: 0.08em;
  color: rgba(232, 201, 142, 0.78);
}

/* ===== 子地点区块 ===== */
.place-block {
  margin-top: 44px;
}
.place-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  background: linear-gradient(120deg, #f6e7c1, #e8c98e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.back {
  display: inline-block;
  margin-top: 48px;
  padding: 14px 40px;
  font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", "宋体", serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #fff4d6;
  text-decoration: none;
  border: 1px solid rgba(232, 201, 142, 0.7);
  border-radius: 4px;
  background: rgba(18, 14, 10, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);
  transition: color 0.3s ease, background 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease, transform 0.3s ease;
}
.back:hover {
  color: #fff4d6;
  border-color: rgba(232, 201, 142, 1);
  background: rgba(232, 201, 142, 0.16);
  box-shadow: 0 0 26px rgba(232, 201, 142, 0.5), 0 6px 22px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}
</style>
