# 数据结构与算法可视化器 - 设计系统规范

## 概述

本设计系统为数据结构与算法可视化器提供了一套完整、一致、可扩展的视觉语言。基于原子设计方法论，我们构建了一个模块化的组件库，支持深色/浅色主题切换，并确保在各种设备和屏幕尺寸上都能提供优秀的用户体验。

## 设计原则

### 1. 一致性 (Consistency)
- 统一的视觉语言和设计模式
- 标准化的间距、色彩和排版
- 一致的交互行为和反馈

### 2. 可访问性 (Accessibility)
- 遵循WCAG 2.1 AA标准
- 支持键盘导航和屏幕阅读器
- 高对比度模式和减少动画选项

### 3. 响应性 (Responsiveness)
- 移动优先的设计理念
- 流畅的断点过渡
- 触摸友好的交互元素

### 4. 可扩展性 (Scalability)
- 模块化的CSS架构
- CSS自定义属性支持
- 主题系统的灵活性

## 设计系统架构

### 原子设计层次

```
原子 (Atoms) → 分子 (Molecules) → 有机体 (Organisms) → 模板 (Templates) → 页面 (Pages)
```

#### 原子组件 (Atoms)
- **按钮**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`
- **输入框**: `.form-input`, `.form-label`, `.form-help`
- **徽章**: `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`
- **卡片**: `.card`, `.card-header`, `.card-body`, `.card-footer`

#### 分子组件 (Molecules)
- **表单组**: `.form-group` - 标签 + 输入框 + 帮助文本
- **导航栏**: `.navbar`, `.nav-link`, `.breadcrumb`
- **数据卡片**: `.data-card` - 专门为数据结构设计的卡片组件
- **模态框**: `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`

#### 有机体组件 (Organisms)
- **头部**: `.header` - 包含品牌、导航和操作按钮
- **侧边栏**: `.sidebar` - 导航和功能菜单
- **数据网格**: `.data-grid` - 数据结构卡片的网格布局
- **可视化画布**: `.visualization-canvas` - 算法可视化区域

## 色彩系统

### 主色调 (Primary)
```css
--color-primary-50:  #f0f9ff;
--color-primary-100: #e0f2fe;
--color-primary-500: #0ea5e9; /* 主色 */
--color-primary-600: #0284c7; /* 悬停 */
--color-primary-900: #0c4a6e; /* 激活 */
```

### 状态色 (Status)
```css
--color-success-500: #22c55e;  /* 成功 */
--color-warning-500: #f59e0b;  /* 警告 */
--color-error-500:   #ef4444;  /* 错误 */
--color-accent-500:  #f59e0b;  /* 强调 */
```

### 中性色 (Neutral)
```css
--color-neutral-50:  #fafafa;   /* 背景 */
--color-neutral-500: #737373;   /* 边框 */
--color-neutral-700: #404040;   /* 次要文字 */
--color-neutral-900: #171717;   /* 主要文字 */
```

## 间距系统

基于4px网格系统，提供一致的视觉节奏：

```css
--space-1:  4px;   /* 最小间距 */
--space-2:  8px;   /* 小组件间距 */
--space-4:  16px;  /* 标准间距 */
--space-6:  24px;  /* 组件间距 */
--space-8:  32px;  /* 大组件间距 */
--space-12: 48px;  /* 区块间距 */
--space-16: 64px;  /* 最大间距 */
```

## 字体系统

### 字体族
```css
--font-family-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-family-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
```

### 字体大小
```css
--font-size-xs:   0.75rem;   /* 12px - 标签 */
--font-size-sm:   0.875rem;  /* 14px - 辅助文字 */
--font-size-base: 1rem;      /* 16px - 正文 */
--font-size-lg:   1.125rem;  /* 18px - 强调文字 */
--font-size-xl:   1.25rem;   /* 20px - 小标题 */
--font-size-2xl:  1.5rem;    /* 24px - 三级标题 */
--font-size-3xl:  1.875rem;  /* 30px - 二级标题 */
--font-size-4xl:  2.25rem;   /* 36px - 一级标题 */
```

### 行高
```css
--line-height-tight:  1.25;   /* 标题 */
--line-height-normal: 1.5;    /* 正文 */
--line-height-relaxed: 1.625; /* 长文 */
```

## 圆角系统

```css
--border-radius-sm:  0.125rem;  /* 2px  - 小圆角 */
--border-radius-md:  0.375rem;  /* 6px  - 标准圆角 */
--border-radius-lg:  0.5rem;    /* 8px  - 大圆角 */
--border-radius-xl:  0.75rem;   /* 12px - 卡片圆角 */
--border-radius-2xl: 1rem;      /* 16px - 按钮圆角 */
--border-radius-full: 9999px;   /* 完全圆角 */
```

## 阴影系统

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);     /* 小阴影 */
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);   /* 标准阴影 */
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1); /* 大阴影 */
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1); /* 超大阴影 */
```

