# 数据结构可视化器

交互式数据结构与算法演示平台。支持数据结构可视化、学科导航、试卷练习（Markdown 试卷解析、题目标签到知识点的联动）等模块。

## 亮点特性

- 主页统一到 `topics.html`，根路径 `index.html` 自动重定向到主页（当无 `go` 参数时）。
- 数据结构知识页按分类读取 `filenames.txt`，支持中文文件名与多编码解码。
- 试卷列表自动读取 `papers/` 目录的 `.md` 文件并渲染为卡片，无需手动维护。
- 试卷查看支持 Markdown（含表格、列表）与 MathJax 公式，解析两种题目写法：数字题号写法、`###` 结构化题块。
- 题目标签可跳转到对应知识页面（`assets/js/knowledge-index.js`）。

## 目录结构

```
data-structure-visualizer/
├── assets/
│   ├── css/
│   └── js/
│       ├── exams.js                # 试卷解析与渲染
│       ├── module-index.js         # 卡片列表渲染（含试卷自动抓取）
│       └── knowledge-index.js      # 标签到知识页的映射
├── papers/                         # 放置试卷 Markdown 文件（*.md）
├── knowledge/                      # 知识库与分类页
├── topics.html                     # 主页（学科总导航）
├── exams.html                      # 试卷列表页（自动读取 papers/）
├── exam-viewer.html                # 试卷查看页（Markdown + MathJax）
├── index.html                      # 根路径入口（无参数时重定向到主页）
└── README.md
```

## 本地运行

- 启动静态服务器（任选其一）
  - Python：`python -m http.server 5501`
  - Node：`npx serve -s .`

- 访问路径
  - 主页：`http://localhost:5501/` 或 `http://localhost:5501/topics.html`
  - 数据结构导航：`/index.html?go=ds`
  - 试卷列表：`/exams.html`
  - 试卷查看：`/exam-viewer.html?paper=文件名.md`

## 添加试卷

- 将试卷 Markdown 文件放入 `papers/` 目录，页面会自动显示为卡片。
- 点击卡片进入 `exam-viewer.html?paper=文件名.md` 即可查看与答题。

### 试卷 Markdown 规范（兼容当前解析器）

- 顶部标题：`# 试卷标题`
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

