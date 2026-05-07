# 胖丁 Landing

胖丁产品官网。纯静态 HTML/CSS/JS，无构建步骤。

## 本地预览

```bash
python3 -m http.server 5577
# 或者
npx serve .
```

打开 http://localhost:5577

## 部署到 Vercel

### 方式一：CLI（推荐）

```bash
npm i -g vercel
vercel        # 预览部署
vercel --prod # 正式部署
```

第一次会问几个问题，全部回车默认即可。Vercel 会自动识别为静态站，不需要任何 build 命令。

### 方式二：Git 集成

1. 推到 GitHub
2. 在 vercel.com 点 New Project，选这个仓库
3. Framework Preset 选 **Other**，其余留空，Deploy

### 方式三：拖拽

直接把 `fatding-landing/` 文件夹拖到 vercel.com 首页的拖拽区。

## 文件

```
index.html      # 页面
styles.css      # 样式
script.js       # 滚动渐入
assets/
  avatar.png    # 胖丁头像
vercel.json     # 缓存与安全头
```

## 后续要替换的占位

- `index.html` 里两处下载 `href="#"` → 真实 dmg 链接
- `<meta property="og:image">` 可换成专门的社交分享图
