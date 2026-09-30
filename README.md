# Anahgo Lab

anahgo lab 的官网（lab.anahgo.com），作用是旗下各站点的索引、导航与说明。本仓库当前只包含前端，数据来自构建期常量，界面定稿后再接后端。

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Next.js 15（App Router）+ React 19 | 静态导出友好，SEO 与多语言由路由层承担 |
| 样式 | Tailwind CSS v4 | 设计令牌集中定义在 `globals.css` |
| 字体 | Geist Sans / Geist Mono（`geist` 包） | 字体随包分发，构建期无需访问外部字体服务 |
| 主题 | next-themes | class 策略，浅色 / 深色 / 跟随系统 |
| 部署 | 前端 Vercel，后端与数据库、对象存储 Coolify | 后端尚未接入 |

## 目录结构

```
src/
  app/
    [locale]/            多语言路由：zh / en / ja
      page.tsx           首页：索引与项目列表
      projects/[slug]/   项目详情
      about/             关于
      [...rest]/         兜底路由，未匹配路径渲染本地化 404
      not-found.tsx      404（客户端组件，按路径首段取语言）
      opengraph-image.tsx
    console/             隐藏的管理入口（独立根布局，noindex）
    globals.css          设计令牌、组件类与动效
    manifest.ts sitemap.ts robots.ts
  components/            Header、Footer、项目索引、主题与语言切换、SplitText 等
  lib/
    content/projects.ts  项目数据（现阶段是常量，后续替换为 API）
    content/ui.ts        界面文案词典（zh / en / ja）
    i18n.ts seo.ts site.ts
  middleware.ts          语言协商与重定向
```

## 本地开发

```bash
npm install
cp .env.example .env.local
npm run dev
```

访问 `http://localhost:3000` 会按浏览器语言重定向到 `/zh`、`/en` 或 `/ja`。

## 环境变量

| 变量 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 站点正式地址，用于 canonical、OG、站点地图 |
| `NEXT_PUBLIC_ADMIN_PASSPHRASE` | 管理入口通行码（占位，后端接入后由服务端签发会话） |
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 地址，Coolify 部署后填写 |
| `NEXT_PUBLIC_VERIFY_GOOGLE` / `_BING` / `_YANDEX` / `_BAIDU` | 搜索引擎站点验证，留空则不输出对应 meta |
| `NEXT_PUBLIC_GITHUB_URL` / `NEXT_PUBLIC_CONTACT_EMAIL` | 组织信息，进入结构化数据的 Organization 节点 |

## 部署

托管在 GitHub（`suais/lab_anahgo`），Vercel 通过 GitHub 集成拉取并自动部署：推送到 `main` 触发生产部署，Pull Request 触发预览部署。

本机 `github.com:443` 直连超时，https 推送会失败。仓库已改为 SSH 推送：`core.sshCommand` 指向 `~/.ssh/lab_anahgo_github`，对应公钥已注册为该仓库的可写 Deploy Key，正常 `git push` 即可。换机器时需要重新生成密钥并登记。

首次接入只需在 Vercel 导入一次，之后不需要手动操作。

**1. 导入项目**

Vercel → Add New → Project → Import Git Repository → 选 `lab_anahgo`。Framework Preset 会自动识别为 Next.js，以下三项保持默认即可：

| 项 | 值 |
| --- | --- |
| Root Directory | `./`（仓库根） |
| Build Command | `next build` |
| Output Directory | `.next` |

Node 版本由 `package.json` 的 `engines.node` 指定（`>=20.9.0`），无需在面板单独设置。

**2. 环境变量**（Project → Settings → Environment Variables）

至少填 `NEXT_PUBLIC_SITE_URL=https://lab.anahgo.com`。其余变量见上文表格，留空也能构建，只是对应功能不生效。改完环境变量需要重新部署一次才会注入。

**3. 绑定域名**

Project → Settings → Domains → Add `lab.anahgo.com`，然后在 `anahgo.com` 的 DNS 解析处加一条记录：

```
类型  CNAME
名称  lab
值    cname.vercel-dns.com
TTL   600（或自动）
```

Vercel 校验解析生效后自动签发证书，通常几分钟内完成。只改 `lab` 这一条，其余子域不受影响。

