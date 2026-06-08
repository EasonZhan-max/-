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

留言箱当前是本地静态留言，只保存在访问者自己的浏览器 localStorage。后续要全网共享留言，需要接入 Twikoo / Waline / 后端数据库。