## 动画与过渡

### 过渡时长
```css
--transition-duration-fast:   150ms;  /* 快速 */
--transition-duration-normal: 300ms;  /* 标准 */
--transition-duration-slow:   500ms;  /* 缓慢 */
```

### 缓动函数
```css
--transition-timing-function-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* 标准 */
--transition-timing-function-out:    cubic-bezier(0, 0, 0.2, 1);   /* 减速 */
```

## 响应式断点

```css
--breakpoint-xs: 475px;   /* 超小屏幕 */
--breakpoint-sm: 640px;   /* 小屏幕 */
--breakpoint-md: 768px;   /* 中等屏幕 */
--breakpoint-lg: 1024px;  /* 大屏幕 */
--breakpoint-xl: 1280px;  /* 超大屏幕 */
```

## 主题系统

### 浅色主题
```css
[data-theme="light"] {
  --color-background: var(--color-neutral-50);
  --color-text-primary: var(--color-neutral-900);
  --color-border: var(--color-neutral-200);
  --color-shadow: rgba(0, 0, 0, 0.1);
}
```

### 深色主题
```css
[data-theme="dark"] {
  --color-background: var(--color-neutral-950);
  --color-text-primary: var(--color-neutral-100);
  --color-border: var(--color-neutral-700);
  --color-shadow: rgba(0, 0, 0, 0.3);
}
```

## 组件规范

### 按钮组件

#### 基础按钮
```html
<button class="btn">基础按钮</button>
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-outline">轮廓按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>
```

#### 尺寸变体
```html
<button class="btn btn-sm">小按钮</button>
<button class="btn">标准按钮</button>
<button class="btn btn-lg">大按钮</button>
```

#### 状态变体
```html
<button class="btn" disabled>禁用按钮</button>
<button class="btn btn-loading">加载中</button>
```

### 卡片组件

#### 基础卡片
```html
<div class="card">
  <div class="card-header">
    <h3>卡片标题</h3>
  </div>
  <div class="card-body">
    <p>卡片内容</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">操作</button>
  </div>
</div>
```

#### 数据卡片
```html
<div class="data-card">
  <div class="data-card-header">
    <h4>数据结构名称</h4>
    <span class="badge badge-success">O(n log n)</span>
  </div>
  <div class="data-card-body">
    <p>算法描述和复杂度信息</p>
  </div>
  <div class="data-card-footer">
    <button class="btn btn-primary">开始演示</button>
  </div>
</div>
```

### 表单组件

#### 表单组
```html
<div class="form-group">
  <label class="form-label">邮箱地址</label>
  <input type="email" class="form-input" placeholder="请输入邮箱">
  <div class="form-help">我们不会分享您的邮箱地址</div>
</div>
```

#### 表单验证状态
```html
<div class="form-group form-group-success">
  <label class="form-label">用户名</label>
  <input type="text" class="form-input" value="valid_user">
  <div class="form-feedback">用户名可用</div>
</div>
```

## 图标系统

### 数据结构图标
- `icon-array` - 数组
- `icon-linked-list` - 链表
- `icon-stack` - 栈
- `icon-queue` - 队列
- `icon-binary-tree` - 二叉树
- `icon-avl-tree` - AVL树
- `icon-red-black-tree` - 红黑树
- `icon-b-tree` - B树
- `icon-heap` - 堆
- `icon-hash-table` - 哈希表
- `icon-graph` - 图
- `icon-trie` - 字典树