`anahgo.com` 的 DNS 托管在 Cloudflare，加记录时把代理状态设为 **DNS only（灰色云）**，不要开 Proxied：Cloudflare 的代理会接管 TLS，Vercel 签发与续期证书时的验证请求可能被改写，导致域名卡在 pending。

现状：`lab` 原先是一条指向 `64.83.24.248` 的 A 记录，且未走 Cloudflare，当前已不可访问；其余子域都解析到 Cloudflare（104.21 / 172.67 段）。改之前确认那台机器上没有仍在用的服务。

**4. 提交搜索引擎**

部署成功后把 `https://lab.anahgo.com/sitemap.xml` 提交到 Google Search Console 与 Bing Webmaster Tools。若配置了站点验证变量，meta 会自动输出。

## 管理入口

入口不出现在导航、站点地图与 robots 可抓取范围中，通过两种方式进入：

1. 任意页面键入 `anahgo`，弹出通行码输入框。
2. 直接访问 `/console`，未通过校验时显示锁定界面。

当前通行码校验发生在前端，只做占位演示，不具备安全性。后端接入后必须改为服务端校验与会话签发。

## SEO

**元数据**

- 品牌后缀由 `[locale]/layout.tsx` 的 `title.template` 统一附加，子页只写自己的标题。
- 每页生成 canonical、description、OG/Twitter，以及含自身与 `x-default` 在内的完整 `hreflang` 互指。
- `og:locale:alternate` 声明其他语言版本；viewport 输出明暗两套 `theme-color`。

**结构化数据**（`@graph`）

| 页面 | 节点 |
| --- | --- |
| 首页 | WebSite + Organization + CollectionPage（含 ItemList） |
| 项目详情 | Organization + WebPage + BreadcrumbList + SoftwareApplication |
| 关于 | 复用布局的页面级元数据 |

节点之间用 `@id` 互相引用，Google 才能把页面归属到站点并取到站点名称。

**站点地图与抓取**

- `lastmod` 取自真实数据：首页为最新项目更新日，详情页各自 updated，关于页为 `siteConfig.launchedAt`。不要改用 `new Date()`，否则每次部署全站 lastmod 一起刷新，会被判定为内容频繁变动。
- priority 分三层：首页 1、详情页 0.8、关于页 0.5。
- `robots.txt` 屏蔽 `/console` 与 `/api`，管理路径另返回 `X-Robots-Tag: noindex`。
- 未匹配路径经 `[locale]/[...rest]` 兜底返回 404 状态码，并渲染本地化 404 页面。
- 语言协商的重定向响应带 `Vary: Accept-Language, Cookie`，避免 CDN 串语言缓存。

**社交分享图**

首页与 7 个项目的详情页各有 3 张按语言生成的静态 OG 图（1200×630）。图内只用拉丁字符——satori 的默认字体不含中日文字形。

## 动效

全站非用户触发的动效只有首页载入时的一条编排，其余全部回应操作。

1. 标题逐字落位（CJK 逐字、拉丁逐词，55ms 错峰）
2. 副句按标点逐句浮现（110ms 错峰）
3. 域名索引带的上下细线自中心展开
4. 域名条目依次汇入，圆点先弹至 1.5 倍再落回

鼠标经过：标题字符依次抬起再落回；链接下划线自左展开；站点标识抬起 2px。

实现上有两处不能省：逐字揭示必须分内外两层（`animation` 与 `transition` 同元素时，前者 `fill-mode: both` 的终态会锁死 transform）；位移一律手写 transform，不要混用 Tailwind 的位移工具类（v4 写的是 `translate` 属性，与 transform 通道混用后 reduced-motion 的兜底压不住）。

`prefers-reduced-motion: reduce` 下所有动画时长与延迟归零，纯装饰位移直接取消。

## 后续工作

1. 项目数据迁到 Coolify 上的后端与数据库，`getProjects` / `getProject` 改为请求 API。
2. 项目截图存到对象存储，替换详情页的预览占位。
3. 管理端实现项目增删改、排序与多语言文案维护，服务端鉴权。
4. 补充站点反馈入口，并在 Search Console / Bing 提交 `sitemap.xml`。
