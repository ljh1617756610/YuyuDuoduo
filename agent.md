# agent.md — 网站制作项目

本文件为 AI agent / 协作者提供项目上下文。人工维护，改动项目结构或技术栈后请同步更新。

## 项目概述

一个 Django（后端 / 后台）+ Vue 3（前端）的网站项目。前台使用 Vue 单页应用，由 Django 在开发模式下直接托管构建后的静态文件；后台使用 Django admin + simple-ui（中文界面）。当前为纯前端架构，**暂无后端 API 层**（未引入 DRF）。

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 运行时 | Python（托管运行时） | 3.13.14 |
| 后端框架 | Django | 6.0.7 |
| 后台主题 | django-simpleui | 2026.1.13 |
| 前台框架 | Vue | 3.5.25（已精确锁定） |
| 前端路由 | vue-router | 4.x（hash 模式） |
| 地图 | echarts + china-geojson | 2D 中国地图 |
| 构建工具 | Vite | 5.4.x |
| 包管理 | npm | 10.9.7（Node 22.22.2） |
| 数据库 | SQLite | `db.sqlite3` |

## 目录结构

```
网站制作/
├── agent.md                 # 本文件
├── manage.py
├── webproject/              # Django 项目配置包
│   ├── settings.py          # 含 simple-ui、中文、静态文件托管 Vue 构建产物
│   ├── urls.py              # 根路由 include('main.urls') + admin
│   └── ...
├── main/                    # Django 应用
│   ├── views.py             # home 视图渲染 frontend/dist/index.html
│   └── urls.py
├── frontend/                # Vue 3 + Vite 前端工程（独立）
│   ├── index.html
│   ├── vite.config.js       # base: '/static/'
│   ├── src/
│   │   ├── App.vue          # 站点骨架：大标题 + <RouterView> + 页脚（无导航，城市靠点地图进入）
│   │   ├── main.js          # 入口，挂载 vue-router（hash 模式）
│   │   ├── data/cities.js   # 三城数据：上海/广州/丽江（含坐标、noteCn/noteEn 中英文案，渲染时分行）
│   │   ├── components/ChinaMap.vue  # 2D 中国地图（roam:true 拖拽+滚轮缩放；点击城市跳转）
│   │   ├── components/AudioPlayer.vue # 右下角背景音乐播放器（金色发光圆形按钮，点击循环播放）
│   │   ├── views/Home.vue   # 首页（地图）
│   │   ├── views/CityView.vue       # 城市专属页 /#/city/:slug（有 places 渲染竖版3:4可滚动网格照片墙；无则大图轮播；无地图）
│   │   └── style.css
│   └── dist/                # 构建产物（由 Django 托管，勿手改）
├── .venv/                   # Python 虚拟环境（激活后使用）
└── db.sqlite3
```

## 环境激活

```bash
# Python 虚拟环境
source .venv/Scripts/activate            # bash
.venv/Scripts/Activate.ps1               # PowerShell

# Node 用托管运行时（项目内 frontend/node_modules 已安装依赖）
```

## 常用命令

后端（需先激活 .venv，在 `网站制作/` 根目录）：

```bash
python manage.py runserver               # 启动开发服务器 http://127.0.0.1:8000/
python manage.py check                  # 系统检查
python manage.py migrate                # 迁移数据库
python manage.py createsuperuser        # 新建管理员
```

前端（在 `frontend/` 目录）：

```bash
npm run dev                             # 独立前端热更新（端口 5173）
npm run build                           # 构建到 frontend/dist（Django 托管此产物）
npm run preview                         # 预览构建产物
```

## 关键约定与踩坑

