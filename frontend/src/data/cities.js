// 三个恋爱回忆城市：上海 · 广州 · 丽江
// photos: 照片墙数据，待用户提供照片后填入。
//   约定：照片文件放在 frontend/public/photos/<slug>/ 下，
//   在 Django 托管时以 /static/photos/<slug>/<文件名> 引用（见 CityView）。
//   当前先留空，页面用占位框展示照片墙格式。
// noteCn / noteEn: 城市浪漫介绍的「中文」与「英文」，渲染时分行显示。
export const cities = [
  {
    slug: 'shanghai',
    name: '上海',
    en: 'Shanghai',
    coord: [121.47, 31.23],
    noteCn: '泮池的风，藏着我们的初见',
    noteEn: 'The breeze over Panchi, where we first met.',
    photos: [],
    // 子地点：每个地点一个轮播（竖版 3:4）。
    // 照片约定：frontend/public/photos/shanghai/<place-slug>/<文件名>
    //           Django 托管时以 /static/photos/shanghai/<place-slug>/<文件名> 引用。
    places: [
      { slug: 'shanghai-university', name: '上海大学', badge: 'shu', photos: [
        { src: '/static/photos/shanghai/shanghai-university/photo-01.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-02.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-03.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-04.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-05.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-06.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-07.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-08.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-09.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-10.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-11.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-12.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-13.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-14.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-15.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-16.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-17.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-18.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-19.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-20.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-21.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-22.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-23.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-24.jpg', caption: '' },
        { src: '/static/photos/shanghai/shanghai-university/photo-25.jpg', caption: '' },
      ] },
      { slug: 'aquarium', name: '水族馆', photos: [
        { src: '/static/photos/shanghai/aquarium/photo-01.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-02.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-03.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-04.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-05.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-06.jpg', caption: '' },
        { src: '/static/photos/shanghai/aquarium/photo-07.jpg', caption: '' },
      ] },
      { slug: 'disney', name: 'Disney', photos: [] },
    ],
  },
  {
    slug: 'guangzhou',
    name: '广州',
    en: 'Guangzhou',
    coord: [113.26, 23.13],
    noteCn: '珠江畔的甜味，是相守的日常',
    noteEn: 'Sweet days by the Pearl River.',
    photos: [
      { src: '/static/photos/guangzhou/photo-01.jpg', caption: '' },
      { src: '/static/photos/guangzhou/photo-02.jpg', caption: '' },
      { src: '/static/photos/guangzhou/photo-03.jpg', caption: '' },
      { src: '/static/photos/guangzhou/photo-04.jpg', caption: '' },
      { src: '/static/photos/guangzhou/photo-05.jpg', caption: '' },
      { src: '/static/photos/guangzhou/photo-06.jpg', caption: '' },
    ],
  },
  {
    slug: 'lijiang',
    name: '丽江',
    en: 'Lijiang',
    coord: [100.23, 26.86],
    noteCn: '古城的月光，许下永恒的诺言',
    noteEn: 'Moonlight over the old town, a promise forever.',
    photos: [],
    // 子地点：每个地点一个轮播（竖版 3:4）。
    places: [
      { slug: 'yulong-snow-mountain', name: '玉龙雪山', photos: [
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-01.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-02.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-03.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-04.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-05.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-06.jpg', caption: '' },
        { src: '/static/photos/lijiang/yulong-snow-mountain/photo-07.jpg', caption: '' },
      ] },
      { slug: 'old-town', name: '古城', photos: [
        { src: '/static/photos/lijiang/old-town/photo-01.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-02.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-03.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-04.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-05.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-06.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-07.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-08.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-09.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-10.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-11.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-12.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-13.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-14.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-15.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-16.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-17.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-18.jpg', caption: '' },
        { src: '/static/photos/lijiang/old-town/photo-19.jpg', caption: '' },
      ] },
    ],
  },
  {
    slug: 'beijing',
    name: '北京',
    en: 'Beijing',
    coord: [116.40, 39.90],
    photos: [],
    noIntro: true, // 地图 hover 时不显示浪漫介绍
    places: [
      { slug: 'universal', name: '环球影城', photos: [] },
    ],
  },
  {
    slug: 'luoke',
    name: '洛克王国',
    en: 'ROCO KINGDOM',
    noMap: true, // 不出现在中国地图上（非真实城市坐标，仅供水蓝蓝跳转）
    noIntro: true, // 不显示介绍文案
    landscape: true, // 照片墙用横向 4:3（其他城市默认竖版 3:4）
    photos: [
      { src: '/static/photos/luoke/photo-02.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-03.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-04.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-05.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-06.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-07.jpg', caption: '' },
      { src: '/static/photos/luoke/photo-08.png', caption: '' },
    ],
  },
]
