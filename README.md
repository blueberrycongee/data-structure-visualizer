# 数据结构与算法可视化器（全新设计版 README）

面向学习与教学的交互式可视化网站。以设计系统为核心，覆盖数据结构与算法演示、学科导航、试卷练习与知识库联动，强调一致的视觉语言、良好的交互体验和可维护的前端架构。

## 项目概览

- 站点类型：原生 HTML/CSS/JavaScript 的静态网站，无构建工具依赖。
- 首页入口：`topics.html`（学科总导航）。`index.html` 在无 `go` 参数时自动重定向到首页。
- 核心模块：
  - 数据结构可视化（如 `tree.html`、`graph.html`、`heap.html` 等）
  - 高阶树结构演示（`avl.html`、`red-black.html`、`b-tree.html`、`b-plus-tree.html` 等）
  - 排序与字符串算法（`sorting.html`、`kmp.html`、`bm.html` 等）
  - 试卷练习与解析（`exams.html`、`exam-viewer.html` + `papers/`）
  - 知识库浏览与联动（`knowledge/md.html` + Markdown 资料）

## 设计系统

- 原子设计层次：`assets/css/components.css`（原子）、`molecules.css`（分子）、`organisms.css`（有机体），配合 `responsive.css` 做响应式适配。
- 主题系统：两套深浅主题，支持自动跟随系统与手动切换。
  - 轻量版按钮与覆盖：`assets/js/theme.js` + `assets/css/theme.css`
  - 增强型管理与事件：`assets/js/theme-manager.js` + `assets/css/theme-enhanced.css`
- 设计 Token：在 `assets/css/design-tokens.css` 中集中声明颜色、间距、字体与阴影，跨页面统一使用。
- 可访问性：语义化结构、对比度符合 WCAG 2.1 AA、支持 `prefers-reduced-motion`。
- 响应式：移动优先，典型断点 475/640/768/1024/1280。

## 功能速览

- 树结构交互演示（`tree.html`）
  - 节点拖拽、手柄连线、右键删除；自动识别：真二叉树、完全/满二叉树、二叉搜索树、左式堆。
  - 实时属性面板：节点数、深度/高度、平衡因子；复杂度提示（查找/插入/删除）。
  - 导出：结构 JSON 与画布图片（`html2canvas`）。
- 图与堆等模块：`graph.html`、`heap.html`、`sorting.html` 等页面按同一设计语言实现。
- 试卷系统：
  - 列表页自动抓取 `papers/` 下的 `.md` 文件渲染成卡片（无需手工维护索引）。
  - 查看页解析 Markdown + MathJax，支持题目标签跳转到对应知识页面。
- 知识库：`knowledge/` 分类清晰，`md.html` 通过 URL 参数加载具体 Markdown 文章。

## 目录结构

```
data-structure-visualizer/
├── assets/
│   ├── css/
│   │   ├── landing.css            # 首页与导航视觉
│   │   ├── styles.css             # 交互画布与侧栏
│   │   ├── theme.css              # 轻量主题切换覆盖
│   │   ├── theme-enhanced.css     # 增强主题管理样式
│   │   ├── design-tokens.css      # 设计 Token 集中声明
│   │   ├── components.css         # 原子组件
│   │   ├── molecules.css          # 分子组件
│   │   ├── organisms.css          # 有机体组件
│   │   └── responsive.css         # 响应式适配
│   └── js/
│       ├── app.js                 # 树交互主逻辑（节点/连线/导出）
│       ├── tree-algorithms.js     # 树类型识别、验证与复杂度分析
│       ├── module-index.js        # 卡片列表与试卷目录自动抓取
│       ├── exams.js               # Markdown 试卷解析与交互
│       ├── knowledge-index.js     # 标签到知识页的映射
│       ├── theme.js               # 轻量主题切换按钮与持久化
│       └── theme-manager.js       # 增强主题管理（事件/自动切换）
├── papers/                        # 试卷 Markdown 文件（*.md）
├── knowledge/                     # 知识库（按学科分类的 Markdown）
├── topics.html                    # 首页（学科总导航）
├── index.html                     # 导航入口（无参数重定向到首页）
├── exams.html                     # 试卷列表（自动读取 papers/）
├── exam-viewer.html               # 试卷查看（Markdown + MathJax）
└── tree.html / graph.html ...     # 各模块页面
```

## 快速开始

- 启动静态服务器（任选其一）：
  - Python：`python -m http.server 5501`
  - Node：`npx serve -s .`
- 访问入口：
  - 首页：`http://localhost:5501/topics.html`
  - 数据结构导航：`http://localhost:5501/index.html?go=ds`
  - 试卷列表：`http://localhost:5501/exams.html`
  - 试卷查看：`http://localhost:5501/exam-viewer.html?paper=文件名.md`

## 使用说明

