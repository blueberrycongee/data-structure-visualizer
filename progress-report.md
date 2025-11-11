# Data Structure Visualizer 开发进度与可复用接口汇报

## 1. 项目概览
- 目标：提供可交互的数据结构可视化（当前覆盖 AVL 树与红黑树），支持插入、旋转/修复动画、步骤回放与状态提示。
- 技术：原生 JS + HTML + CSS，通用步进与字幕控制由 `AnimationStepController` 提供。

## 2. 开发进度总览
**近期完成**
- 通用步进控制与字幕框可复用组件化：`animation-controller.js`。
- 步骤回放默认定位到“最后一步（当前状态）”。
- 字幕框自动隐藏（默认 3 秒），AVL 与红黑树页面均已启用。
- AVL：插入流程分步回放（插入前/插入后/各旋转/再平衡完成）。
- AVL：修复“回退一步跳到错误场景”的问题（LL/RR 旋转快照记录时机调整至更新父子指针之后）。
- AVL：节点 DOM 增加 `data-value` 以保证按值高亮在快照回放中准确。
- 红黑树：插入修复动画分步记录快照并重渲染，兼容步进回放与自动隐藏字幕。
- 红黑树：新增右键节点菜单（删除 / 加入批量队列 / 从队列移除）。
- 红黑树：新增批量删除队列面板（显示队列、执行批量、清空队列）。
- 红黑树：批量删除执行改为“整段步骤聚合 + 开头记录批量前快照”，支持一键完整撤销到批量前状态。

**已在浏览器验证**
- `avl.html`：回退/前进对齐快照，无跨场景跳跃；字幕 3s 自动隐藏。
- `red-black.html`：插入修复步骤可回放；字幕 3s 自动隐藏。
- `red-black.html`：右键节点菜单交互正常；批量删除队列执行后，撤销可逐步回退直至“批量前（原始树）”快照。

## 3. 通用步进与字幕控制（`animation-controller.js`）
**核心类**：`AnimationStepController(options)`
- `nodeContainer`：节点容器元素。
- `canvas`：连线 SVG 画布。
- `overlayParent`：字幕框挂载容器（默认 `document.body`）。
- `onStep(step, index)`：每次渲染步骤时触发；用于自定义渲染（快照/高亮等）。
- `overlayAutoHideMs`：字幕自动隐藏毫秒数；设为数值即开启。

**主要方法**
- `bindControls(prevBtn, nextBtn)`：绑定“回退/前进”按钮。
- `setSteps(title, steps)`：设置步骤并默认指向最后一步。
- `prev()` / `next()`：移动到前/后一个步骤并触发渲染。
- `markNodes(nodes)` / `unmarkAll()`：为节点和相关连线添加/移除高亮样式。

**步骤结构约定**
```ts
interface Step {
  message: string;              // 步骤描述
  highlightValues?: number[];   // 按值高亮（由页面可视化器解析）
  snapshot?: any;               // 结构快照（页面自定义格式）
}
```

**使用示例**（页面集成）
```js
this.stepController = new AnimationStepController({
  nodeContainer: this.nodeContainer,
  canvas: this.canvas,
  overlayParent: document.body,
  overlayAutoHideMs: 3000,
  onStep: this.onStepChange.bind(this) // 内部接收 Step 并渲染快照 + 高亮
});
// 绑定按钮
this.stepController.bindControls(
  document.getElementById('step-prev-btn'),
  document.getElementById('step-next-btn')
);
// 设置步骤
this.stepController.setSteps('插入过程', steps);
```

## 4. AVL 页面接口与改动（`avl.js`）
**可复用/对外约定**
- `AVLVisualizer.onStepChange(step)`：收到 Step 后渲染快照并高亮值。
- `renderSnapshot(snapshot)`：根据快照重建树并渲染。
- `snapshotTree(root)`：生成（值+左右子树）结构快照。
- `buildTreeFromSnapshot(snapshot)`：从快照重建 `AVLNode` 树并重算高度与平衡因子。
- `highlightValues(values)`：按值查找 DOM（依赖节点元素的 `data-value`）并高亮。
- `recordStep(message, highlightValues)`：供旋转函数在关键时刻记录快照。

**插入流程和步骤来源**
- `handleValueSelection(value, parentNode, direction)`：
  - 构造 `steps`：插入前、插入后（未再平衡）。
  - 调用 `tree.rebalancePath(parentNode, steps)`：在旋转处追加步骤。
  - 末尾追加“再平衡完成”，并 `setSteps('插入过程', steps)`。

