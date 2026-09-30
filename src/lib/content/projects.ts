import type { Locale } from '@/lib/i18n';

export type Localized<T = string> = Record<Locale, T>;

export type ProjectCategory = 'tool' | 'reference' | 'guide' | 'directory';

export type ProjectStatus = 'live' | 'beta' | 'maintenance';

export interface Project {
  /** URL 片段，也是管理端的主键 */
  slug: string;
  /** 拉丁字符品牌标识，用于域名区与首字母标记 */
  brand: string;
  name: Localized;
  url: string;
  domain: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** 技术标签不翻译，保持检索一致 */
  tags: string[];
  released: string;
  updated: string;
  tagline: Localized;
  description: Localized;
  highlights: Localized<string[]>;
  featured: boolean;
  /**
   * 不下架，只从索引里撤下。
   * 隐藏的项目不进列表、不进站点地图、详情页直接 404，但数据仍留在清单里，
   * 管理端看得到，去掉这个标记即可重新露出。
   */
  hidden?: boolean;
}

/**
 * 项目清单。
 *
 * 现阶段是构建期常量；接入 Coolify 上的后端后，把 getProjects / getProject
 * 换成对 API 的请求即可，调用方不需要改动。
 */
export const projects: Project[] = [
  {
    slug: 'jtwarp',
    brand: 'JTWarp',
    name: {
      zh: 'JTWarp 报文解析',
      en: 'JTWarp Packet Parser',
      ja: 'JTWarp パケット解析',
    },
    url: 'http://jtwarp.anahgo.com',
    domain: 'jtwarp.anahgo.com',
    category: 'tool',
    status: 'live',
    tags: ['JT/T 808', 'JT/T 809', '协议解析', '车联网'],
    released: '2025-04-18',
    updated: '2026-08-02',
    tagline: {
      zh: '在浏览器里拆开部标报文',
      en: 'Take protocol packets apart in the browser',
      ja: 'ブラウザで電文をほどく',
    },
    description: {
      zh: '把 JT/T 808（2011/2013/2019）和 JT/T 809 的报文粘进去，按字段展开十六进制数据并标出每段的含义。解析全程在浏览器本地跑，报文不会离开这台电脑。',
      en: 'Paste a JT/T 808 (2011/2013/2019) or JT/T 809 packet and JTWarp expands it field by field, lining hex bytes up with what they mean. Parsing happens in the browser; packets never leave your machine.',
      ja: 'JT/T 808（2011/2013/2019）と JT/T 809 の電文を貼り付けると、16 進データをフィールド単位に展開して意味を並べて表示します。解析はブラウザ内で完結し、電文が外に出ることはありません。',
    },
    highlights: {
      zh: ['覆盖 808 与 809 多个版本', '逐字段展开，十六进制与含义对照', '本地解析，报文不上传', '打开即用，无需注册'],
      en: [
        'Covers several 808 and 809 versions',
        'Field-by-field expansion with hex beside meaning',
        'Parsing stays local; nothing is uploaded',
        'Works on open, no signup',
      ],
      ja: ['808 と 809 の複数版本に対応', 'フィールドごとに展開し 16 進と意味を対応表示', 'ローカル解析で電文を送信しない', '開けばそのまま使える、登録不要'],
    },
    featured: true,
  },
  {
    slug: 'airsound',
    brand: 'AirSound',
    name: {
      zh: 'AirSound 无线音箱',
      en: 'AirSound Wireless Speaker',
      ja: 'AirSound ワイヤレススピーカー',
    },
    url: 'https://airsound.anahgo.com/',
    domain: 'airsound.anahgo.com',
    category: 'tool',
    status: 'live',
    tags: ['Web Audio', '局域网', '实时推送'],
    released: '2025-11-06',
    updated: '2026-09-11',
    tagline: {
      zh: '让手机接着播电脑的声音',
      en: 'Send your computer audio to your phone',
      ja: 'PC の音をスマホに流す',
    },
    description: {
      zh: '电脑正在放的声音，通过局域网实时送到手机浏览器，手机就当一台无线音箱用。不用装客户端，也不用蓝牙配对，同一网络下打开网页即可。',
      en: 'Whatever your computer is playing gets pushed over the local network to your phone browser in real time, turning the phone into a wireless speaker. Nothing to install and nothing to pair. Open the page on the same network.',
      ja: 'PC で再生中の音を LAN 経由でスマホのブラウザへリアルタイムに届け、スマホをワイヤレススピーカーにします。クライアントのインストールもペアリングも不要で、同じネットワークで開くだけです。',
    },
    highlights: {
      zh: ['同一局域网内直连', '手机浏览器打开即用', '跟随电脑播放，实时转发', '不需要安装任何客户端'],
      en: [
        'Direct connection on the local network',
        'Opens in the phone browser',
        'Follows playback in real time',
        'Nothing to install',
      ],
      ja: ['同一 LAN 内で直接接続', 'スマホのブラウザで開くだけ', '再生に追従してリアルタイム転送', 'クライアントのインストール不要'],
    },
    featured: true,
  },
  {
    slug: 'ipadd',
    brand: 'IP Add',
    name: {
      zh: '车载终端 IP 填写指南',
      en: 'Vehicle Terminal IP Setup Guide',
      ja: '車載端末 IP 設定ガイド',
    },
    url: 'https://ipadd.anahgo.com/',
    domain: 'ipadd.anahgo.com',
    category: 'guide',
    status: 'live',
    tags: ['车载终端', 'APN', '配置指南'],
    released: '2025-06-22',
    updated: '2026-07-19',
    tagline: {
      zh: '装车填参数时事照着填',
      en: 'Fill in terminal parameters without guesswork',
      ja: '端末の設定項目をそのまま埋める',
    },
    description: {
      zh: '把车载终端装车时要填的 IP、端口、APN 等参数按步骤列出来，标明每一项从哪来、填错了会有什么现象。适合现场装机和售后排查时对照。',
      en: 'Sets out the IP, port and APN values a vehicle terminal needs at install time: where each one comes from, and what goes wrong when it is filled in incorrectly. Built for on-site installs and support calls.',
      ja: '車載端末の取り付け時に必要な IP・ポート・APN を手順順に並べ、それぞれの出どころと記入ミス時の症状を示します。現場の取り付けとサポート時の照合に向いています。',
    },
    highlights: {
      zh: ['按步骤列出需要填写的参数', '标明每项参数的来源', '列出常见填错后的现象', '可直接复制的参数模板'],
      en: [
        'Parameters listed in install order',
        'States where each value comes from',
        'Symptoms of common mistakes',
        'Copy-ready parameter templates',
      ],
      ja: ['設定項目を手順順に一覧化', '各項目の出どころを明記', 'よくある記入ミスの症状を掲載', 'コピーして使えるテンプレート'],
    },
    featured: false,
    hidden: true,
  },
  {
    slug: 'drivercommand',
    brand: 'Driver Command',
    name: {
      zh: '换卡小助手',
      en: 'SIM Swap Helper',
      ja: 'SIM 交換アシスタント',
    },
    url: 'https://drivercommand.anahgo.com/',
    domain: 'drivercommand.anahgo.com',
    category: 'guide',
    status: 'live',
    tags: ['终端运维', '指令生成', '换卡'],
    released: '2025-09-14',
    updated: '2026-06-30',
    tagline: {
      zh: '换卡要发的指令，一次列齐',
      en: 'Every command for a card swap, in one list',
      ja: 'SIM 交換に必要な指令をまとめて出す',
    },
    description: {
      zh: '终端换卡涉及的一串操作指令按场景生成，逐条列出顺序和用途，照着发就行。附带换卡后常见的异常判断，减少来回排查的时间。',
      en: 'Generates the sequence of commands a terminal card swap needs, in order, with what each one does. Includes the failure signs to check afterwards, so you spend less time going back and forth.',
      ja: '端末の SIM 交換に必要な一連の指令を場面ごとに生成し、順番と用途を並べて提示します。交換後の異常判定も載せているため、往復の確認を減らせます。',
    },
    highlights: {
      zh: ['按场景生成操作指令', '指令按发送顺序排列', '每条指令标注用途', '附带换卡后的异常判断'],
      en: [
        'Commands generated per scenario',
        'Listed in send order',
        'Each command labelled with its purpose',
        'Post-swap failure checks included',
      ],
      ja: ['場面ごとに指令を生成', '送信順に並べて表示', '各指令に用途を明記', '交換後の異常判定つき'],
    },
    featured: false,
    hidden: true,
  },
  {
    slug: 'cloudhub',
    brand: 'Cloud Hub',
    name: {
      zh: 'Cloud Hub 云服务商导航',
      en: 'Cloud Hub Provider Directory',
      ja: 'Cloud Hub クラウド事業者ナビ',
    },
    url: 'https://cloudhub.anahgo.com/',
    domain: 'cloudhub.anahgo.com',
    category: 'directory',
    status: 'live',
    tags: ['云计算', '开发者平台', '导航'],
    released: '2026-01-27',
    updated: '2026-09-05',
    tagline: {
      zh: '按用途找云服务商',
      en: 'Find cloud providers by what you need',
      ja: '用途からクラウド事業者を探す',
    },
    description: {
      zh: '把国内外云服务商和开发者平台按用途分组，对象存储、边缘函数、域名、数据库各成一组。点一下直达官网，不用在收藏夹里翻。',
      en: 'Cloud and developer platforms, domestic and international, grouped by what they are for: object storage, edge functions, domains, databases. One click to the official site instead of digging through bookmarks.',
      ja: '国内外のクラウド事業者と開発者プラットフォームを用途別に整理。オブジェクトストレージ、エッジ関数、ドメイン、データベースがそれぞれまとまっています。ワンクリックで公式サイトへ。',
    },
    highlights: {
      zh: ['按用途而不是按厂商分类', '国内外服务商一并收录', '支持按关键词检索', '直达官网，不跳转中间页'],
      en: [
        'Grouped by purpose, not by vendor',
        'Domestic and international providers together',
        'Keyword search across entries',
        'Straight to the official site',
      ],
      ja: ['事業者ではなく用途で分類', '国内外のサービスをまとめて収録', 'キーワード検索に対応', '公式サイトへ直接移動'],
    },
    featured: true,
  },
  {
    slug: 'nanopage',
    brand: 'NanoPage',
    name: {
      zh: 'NanoPage 编辑器速查',
      en: 'NanoPage Editor Cheat Sheet',
      ja: 'NanoPage エディタ早見表',
    },
    url: 'https://nanopage.anahgo.com/',
    domain: 'nanopage.anahgo.com',
    category: 'reference',
    status: 'live',
    tags: ['Vim', 'nano', 'Cheat Sheet'],
    released: '2025-03-09',
    updated: '2026-05-21',
    tagline: {
      zh: 'Vi 与 nano 的按键对照',
      en: 'Vi and nano keys, side by side',
      ja: 'Vi と nano のキー対応表',
    },
    description: {
      zh: '服务器上改配置时最容易卡在编辑器里。这一页把 Vi/Vim 与 nano 常用操作按类型排在一起：移动、编辑、保存、退出，按需去查。',
      en: 'Editing a config on a server usually stalls at the editor. This page lines up common Vi/Vim and nano operations by type: moving, editing, saving, quitting. Look up only the one you need.',
      ja: 'サーバー上の設定変更でつまずきやすいのがエディタ操作です。Vi/Vim と nano の操作を移動・編集・保存・終了の種別に並べ、必要なところだけ引けます。',
    },
    highlights: {
      zh: ['Vi/Vim 与 nano 并排对照', '按操作类型分组', '单页加载，无需翻页', '键盘可直达搜索框'],
      en: [
        'Vi/Vim and nano in parallel columns',
        'Grouped by operation',
        'Single page, no paging',
        'Keyboard shortcut into search',
      ],
      ja: ['Vi/Vim と nano を並べて比較', '操作種別でグループ化', '1 ページ完結で読み込みが速い', 'ショートカットで検索へ'],
    },
    featured: false,
  },
  {
    slug: 'happyshell',
    brand: 'HappyShell',
    name: {
      zh: 'HappyShell 命令速查',
      en: 'HappyShell Command Reference',
      ja: 'HappyShell コマンド早見表',
    },
    url: 'https://happyshell.anahgo.com/',
    domain: 'happyshell.anahgo.com',
    category: 'reference',
    status: 'live',
    tags: ['Shell', 'CLI', '速查'],
    released: '2025-07-30',
    updated: '2026-08-26',
    tagline: {
      zh: '跨平台命令放一起查',
      en: 'Commands across platforms, one lookup',
      ja: 'プラットフォーム横断でコマンドを引く',
    },
    description: {
      zh: 'Linux、macOS、Windows 下常用的命令按场景分组，同一件事在不同系统里怎么写，摆在一起看。命令带复制按钮，粘到终端里就能跑。',
      en: 'Common commands on Linux, macOS and Windows, grouped by task, so you can see how the same job is written on each system. Every command has a copy button that drops straight into a terminal.',
      ja: 'Linux・macOS・Windows のコマンドを作業単位でまとめ、同じ作業の書き分けを並べて確認できます。各コマンドにコピーボタンがあり、そのまま端末に貼り付けられます。',
    },
    highlights: {
      zh: ['Linux、macOS、Windows 对照', '按使用场景分组', '命令一键复制', '支持关键词检索'],
      en: [
        'Linux, macOS and Windows side by side',
        'Grouped by task',
        'One-click copy',
        'Keyword search',
      ],
      ja: ['Linux・macOS・Windows を対応表示', '作業単位でグループ化', 'ワンクリックでコピー', 'キーワード検索に対応'],
    },
    featured: true,
  },
];

/** 全量清单，含已撤下的项目。只有管理端用它，便于把项目重新放出来 */
export function getAllProjects(): Project[] {
  return projects;
}

/** 对外可见的项目：列表、搜索、站点地图、结构化数据都只认这一份 */
export function getProjects(): Project[] {
  return projects.filter((project) => !project.hidden);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug && !project.hidden);
}

export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];

  const visible = getProjects();
  const sameCategory = visible.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = visible.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getCategories(): ProjectCategory[] {
  return Array.from(new Set(getProjects().map((p) => p.category)));
}
