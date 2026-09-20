# GitHub Pages 部署说明

## 推荐仓库结构（`JiangSs111.github.io` 根目录）

个人站点仓库（`用户名.github.io`）会直接把 **main 分支根目录** 发布为网站，因此仓库根目录只放构建后的纯静态文件：

```
JiangSs111.github.io/
├── index.html          # 网站入口（必需）
├── 404.html            # 兜底页（内容与 index.html 相同）
├── .nojekyll           # 空文件，关闭 Jekyll 处理，保证下划线目录可用
├── favicon.svg         # 站点图标
├── assets/             # 打包后的 JS / CSS
│   ├── index-xxx.js
│   └── index-xxx.css
└── maps/               # 思维导图图片
    ├── 00_overview.jpg
    └── ...
```

> 源代码（src/、package.json 等）**不要**放进这个仓库——GitHub Pages 只负责托管，不会帮你构建。建议源代码另建一个仓库（如 `python-syntax-atlas`）保存，需要更新时在本地 `npm run build`，再把 `dist/` 里的内容覆盖过来。

## 部署步骤

1. 打开本地 `D:\git\JiangSs111.github.io` 文件夹，**删除里面的旧文件**（保留 `.git` 隐藏文件夹）。
2. 把本站交付的 `JiangSs111.github.io` 文件夹里的**全部内容**（含 `.nojekyll`、`404.html`）复制进去。
3. 在该目录打开终端，执行：

```bash
git add -A
git commit -m "deploy: Python 符号图谱静态站点"
git push origin main
```

4. 等待 1~3 分钟，访问 **https://JiangSs111.github.io** 即可看到网站。

## 检查仓库设置（如果打不开）

- 仓库 → **Settings → Pages**
- **Source** 选择 `Deploy from a branch`
- **Branch** 选择 `main` / 根目录 `/ (root)`
- 保存后等右上角出现绿色部署完成标记

## 常见问题

| 问题 | 原因与解决 |
|---|---|
| 页面 404 | 确认分支是 main、目录是 / (root)；仓库名必须与用户名完全一致 |
| 页面空白 | 打开浏览器控制台看报错；确认 assets 文件夹完整上传 |
| 样式或图片丢失 | 确认推送了 `.nojekyll`（没有它 Jekyll 会忽略部分目录） |
| 更新后看不到变化 | 浏览器强制刷新 `Ctrl + F5`，或等 CDN 缓存过期（约 10 分钟） |

## 后续更新流程

在源代码仓库修改 → `npm run build` → 把新 `dist/` 内容覆盖到 `D:\git\JiangSs111.github.io` → `git add -A && git commit && git push`。
