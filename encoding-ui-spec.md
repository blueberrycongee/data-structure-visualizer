# 指令与编码模块 UI 设计规范（Encoding Suite UI Spec）

本规范适用于 `encoding.html` 聚合页及其子模块页面（`bases.html`, `integer.html`, `ieee754.html`, `hamming.html`, `instruction-format.html`）。目标：统一布局与视觉、提升可访问性与性能，并确保与现有功能完全兼容。

## 布局
- 页面容器：`max-width: 1400px`，`width: 92vw`，居中，内边距 `24px`。
- 内容栅格：使用 `CSS Grid`，`grid-template-columns: repeat(auto-fit, minmax(380px, 1fr))`，列间距 `20px`。
- 卡片/区块：统一 `border-radius: 12px`，边框 `1px solid #e0e0e0`，阴影 `0 2px 6px rgba(0,0,0,0.04)`。

## 组件
- 表单控件：`padding: 12px`，`border-radius: 10px`，边框 `#d0d0d0`，标签 `font-weight: 600`。
- 输出框（output-box）：背景 `#f7f7f9`，边框 `#eee`，圆角 `10px`，最小高度 `44px`。
- 栅格行（grid）：字段列宽 `180–200px`，内容列自适应，行距 `10px`，垂直居中。
- Mono 字体：`Consolas, Monaco, monospace`，保留 `white-space: nowrap` 与横向滚动。
- Chips：蓝/绿/橙/灰四类，增强对比度，圆角胶囊，轻阴影，边框色略深以提升层次。

## 视觉与排版
- 正文字号 `14px`，行高 `1.5`；标题在页面头部与卡片顶部保持 8–16px 间距。
- 提示文字（hint）：`#555`，字号 `14px`，避免过浅灰影响可读性。

## 交互与响应式
- 容器在 `768px` 以下设备宽度调整为 `96vw`；栅格自动单列。
- 重要输出区域保留滚动而非强制换行，避免信息丢失与布局抖动。

## 可访问性（WCAG 2.1 AA）
- 文本/背景对比度符合 AA 要求（至少 4.5:1）；chips 与按钮颜色增强对比度。
- 键盘可达：控件顺序合理，重点控件可通过 Tab 导航；按钮与链接可见焦点状态。
- 语义结构：标题层级合理，列表与说明使用语义标签；必要处添加 `aria-label`。

## 性能目标
- 首次内容绘制（FCP）< 1s；累计布局偏移（CLS）< 0.1。
- 仅使用原生 CSS/JS，无外部库；减少阻塞渲染的样式与脚本。

## 兼容性
- 保留历史 ID/类名以兼容现有脚本（例如 `encoding.js`、页面内脚本）。
- 不重命名已被脚本引用的元素；仅调整布局与视觉样式。

## 组件指南（示例）
- Bases：输入与结果两列栅格，字段列固定宽度，输出框 mono 字体。
- Integer：左侧输入区、右侧输出与计算过程；chips 标注编码类型。
- IEEE754：上下两个转换分区；输出栅格包含 Sign/Exp/Frac/Bitstring 卡片。
- Hamming：左侧输入与参数，右侧码字/校验/纠错结果；底部规则说明。
- Instruction-Format：chips 标注类型，左侧结构说明，右侧字段/位串占位输出。

## 变更记录
- v1.0 初版：统一栅格布局、控件样式与 chips 视觉；提升 hint 对比度；移动端容器宽度优化。