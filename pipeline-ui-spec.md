# 流水线可视化 · 视觉设计规范

本规范描述 `pipeline.html` 的视觉与交互标准，确保跨设备一致体验与 WCAG 2.1 AA 无障碍达标。

## 布局
- 页面宽度：`max-width: 1400px`，`width: 92vw`。
- 栅格系统：`grid-template-columns: repeat(auto-fit, minmax(380px, 1fr))`，间距 `20px`。
- 内容区内边距：不小于 `16px`；模块圆角：`12px`。

## 文字与字号
- 正文：`14px`（行高 1.5）。
- 标题：主标题 `22px`，副标题 ≥ `18px`。
- 代码/表格：使用 `Consolas/Monaco` 等等宽字体。

## 表格与行高
- 表格单元格：左右内边距 `10–12px`，最小行高 `40px`。
- 固定列：`position: sticky; left: 0;` 背景 `#f7f7f7`，确保 CLS < 0.1。

## 色彩与对比
- 阶段标签（IF/ID/EX/MEM/WB/STALL）背景与文本对比度 ≥ 4.5:1。
- 交互元素聚焦态：`outline: 2px solid #4f46e5; outline-offset: 2px;`。

## 交互
- 标签页：`role=tablist/tab/tabpanel`，支持键盘左右方向切换。
- 智能缩放：在 `#pipe-grid` 内按 `transform: scale()` 自动适配，最小缩放 `0.6`，原点左上角。
- 动画：过渡 `transform/opacity 180ms`；`prefers-reduced-motion` 时禁用动画。

## 响应式
- `@media (max-width: 768px)`：页面宽度 `96vw`，文本区高度加大。
- 表格容器高度：`clamp(360px, 55vh, 600px)`。

## 无障碍（WCAG 2.1 AA）
- 所有交互元素可键盘访问；标签页具备 ARIA 属性与 `aria-selected` 状态。
- 危险列表容器 `aria-live=polite`，内容更新时可被读屏感知。

## 性能
- 首屏仅加载必要样式与脚本；避免大体积库。
- 保留容器高度与列宽，减少布局抖动，目标 `FCP < 1s`、`CLS < 0.1`。

## 兼容性
- 样式与脚本均使用标准特性，已在 Chrome/Firefox/Safari/Edge 测试通过（桌面端）。

## 组件规范
- Chip：内边距 `6×10`、中性边框 `#e5e7eb`、阴影 `0 1px 2px`。
- Tab：默认 `#f8fafc`，选中 `#e6f1ff`；边框 `#dbe1ea`；圆角 `8px`。
- Button：继承页面按钮样式，最小触达面积 `44×44`。