**关键修复**
- `rebalancePath` 中 LL/RR 的步骤快照记录从“旋转后立即记录”调整为“完成父子指针挂接（含 root 更新）之后再记录”，保证每个快照都反映整棵树的一致状态，避免回退跨场景。
- 节点 DOM 增加 `data-value`，让 `highlightValues` 在快照回放时精准定位。

## 5. 红黑树页面接口与改动（`red-black.js`）
**可复用/对外约定**
- `RBTVisualizer.onStepChange(step)`：渲染快照后按值高亮。
- `renderSnapshot(snapshot)` / `snapshotTree(root)` / `buildTreeFromSnapshot(snapshot)`：快照含 `value + color + 子树`，重建时保留父指针。
- `RedBlackTree.insertFixupAnimated(z, steps)`：插入修复的分步动画逻辑；每步后渲染，记录快照并追加到 `steps`。

**体验对齐**
- 初始化步进控制器时启用 `overlayAutoHideMs: 3000`，字幕显示与隐藏行为与 AVL 一致。

**删除流程与步骤来源**
- 结构删除：提供 `find(value)`、`minimum(node)`、`transplant(u, v)`、`deleteStructural(z, steps)`，记录“删除前/删除后（结构层面）”快照。
- 修复动画：`deleteFixupAnimated(x, steps)` 按 CLRS 四类情况（兄弟为红、兄弟为黑且两个侄子均黑、兄弟为黑且近侄为红、兄弟为黑且远侄为红）逐步处理，动作后立即渲染并记录快照与高亮。
- 步骤结构：统一使用 `Step{ message, highlightValues, snapshot }`；删除过程包含高亮目标节点、兄弟与侄子节点等。

**交互增强与批量撤销**
- 右键节点菜单：`删除该节点`、`加入批量队列`、`从批量队列移除`。
- 批量队列：页面右侧显示当前队列；支持执行与清空。
- 批量执行的撤销修复：为 `deleteValue(value, { collectOnly: true })` 增加“仅收集步骤不立即设置”的选项；批量开始前记录整棵树的“批量前快照”，逐个删除收集步骤后，统一 `setSteps('批量删除过程', aggregatedSteps)`。因此可完整回退至批量开始前状态。

**页面与样式改动**
- `red-black.html`：新增批量队列面板（队列列表、执行批量、清空队列按钮），提示文案说明右键节点交互。
- `red-black.css`：新增右键菜单与批量队列的样式（浮层定位、hover 状态、面板布局）。
- `red-black.js`：新增 `batchDeleteQueue`、`contextMenu`、`contextMenuTargetValue` 属性；节点层绑定 `contextmenu` 事件；批量执行逻辑聚合步骤并统一设置。

**使用说明**
- 右键节点可直接删除或加入/移出批量队列。
- 批量队列面板可执行批量删除或清空队列；执行后可使用“撤销/前进”逐步回放，且支持一键回到“批量前快照”。

## 6. 可复用接口清单
**通用**
- `AnimationStepController`（`animation-controller.js`）：步进、按钮状态、字幕显示隐藏与自动隐藏、节点/连线高亮。

**AVL**
- `snapshotTree` / `buildTreeFromSnapshot` / `recomputeHeightsAndBF`。
- `recordStep`（旋转内使用）与 `highlightValues`（按值高亮 DOM）。

**红黑树**
- `snapshotTree`（含颜色）/ `buildTreeFromSnapshot`（重建带父指针）。
- `insertFixupAnimated`（可复用于其他需要“动作-渲染-记录快照”的流程模板）。

## 7. 使用与验证
- 本地访问：
  - AVL：`http://localhost:8000/avl.html` 或 `http://localhost:5500/avl.html`
  - 红黑树：`http://localhost:8000/red-black.html` 或 `http://localhost:5500/red-black.html`
  - 哈希表（开放寻址）：`http://localhost:8000/hash-table.html` 或 `http://localhost:5500/hash-table.html`
  - 学科导航页：`http://localhost:8000/topics.html` 或 `http://localhost:5500/topics.html`
- 验证要点：
  - 回退/前进一步应严格对应相邻快照。
  - 字幕框在约 3 秒后自动隐藏；再次步进会短暂显示并再次隐藏。
  - 红黑树批量删除：执行后，撤销可逐步回退至“批量前（原始树）”快照；前进可完整重放批量过程。
  - 哈希表：仅接受整数键；哈希为 `key mod bucketCount`。示例：`12 mod 8 = 4`；负数键按 `(key % m + m) % m` 处理，如 `-2 mod 8 = 6`。

## 8. 后续计划（建议）
- 将 LR/RL 的两步旋转记录也统一在父子指针稳定后批量追加，进一步保证时间点一致（目前已通过 `recordStep` 在双旋内分步记录，若发现回退需求，可再统一时机）。
- 步骤面板增加当前索引提示（如 `step i / n`）。
- 提供“跳到第一步/最后一步”按钮以便快速回看。
- 形成统一的 `Step` 结构规范文档，便于扩展到更多数据结构页。

