# Eason 个人博客网站

这是一个单文件静态博客模板，已经放入你的头像和首页大图。

## 怎么改内容

1. 头像：替换 `assets/images/avatar.jpeg`
2. 首页大图：替换 `assets/images/hero.jpeg`
3. 抖音号：打开 `index.html`，搜索 `@这里改成你的抖音号`
4. 首页打字机文案：打开 `index.html`，搜索 `typingTexts`
5. 添加音乐：把 mp3 放进 `assets/music/`，然后在 `playlist` 里添加：

```js
{ name: '歌曲名', src: 'assets/music/song.mp3' }
```

## 访客数说明

当前版本是纯静态网页，访客编号使用浏览器本地记录，适合 GitHub Pages 直接部署。真正的全站访客总数需要接入后端数据库或第三方统计服务。
