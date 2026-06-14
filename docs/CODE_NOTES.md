# Eason 小站代码修改标注

## 常改文件

- `index.html`：网页结构、顶部栏、侧边栏、弹窗结构。
- `assets/css/style.css`：颜色、圆角、卡片、动画、手机端适配。
- `assets/js/main.js`：文章数据、音乐数据、打字机文案、交互逻辑。

## 常改位置

1. 顶部栏左上角小头像：`assets/images/nav-avatar.jpg`。
2. 侧边栏大头像：`assets/images/avatar.jpg`。
3. 首页壁纸：`assets/images/hero.jpg`。
4. 首页打字机文案：`assets/js/main.js` 的 `CONFIG.typingTexts`。
5. 音乐歌单：`assets/js/main.js` 的 `CONFIG.playlist`。
6. 文章列表：`assets/js/main.js` 的文章数据区域。
7. 文章栏标题：`index.html` 里的 `.article-title-block strong`。

## 部署提醒

Render 更新后建议点 `Clear build cache & deploy`，再用 `?v=新版本号` 强制刷新。