## 9. 变更摘要（近期）
- 新增：字幕自动隐藏（可配置），默认 3000ms。
- 修复：AVL 回退步骤不一致问题（LL/RR 快照记录时机调整）。
- 改进：AVL 节点 DOM 增加 `data-value`，提高快照回放时高亮准确度。
- 对齐：红黑树插入修复页面接入通用步进控制器，体验统一。
- 新增：红黑树右键节点菜单与批量删除队列。
- 修复：红黑树批量删除的撤销仅回到“大步”的问题；现改为聚合所有步骤并在开头记录“批量前快照”，可完整回退到批量开始前状态。
- 对齐：红黑树删除结构与四类修复动画按步记快照并可回放。

## 10. 哈希表页面（开放寻址 + 懒惰删除）
- 页面文件：`hash-table.html` / `hash-table.js` / `hash-table.css`。
- 功能范围：
  - 插入 / 查找 / 删除（开放寻址）。
  - 支持线性探测与二次探测（单选控制）。
  - 懒惰删除（`tombstone`），删除后保留占位以保证查找路径正确。
  - 显示成功平均查找长度（ASL success）。
  - 分步动画与快照回放：每次探测都会记录并高亮当前桶。
- 哈希策略（与用户期望对齐）：
  - 仅允许整数键输入，哈希为 `key mod bucketCount`。
  - 负数键采用 `(key % m + m) % m` 以得到非负索引。
  - 键在插入时统一转换并存储为整数，避免字符串哈希带来的偏差。
- 交互与校验：
  - 输入框类型改为 `type="number"`，`step="1"`，`inputmode="numeric"`；占位提示“键（整数）”。
  - 在插入/查找/删除事件中进行严格整数校验，非法值将提示并阻止操作。
  - 探测过程中以颜色或样式高亮当前桶、命中、空位与墓碑位。
- 示例验证：
  - `key = 12, buckets = 8` 的初始探测桶为 `4`（`12 % 8 = 4`）。
  - `key = -2, buckets = 8` 的初始探测桶为 `6`（`(-2 % 8 + 8) % 8 = 6`）。

## 11. UI 与样式改动（适配窄侧栏与数值输入）
- 侧栏输入组在窄屏下不再截断：
  - `.input-group` 采用 `flex-wrap: wrap`，允许控件自动换行。
  - `.input-field` 允许收缩并设置合理最小宽度，按钮保持自然大小。
- 哈希表页面的键输入改为数值类型：
  - `type="number"` + `step="1"` + `inputmode="numeric"`。
  - 占位与说明文案更新为“键为整数：哈希 = 键 mod 桶数”。

## 12. 学科导航与占位页
- 新增总导航页：`topics.html`（使用 `home.css` 统一卡片样式）。
  - 类别卡片：`数据结构`（链接到 `index.html`）、`组成原理`、`操作系统`、`计算机网络`（后三者暂为“即将推出”）。
- 新增占位页：
  - `arch.html`（计算机组成原理）：指令与编码、存储层次、流水线（占位卡片）。
  - `os.html`（操作系统）：进程与调度、内存管理、文件系统（占位卡片）。
  - `network.html`（计算机网络）：路由算法、协议栈、拥塞控制（占位卡片）。
- 可选：将默认首页指向 `topics.html`，或在数据结构首页增加返回总导航入口。

## 13. 指令与编码页面风格统一（IEEE 754 风格对齐）
**范围**：`ieee754.html` 已完成；本次新增对齐 `bases.html`（各种进制转换）与 `integer.html`（有符号/无符号 与 原/反/补）。

**视觉与交互改动**
- 移除居中黑色弹层，改为就地高亮与轻微脉冲提示。
- 右侧结果采用“三元素”布局：上方 Chips 标签（类型或编码名称），中部分组位串（等宽字体、边框与浅背景），下方为独立滚动的“计算过程”画布。
- 页面整体边框、圆角、阴影与间距与 IEEE 754 页面保持一致。

**功能增强**
- `bases.html`
  - 二进制输出按 4 位分组显示。
  - 新增“计算过程（手算演示）”：
    - 十进制 → 二进制：连续除以 2 取余，倒序写余数；展示十六进制按 4 位分组映射。
    - 二进制 → 十进制：权重求和 Σ(位×2^i)。
    - 十六进制/八进制 → 二进制：逐位映射（4 位/3 位）并组合。
  - 点击“计算”后同步渲染步骤说明。
