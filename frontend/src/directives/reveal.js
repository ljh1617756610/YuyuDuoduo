// 滚动渐入指令 v-reveal
// 用法：
//   v-reveal              默认：淡入 + 上浮 + 去模糊（深入显现）
//   v-reveal="200"        延迟 200ms 再渐入（用于依次出场）
//   v-reveal:soft         仅淡入，不位移/缩放/模糊（用于地图等不宜变换的容器）
const io = (function () {
  // 不支持 IntersectionObserver 时返回 null，指令会直接显示
  if (typeof IntersectionObserver === 'undefined') return null
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        // 来回滚动都触发：进入视口足够比例时显现，离开时隐藏以便再次出场
        if (e.intersectionRatio > 0.15) {
          e.target.classList.add('is-visible')
        } else {
          e.target.classList.remove('is-visible')
        }
      })
    },
    { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] }
  )
})()

export const vReveal = {
  mounted(el, binding) {
    const soft = binding.arg === 'soft'
    el.classList.add(soft ? 'reveal-soft' : 'reveal')
    if (binding.value) {
      el.style.setProperty('--reveal-delay', binding.value + 'ms')
    }
    if (!io) {
      // 无 observer 支持：直接显示
      el.classList.add('is-visible')
      return
    }
    io.observe(el)
  },
  // 路由切换 / v-if 重新挂载时清理（元素被卸载会自动 unobserve，这里兜底）
  unmounted(el) {
    if (io) io.unobserve(el)
  },
}