- 树结构页面（`tree.html`）：
  - 画布空白处单击可创建根节点，悬停节点出现三个手柄（上/左/右）。
  - 拖拽手柄到目标节点或空白处完成连接或创建子节点；不合法操作会提示原因。
  - 右键节点可删除；左侧面板可清空/重置，右侧面板实时显示属性与复杂度，并提供导出功能。
- 试卷系统：
  - 将 `.md` 放入 `papers/` 目录，列表页会自动展示卡片；点击进入查看页。
  - 支持两种题目写法：
    - 结构化题块：以 `### 题目标题` 开始，随后可选的 `tags/difficulty/knowledge` 元数据，随后 `题目/选项/答案/解析`。
    - 普通题序：按“科目+题型”分节后使用 `1. 问题...` 连续书写，解析器自动抽取选项/答案/解析。
  - 标签联动：题目内的标签会映射到 `knowledge/` 对应文章，便于“题目 → 知识”跳转学习。

## 技术栈与依赖

- 原生前端：HTML、CSS、JavaScript（无框架、无打包）。
- 第三方库（CDN 加载）：
  - `MathJax`：公式渲染（试卷查看页）。
  - `markdown-it`：Markdown 解析（试卷查看页）。
  - `html2canvas`：画布截图导出（树结构页）。
- 主题与设计：CSS 变量统一 Token，支持 `prefers-color-scheme` 与 `prefers-reduced-motion`。

## 开发与扩展

- 新增模块页面：复制现有页面骨架（如 `tree.html`），复用侧栏/面板与主题开关，按需引入脚本。
- 扩展试卷标签映射：编辑 `assets/js/knowledge-index.js`，新增“标签 → 知识页”映射。
- 维护知识库：在 `knowledge/` 对应学科目录添加/更新 Markdown，并在列表页索引文件 `filenames.txt` 中登记（已支持中文文件名与编码）。

## 部署建议

- 任何静态托管均可（如 GitHub Pages、静态服务器/Nginx）。
- 注意相对路径：本项目按根目录部署设计，保持 `assets/`、`papers/` 与页面路径层级一致即可。

## 常见问题

- 试卷列表为空：确认 `.md` 文件已放在 `papers/` 下，并非子目录，或在 `_papers.json` 中提供外部列表。
- 图片导出失败：`html2canvas` 未加载或网络受限，可改用浏览器截图功能。
- 主题未切换：清理浏览器 LocalStorage 或使用增强主题管理器按钮重新切换。

——
本 README 基于当前网站的信息架构与设计系统重新撰写，覆盖核心模块与使用场景，便于快速理解与扩展维护。

## 信息架构与页面地图

- 首页与导航：
  - `topics.html` 站点首页与学科导航，包含主题按钮与模块卡片。
  - `index.html` 在无 `go` 参数时重定向到 `topics.html`（`index.html:11`）。
- 数据结构模块：
  - 树结构：`tree.html`，核心交互在 `assets/js/app.js` 与 `assets/js/tree-algorithms.js`。
  - 图：`graph.html`（`assets/js/graph.js`）。堆：`heap.html`（`assets/js/heap.js`）。
  - 高阶树：`avl.html`（`assets/js/avl.js`）、`red-black.html`（`assets/js/red-black.js`）、`b-tree.html`（`assets/js/b-tree.js`）、`b-plus-tree.html`（`assets/js/b-plus-tree.js`）。
- 试卷系统：
  - 列表：`exams.html` 使用 `assets/js/module-index.js` 自动读取 `papers/`。
  - 查看：`exam-viewer.html` 使用 `assets/js/exams.js` 解析 Markdown + MathJax。
- 知识库：
  - `knowledge/md.html` 加载指定 Markdown；各学科索引页如 `knowledge/ds/index.html`。

## 核心交互与数据模型

- 树数据模型：
  - `TreeNode` 定义在 `assets/js/tree-algorithms.js:3`，包含 `value/left/right/parent/x/y/id`。
  - `TreeAnalyzer` 定义在 `assets/js/tree-algorithms.js:15`，提供类型识别、验证与导出。
- 画布交互：
  - `TreeVisualizer` 定义在 `assets/js/app.js:3`，负责节点创建、拖拽、连线与导出。
  - 连接合法性校验在 `assets/js/app.js:479`（`isValidConnection`）。循环检测在 `assets/js/tree-algorithms.js:524-531` 与 `assets/js/tree-algorithms.js:261-271`。
  - 导出 JSON 在 `assets/js/tree-algorithms.js:273-289`；页面按钮调用在 `assets/js/app.js:888-897`。

## 试卷解析规范（详细）

- 解析入口：`assets/js/exams.js:206-220`。
- 结构化题块：从 `### 标题` 开始，支持 `tags/difficulty/knowledge` 元数据，正文与 `选项/答案/解析`（`assets/js/exams.js:71-89`）。
- 普通题序：在“科目/题型”分节后以 `1. 问题...` 书写，解析器自动抽取（`assets/js/exams.js:92-136`）。
- 标签到知识页：标签映射在 `assets/js/knowledge-index.js:3-9`，渲染与跳转逻辑在 `assets/js/exams.js:148-161`。