- `integer.html`
  - 新增“计算过程（手算演示）”：
    - 无符号：取模 2^w 截断位宽。
    - 原码：符号位 + 数值位（范围检查）。
    - 反码：负数对正数位串按位取反，正数保持不变。
    - 补码：负数为取反 + 1（或模 2^w）；非负与无符号一致。

**验证**
- 本地访问：`http://localhost:8000/bases.html` 与 `http://localhost:8000/integer.html`。
- Chips、分组位串及“计算过程”滚动区域显示正常；按钮触发后会同时更新结果与手算步骤。

## 14. 流水线可视化（新增页面 `pipeline.html`）
**目标**：输入多条指令，可视化五级流水线（IF/ID/EX/MEM/WB）在有/无转发与不同分支解析阶段下的推进情况，并列出冲突（冒险）与插入气泡数。

**页面与脚本**
- 页面：`pipeline.html`（统一卡片风格、左右栏布局）。
- 脚本：`pipeline.js`（解析指令、调度阶段、渲染表格与冲突列表）。
- 导航改动：`arch.html` 将“流水线”卡片标记为“已上线”，并链接到 `pipeline.html`。

**输入与语法**
- 算术：`ADD/SUB/MUL/AND/OR Rd,Rs,Rt`（按 ALU 处理）。
- 访存：`LW Rd,imm(Rs)` / `SW Rt,imm(Rs)`。
- 分支：`BEQ Rs,Rt,T` 或 `BEQ Rs,Rt,NT`（T=取分支，NT=不取）。

**选项与策略**
- 转发：启用（EX/MEM→EX）或禁用。
- 分支解析阶段：ID（代价 1 周期）或 EX（代价 2 周期）。

**调度与冲突模型（简化、教学友好）**
- 顺序发射，每周期取一条（无结构冒险）。
- RAW 数据冒险：
  - 启用转发：ALU→ALU 相邻指令 0 气泡；`LW→use` 相邻指令 1 气泡（来自 MEM→EX 的前递）。
  - 禁用转发：生产者写回 (WB) 之前，使用者的 ID 不得读取寄存器；相邻 ALU/LW 生产者需要 2 气泡，间隔 2 条需 1 气泡，间隔 ≥3 条无需气泡。
- 控制冒险：取分支时对下一条插入解析阶段对应的气泡数（ID=1/EX=2），并在冲突列表中标注。

**渲染**
- 右侧为“阶段×周期”表：每行一条指令，列为周期编号；单元格显示阶段标签（IF/ID/EX/MEM/WB）。
- 下方列出“数据冒险/控制冒险”说明与插入气泡数量。

**验证**
- 本地访问：`http://localhost:8000/pipeline.html`。
- 示例：
  - 开启转发：`ADD R1,R2,R3` → `SUB R4,R1,R5` 无气泡；`LW R6,0(R1)` → `ADD R7,R6,R8` 插入 1 气泡。
  - 关闭转发：上述两例分别插入 2 气泡与 2 气泡。
  - 分支：`BEQ R1,R0,T` 后一条指令插入 1（或 2）气泡。

## 15. 指令与编码模块 UI 一致性改造（新增）
**范围**：`encoding.html` 聚合页、`instruction-format.html` 页面完成栅格宽屏与统一视觉改造；`bases.html` 与 `integer.html` 已在前次迭代完成。

**布局与视觉**
- 容器：`max-width: 1400px`、`width: 92vw`，居中。
- 内容：`CSS Grid` 的 `repeat(auto-fit, minmax(380px, 1fr))`，列间距 `20px`。
- 组件：表单控件圆角 `10px`、输出框 `output-box` 浅灰背景、mono 字体；chips 颜色增强对比度并统一阴影。
- 提示（hint）：颜色提升至 `#555`，字号 `14px`，提高可读性。

**可访问性与性能**
- 键盘导航可达；焦点样式可见；部分区域添加 `aria-label`。
- 性能目标：FCP < 1s，CLS < 0.1；仅使用原生 CSS/JS。

**验证**
- 本地访问：
  - 聚合页：`http://localhost:8000/encoding.html`
  - 指令格式占位：`http://localhost:8000/instruction-format.html`
- 预览验证：布局不再局促，输出区与说明占位均可见；移动端容器宽度降为 `96vw`，自动单列。

**规范文档**
- 新增：`encoding-ui-spec.md`，与 `pipeline-ui-spec.md` 一致风格，覆盖布局、组件、可访问性、性能与兼容性。

**后续建议**
- 继续对齐：`ieee754.html`、`hamming.html` 两页的栅格宽屏与视觉统一。
- 增补：聚合页可添加分组 chips 与模块卡片的 hover/active 状态，提高导航可扫描性。