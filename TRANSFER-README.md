# Bei Chuan Portfolio - Transfer Notes

这个压缩包用于换电脑后继续制作北川个人作品集网站。

## 本地预览

进入项目文件夹后运行：

```bash
python3 -m http.server 8124
```

然后在浏览器打开：

```text
http://127.0.0.1:8124/
```

## 主要入口

- `index.html`：作品集首页
- `styles.css`：主站视觉样式
- `script.js`：主站横向滚动、首页视频切换、项目联动等交互
- `assets/`：字体、插画、视频、二维码与视觉素材
- `projects/robam/index.html`：老板电器二级案例页
- `projects/robam/styles.css`：老板电器案例页样式
- `CONTENT-BRIEF.md`：当前内容整理

## 后续替换素材

- 首页工作状态视频：`assets/hero-working.mp4`
- 首页思考状态视频：`assets/hero-thinking.mp4`
- 微信二维码：`assets/wechat-qr-beichuan.jpg`
- 项目封面素材：`assets/project-*.svg`

二级页返回主站时使用 `../../index.html#projects`，不要改回 `../../#projects`，否则部分本地打开方式会进入文件夹索引页。
