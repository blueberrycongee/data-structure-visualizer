# 数据结构可视化器

交互式数据结构与算法演示平台，支持 AVL / 红黑树、哈希表、字符串匹配、流水线冲突、进制编码等模块，统一步进回放与字幕提示。

## 功能速览

### 1. 树结构可视化
- **AVL 树**：插入动画、旋转分步回放、字幕 3s 自动隐藏。
- **红黑树**：插入修复、删除（含批量队列）、右键节点菜单、完整撤销。
- **通用组件**：`AnimationStepController` 提供前进/回退、字幕自动隐藏、节点高亮。

### 2. 哈希表（开放寻址）
- 支持线性/二次探测、懒惰删除、ASL 统计。
- 仅接受整数键，哈希为 `key mod bucketCount`；负数统一取模到正区间。

### 3. 字符串匹配
- **BM**：坏字符 + 好后缀双表，滑窗对齐动画。
- **KMP**：next / nextval 表计算与匹配回放。

### 4. 计算机组成原理
- **IEEE 754**：32/64 位浮点编码、手算过程。
- **进制转换**：二进制/八进制/十六进制互转，按 4 位分组与权重求和演示。
- **有符号整数**：原码、反码、补码手算步骤。
- **流水线冲突**：五级流水（IF/ID/EX/MEM/WB），支持转发开关与分支解析阶段选择，自动标注数据/控制冒险与气泡数。

### 5. 学科总导航
- 入口：`topics.html`，卡片式导航至各模块。
- 占位页：`arch.html`（组成）、`os.html`（OS）、`network.html`（网络）已预留结构。

## 本地运行

1. 克隆仓库
```bash
git clone https://github.com/blueberrycongee/data-structure-visualizer.git
cd data-structure-visualizer
```

2. 启动静态服务器（任选其一）
```bash
# Python 3
python -m http.server 8000
# Node
npx serve -s .
```

3. 浏览器访问
- 总导航：`http://localhost:8000/topics.html`
- AVL：`/avl.html`
- 红黑树：`/red-black.html`
- 哈希表：`/hash-table.html`
- 字符串匹配：`/bm.html`、`/kmp.html`
- 流水线：`/pipeline.html`
- 编码系列：`/encoding.html` → 子页面

## 技术栈
- 原生 HTML / CSS / ES6+
- 零第三方运行时依赖（除 `html2canvas` 用于导出截图）
- 统一资源路径：`assets/css/`、`assets/js/`

## 项目结构
```
data-structure-visualizer/
├── assets/
│   ├── css/          # 全局与模块样式
│   └── js/           # 通用控制器与各算法实现
├── *.html            # 功能页面
├── progress-report.md # 开发进度与接口文档
└── README.md         # 本文件
```

## 通用接口（可复用）

### AnimationStepController
```js
const ctrl = new AnimationStepController({
  nodeContainer: document.getElementById('nodes'),
  canvas: document.getElementById('lines'),
  overlayAutoHideMs: 3000,
  onStep: (step, idx) => { /* 自定义渲染 */ }
});
ctrl.bindControls(prevBtn, nextBtn);
ctrl.setSteps('标题', steps);
```

### 步骤约定
```ts
interface Step {
  message: string;
  highlightValues?: number[];
  snapshot?: any;
}
```

更多细节见 `progress-report.md`。