1. **前端改动必须重新构建**：Django 托管的是 `frontend/dist`，改了 `frontend/src` 后务必 `cd frontend && npm run build`，否则页面不会更新。
2. **simple-ui 注册名是 `simpleui`**（不是 `simple_ui`），且必须排在 `django.contrib.admin` **之前**的 `INSTALLED_APPS` 中。
3. **Vite `base: '/static/'`** 与 Django `STATIC_URL = '/static/'` 对齐，这样 `dist` 下的资源能被 Django 以 `/static/assets/...` 路径直接托管。
4. **后台默认中文**：`LANGUAGE_CODE = 'zh-hans'`，`TIME_ZONE = 'Asia/Shanghai'`。
5. **当前为纯前端架构**：Django 不提供 REST API；如后续需要前后端数据交互，应引入 Django REST Framework 并配置 CORS。
6. **超级管理员账号**：`1617756610` / 密码 `Ljh930341`（邮箱 1617756610@qq.com，昵称存于 `first_name`）。Django 默认 User 模型无独立 nickname 字段。
7. **依赖安装注意**：本环境 pip 在沙箱中清理缓存会报 `SAFE_DELETE` 错误导致安装中止，需用 `pip install --no-cache-dir <pkg>` 重试。
8. **前台路由用 vue-router（hash 模式 `createWebHashHistory`）**：无需 Django 额外配置即可支持城市子页面（`/#/city/shanghai` 等）。若改用 history 模式，需在 Django 侧把所有前端路由回退到 `dist/index.html`（当前未配置）。
9. **中国地图交互约束**：`ChinaMap.vue` 的 `geo.roam: true` —— 允许鼠标拖拽移动 + 滚轮缩放；点击**仅城市点**（`seriesType==='effectScatter'`）会 `router.push('/city/<slug>')` 跳转到该城专属页，点击其余区域（geo 面/飞线）不跳转。飞线为 上海→广州、丽江→上海（丽江↔广州 段已删除）。
12. **城市页（无地图，底部「← 返回地图」）**：`CityView.vue` 逻辑分两种——(a) 城市有 `places` 子地点（当前仅上海）：每个子地点渲染一个**可滚动网格照片墙**（`.photo-wall`，`aspect-ratio: 3/4` 竖版，悬停上浮发光，无地图），子地点数据在 `cities.js` 的 `places: [{slug,name,en,photos}]`；(b) 无子地点（广州/丽江）：维持**单张大图轮播**（setInterval 自动滚动+悬停暂停，金色 `.arrow` 箭头、`.dots` 圆点指示器）。照片数据统一为 `photos: [{src, caption}]`，当前 `[]` 故显示「照片待添加」占位框。提供照片后：城市级放 `frontend/public/photos/<slug>/`；上海子地点放 `frontend/public/photos/shanghai/<place-slug>/`，`src` 填 `/static/photos/.../<文件名>`（Django 托管 dist 时经 STATIC_URL 前缀）。
13. **首页无城市导航**：`App.vue` 已删除顶部 `.city-nav` 城市胶囊，进入城市页**仅能靠点击中国地图上的城市点**（`ChinaMap.vue` 点击 effectScatter 触发 `router.push('/city/<slug>')`）。
14. **曾短暂采用 3D 全球地图（echarts-gl + world-atlas），已回退并删除**：相关依赖 `echarts-gl`、`world-atlas`、`topojson-client` 已 `npm uninstall`，组件 `WorldMap.vue` 已删除。当前仅保留 2D 中国地图所需依赖（china-geojson / echarts / vue / vue-router）。
15. **背景音乐播放器**：`src/components/AudioPlayer.vue` 固定在页面右下角（金色发光圆形按钮，播放/暂停图标切换），用 `<audio loop>` 循环播放，挂在 `App.vue` 全局故切换路由音乐不中断。音乐文件约定放 `frontend/public/music/bgm.mp3`，构建后由 Django 以 `/static/music/bgm.mp3` 托管；**浏览器禁止音频自动播放，需用户点击按钮才开始**（播放器已处理 404 提示「未找到音乐文件」）。音频由用户自行提供，规避版权风险。

## 新增功能建议路径

- 新增页面/组件 → 在 `frontend/src` 下开发，构建后由 Django 提供。
- 需要后端数据 → 在 `main/` 增加 model/view，并考虑引入 DRF。
- 后台管理数据 → 在 `main/admin.py` 注册模型即可（simple-ui 已生效）。
