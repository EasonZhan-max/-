# Eason Blog Clean

这是整理后的 Eason 个人博客静态网站版本。

## 目录结构

```text
eason_blog_clean/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js
│  ├─ images/        # 所有图片文件名已改成英文
│  ├─ music/         # 所有音乐文件名已改成英文
│  └─ icons/
├─ docs/EXPERT_REVIEW.md
└─ render.yaml
```

## Render 部署

1. 把 `eason_blog_clean` 文件夹里的全部内容上传到 GitHub 仓库根目录。
2. Render 新建 Static Site。
3. Publish Directory 填 `.`。
4. Build Command 留空或填 `echo static site`。

## 注意



## 修改标注
- 顶部栏小头像：`assets/images/nav-avatar.jpg`
- 侧边栏大头像：`assets/images/avatar.jpg`
- 首页大图：`assets/images/hero.jpg`
- 文章/音乐数据：`assets/js/main.js`
- 样式/动画：`assets/css/style.css`
- 更多说明见：`docs/CODE_NOTES.md`