### 算法图标
- `icon-sort` - 排序
- `icon-search` - 搜索
- `icon-dfs` - 深度优先搜索
- `icon-bfs` - 广度优先搜索
- `icon-dijkstra` - Dijkstra算法
- `icon-binary-search` - 二分查找
- `icon-merge` - 合并
- `icon-partition` - 分区

## 使用指南

### 快速开始

1. **引入CSS文件**
```html
<link rel="stylesheet" href="assets/css/design-tokens.css">
<link rel="stylesheet" href="assets/css/design-system.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/molecules.css">
<link rel="stylesheet" href="assets/css/organisms.css">
<link rel="stylesheet" href="assets/css/theme-enhanced.css">
<link rel="stylesheet" href="assets/css/icons.css">
<link rel="stylesheet" href="assets/css/responsive.css">
```

2. **引入JavaScript**
```html
<script src="assets/js/theme-manager.js"></script>
```

3. **初始化主题管理器**
```javascript
const themeManager = new ThemeManager();
```

### 自定义主题

#### 创建新主题
```css
[data-theme="custom"] {
  --color-primary-500: #your-color;
  --color-background: #your-background;
  /* 更多自定义变量 */
}
```

#### 动态切换主题
```javascript
themeManager.applyTheme('custom');
```

### 响应式开发

#### 移动优先的媒体查询
```css
.my-component {
  /* 移动端样式 */
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .my-component {
    /* 平板端样式 */
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .my-component {
    /* 桌面端样式 */
    padding: var(--space-8);
  }
}
```

#### 响应式工具类
```html
<div class="responsive-sm:text-lg responsive-md:text-xl">
  响应式文字大小
</div>
```

## 浏览器兼容性

### 支持的浏览器
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### CSS特性支持
- CSS自定义属性 (CSS Variables)
- CSS Grid布局
- CSS Flexbox布局
- CSS过渡和动画
- CSS伪元素

### 降级处理
- 提供基础样式作为降级方案
- 使用特性检测而非浏览器检测
- 渐进增强的设计理念

## 性能优化

### CSS优化
- 使用CSS自定义属性减少重复代码
- 合理的文件拆分和加载策略
- 避免深层嵌套选择器
- 使用高效的CSS选择器

### JavaScript优化
- 事件委托减少事件监听器
- 防抖和节流优化高频事件
- 懒加载非关键资源
- 使用Web Workers处理复杂计算

### 图片优化
- 使用SVG格式的图标
- 响应式图片加载
- 图片懒加载
- 适当的图片压缩

## 可访问性

### 键盘导航
- 所有交互元素都可通过键盘访问
- 合理的Tab顺序
- 可见的焦点指示器
- 跳过导航链接

### 屏幕阅读器支持
- 语义化的HTML结构
- 适当的ARIA标签
- 替代文本描述
- 动态内容更新通知

### 色彩对比
- 文字与背景对比度至少4.5:1
- 大文字对比度至少3:1
- 非文字元素对比度至少3:1
- 提供高对比度模式

## 设计文档

### 组件文档
每个组件都包含：
- 组件说明和用途
- 视觉示例和变体
- 代码示例和使用方法
- 可访问性要求
- 响应式行为

### 设计Token
所有设计决策都通过CSS自定义属性记录：
- 色彩Token
- 间距Token
- 字体Token
- 动画Token

### 使用示例
提供完整的使用示例：
- 基础用法
- 高级配置
- 自定义主题
- 响应式适配

## 维护与更新

### 版本控制
- 使用语义化版本号
- 详细的变更日志
- 向后兼容性保证
- 废弃功能警告

### 贡献指南
- 代码风格规范
- 提交信息格式
- 测试要求
- 文档更新要求

### 测试策略
- 跨浏览器测试
- 响应式测试
- 可访问性测试
- 性能测试

## 总结

本设计系统为数据结构与算法可视化器提供了完整的设计解决方案，确保了：

1. **一致性**: 统一的视觉语言和交互模式
2. **可扩展性**: 模块化的架构支持未来扩展
3. **可维护性**: 清晰的代码结构和文档
4. **可访问性**: 包容性的设计考虑
5. **性能**: 优化的加载和渲染性能

通过使用这个设计系统，开发者可以快速构建美观、一致、高性能的用户界面，专注于业务逻辑的实现而不是样式细节的处理。