## 自动索引与列表抓取

- 试卷列表无需手动维护：
  - 首选 `_papers.json` 列表（若存在）（`assets/js/module-index.js:42`）。
  - 回退为抓取 `papers/` 目录的 `.md` 文件（`assets/js/module-index.js:41-45`）。
- 列表卡片生成：`assets/js/module-index.js:11-18`；页面渲染在 `assets/js/module-index.js:19-26`。

## 主题系统用法

- 轻量切换：
  - 自动注入固定按钮，持久化到 LocalStorage（`assets/js/theme.js:1-50`）。
  - 深浅模式覆盖样式位于 `assets/css/theme.css`，与页面 CSS 协同（如 `landing.css`、`styles.css`）。
- 增强管理：
  - `ThemeManager` 提供系统跟随、事件分发与快捷键（`assets/js/theme-manager.js:6-23`、`assets/js/theme-manager.js:174-196`、`assets/js/theme-manager.js:216-221`）。
  - 可选的时间段自动主题（`assets/js/theme-manager.js:201-211`）。

## 设计文档与规范参考

- 组件与样式文档：`design-documentation.html`（完整组件库与使用指南）。
- 设计 Token 与系统规范：`assets/css/design-tokens.css`、`assets/css/design-system.css`、`assets/css/components.css`、`assets/css/molecules.css`、`assets/css/organisms.css`、`assets/css/responsive.css`。
- 视觉走查报告：`visual-inspection-report.md`（对比度、响应式、动画与一致性评估）。
- 设计规范说明：`design-specification.md`（设计 Token、组件文档、测试策略等）。

## 页面状态与示例

- 已实现：`tree.html`、`graph.html`、`heap.html`、`avl.html`、`red-black.html`、`b-tree.html`、`b-plus-tree.html`、`sorting.html`、`splay-tree.html`、`hash-table.html`、`tournament.html`。
- 即将推出：`two-three-tree.html`、`trie.html`、`treap` 模块等（见 `topics.html` 卡片状态）。

## 开发约定

- 路径与命名：所有静态资源置于 `assets/`；页面引用统一使用 `assets/css/*.css` 与 `assets/js/*.js`（`assets/README.md:1-9`）。
- 不依赖打包：直接在 HTML 中引入脚本与样式；第三方库通过 CDN。
- 主题适配：新页面需引入 `assets/css/theme.css`，并在需要处设置 `data-theme-aware`（`assets/js/theme-manager.js:309-315`）。

- 学科分节（四选一，可多次出现）：`### 数据结构`、`### 操作系统`、`### 组成原理`、`### 计算机网络`
- 题型分节（不要附加分值或括号）：`一、判断题`、`二、选择题`、`三、填空题`、`四、解答题`
- 两种题目写法任选其一：
  - 数字题号写法：
    - `1. 题干……`
    - 可选 `选项:` 后逐行 `A. ...`/`（A）...`
    - `答案: B` 或 `答案: 对/错`
    - `解析:` 多行正文（支持 Markdown 表格与公式）
    - 可选元信息：`tags:`、`difficulty:`、`knowledge:`
  - 结构化题块写法：
    - `### 题目标题`
    - 可选元信息：`tags:`、`difficulty:`、`knowledge:`
    - 可选 `题目:` 后正文；支持 `选项:`、`答案:`、`解析:`

### 表格与公式

- 表格使用 Markdown 管道表格，示例：

```
| 事件 | LAN1 | LAN2 | LAN3 | 网桥动作 |
|---|---|---|---|---|
| C发给F一个帧 | A, B | C, D | E, F | 向LAN3 转发 (F在LAN3) |
```

- 公式写法：行内 `$...$`，行间 `$$...$$` 或 `\(...\)`。

## 知识标签联动

- 在 `assets/js/knowledge-index.js` 中维护标签到知识页的映射：
  - 键为标签文本，值为知识页 URL（可带片段锚点）。
  - 试卷题目中的 `tags` 将显示为“药丸标签”，点击跳转到对应知识页。

## 常见问题

- 试卷列表只显示一套：请刷新缓存；确认试卷在根目录 `papers/` 下，文件扩展名为 `.md`。
- 试卷查看为空：检查题型分节与题号写法是否符合规范；不要在分节标题后附加分值或括号。
- 中文文件名乱码：知识页已包含多编码解码；试卷文件名建议使用 UTF-8 存储。

## 主要功能页

- AVL：`/avl.html`，红黑树：`/red-black.html`，哈希表：`/hash-table.html`
- 字符串匹配：`/bm.html`、`/kmp.html`
- 流水线：`/pipeline.html`
- 编码系列：`/encoding.html` → 子页面

## 版权与许可

- 本项目为教学演示用，代码与内容版权归仓库所有者；请在遵循许可证的前提下使用和分发。

