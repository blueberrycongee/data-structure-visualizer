# 学习平台网站开发路线图（注册 / 充值 / 学习进度 / 鉴权）

## 核心目标
- 提供稳定的用户体系：注册、登录、身份鉴权、密码找回、邮箱验证
- 支持充值/付费：订阅/会员或次卡/余额两种计费模式，涵盖支付、订单、账单、发票
- 保存学习数据：按模块/课程/步骤记录学习进度、用时、正确率、解锁状态
- 付费分层鉴权：免费与付费用户的功能差异化与访问控制
- 确保安全与合规：数据安全、权限控制、防刷防爆破、日志与审计
- 具备可持续运营能力：可观测、备份、滚动发布、灰度与故障恢复

## 用户与权限模型
- 角色：`anonymous`（未登录）、`user_free`（注册用户）、`user_premium`（付费会员）、`admin`
- 权限域：`content_access`（可访问模块/页面）、`feature_use`（可使用某类功能）、`quota`（限额/次数）
- 策略：基于角色与订阅状态的策略表，按模块/功能点进行开关与限额配置

## 业务范围与里程碑
- MVP（4–6 周）：
  - 注册/登录/邮箱验证、基础鉴权（免费/付费）
  - 订单/支付闭环（含回调与失败重试）
  - 学习进度记录（模块→页面→步骤维度）
  - 管理后台（用户、订单、订阅、内容开关）
- 增强版（2–4 周）：
  - 充值余额/次卡、优惠券、活动码
  - 进度报表与学习曲线、勋章与成就系统
  - 团队/班级管理与共享进度

## 非功能性要求
- 可用性：注册/登录/支付接口可用性 ≥ 99.9%
- 性能：P95 接口响应 < 200ms（缓存命中场景），首屏 < 1.5s（CDN+预渲染）
- 安全：密码安全（Argon2/bcrypt）、令牌防窃用（短效+刷新）、CSRF 防护、速率限制与 IP 黑名单
- 合规：隐私政策、数据导出/删除能力、支付对账与发票

## 技术架构建议
- 前端：保留现有静态可视化页，逐步接入统一 UI 与鉴权门控（SSG/SSR 任选）
- 后端：Node.js（NestJS/Express）或 Go（Gin/Fiber）；REST API + Webhook；GraphQL 可选
- 数据库：PostgreSQL（主从+读写分离），缓存：Redis；对象存储：S3/OSS（用户资料、导出）
- 身份鉴权：JWT（短效）+ 刷新令牌；邮箱验证与重置；第三方登录（微信/QQ/GitHub）可选
- 支付：国内（微信支付/支付宝）与国际（Stripe），统一订单与支付回调接口
- 部署：容器化（Docker），环境分层（dev/staging/prod），CI/CD（GitHub Actions）
- 观测：集中日志（ELK/CloudWatch），指标（Prometheus+Grafana），异常追踪（Sentry）

## 数据模型（建议）
- `users`
  - id, email, phone, password_hash, email_verified_at, created_at
- `profiles`
  - user_id, display_name, avatar_url, locale, timezone
- `roles`
  - id, name（anonymous/user_free/user_premium/admin）
- `user_roles`
  - user_id, role_id, assigned_at
- `subscriptions`
  - id, user_id, plan_id, status（active/canceled/past_due），current_period_start/end
- `plans`
  - id, code, name, price, interval（monthly/annual），features（JSON）
- `orders`
  - id, user_id, amount, currency, item_type（plan/topup），status（pending/paid/failed），created_at
- `payments`
  - id, order_id, provider（wechat/alipay/stripe），provider_txn_id, status, webhook_payload（JSON）
- `wallets`
  - user_id, balance, last_txn_at
- `wallet_txns`
  - id, user_id, change, reason（topup/consume/refund），order_id，created_at
- `modules`
  - id, code, name（如 graph/kmp/bm/network-models），is_premium_only
- `lessons`
  - id, module_id, code, title, order_index, is_premium_only
- `progress`
  - id, user_id, module_id, lesson_id, step_key, status（started/completed），score，duration_ms，updated_at
- `feature_flags`
  - key, enabled, audience（role/tier），config（JSON）
- `audit_logs`
  - id, user_id, action, resource_type/id, meta（JSON）, created_at

## 鉴权与访问控制
- 登录态：`access_token`（短效 15–30min）+ `refresh_token`（长效 7–30d）
- 授权：后端中间件检查角色与订阅状态；页面侧“门禁组件”控制入口与降级
- 邮箱与密码流程：注册后要求邮箱验证；支持找回与重置，限制次数与速率
- 付费门控：模块与功能点按 `is_premium_only` 控制；含限额与试用（feature_flags）

## 支付/充值闭环
- 创建订单：`POST /orders`（用户、商品、金额）→ 返回支付链接/二维码
- 完成支付：第三方支付完成后回调 `POST /payments/webhook`（验签+去重）→ 更新 `orders/payments/subscriptions/wallets`
- 失败重试：支付失败/回调丢失场景，轮询+手动对账接口
- 发票与对账：生成电子凭证（国内平台开票或第三方发票 API），每日/每周对账报表

## 学习进度采集
- 事件模型：页面在关键操作（进入模块、开始/结束步骤、完成练习）上报事件
- 采集通道：`POST /progress/events`（批量/离线重传）
- 聚合：后端按用户/模块/课程维度计算进度百分比、最近学习时间、连续学习天数
- 展示：个人中心 + 管理后台报表；支持导出 CSV

## API 设计（示例）
- Auth：`POST /auth/signup`、`POST /auth/login`、`POST /auth/refresh`、`POST /auth/logout`、`POST /auth/forgot`、`POST /auth/reset`
- Users：`GET /users/me`、`PATCH /users/me`、`GET /users/:id`（admin）
- Plans & Subs：`GET /plans`、`POST /subscriptions`、`DELETE /subscriptions/:id`
- Orders/Payments：`POST /orders`、`GET /orders/:id`、`POST /payments/webhook`
- Content：`GET /modules`、`GET /lessons?module=:id`、`GET /flags`
- Progress：`POST /progress/events`、`GET /progress/summary`、`GET /progress/user/:id`（admin）
- Admin：`GET /admin/users`、`GET /admin/orders`、`GET /admin/audit`

## 与现有站点的融合计划
- 阶段接入：保持现有静态可视化页面不变，先加入统一头部与“门禁组件”（登录/付费提示）
- 渐进式采集：无侵入地在各页面挂载进度上报（开始/完成），先采集匿名，后绑定账号
- 统一主题：延用当前暗黑主题样式，新增“账号/订阅”入口与个人中心链接

## 安全与合规
- 密码：Argon2id 或 bcrypt，强密码策略与泄露检测
- 令牌：短效 + 绑定设备指纹（可选），刷新令牌旋转
- 输入校验：后端统一 DTO 校验；XSS/SQL 注入防护；CSRF 对表单与非幂等接口
- 速率限制：登录/重置/支付创建等敏感接口做 per-IP/per-user 限流
- 审计：订单与权限相关操作写入 `audit_logs`
- 备份：数据库每日快照，对象存储版本化；灾备演练

## 运维与发布
- 环境：dev/staging/prod，独立密钥与数据库
- 流程：PR→CI→自动测试→构建镜像→部署（蓝绿/滚更）
- 迁移：数据库 schema 迁移（例如 Prisma/Knex），版本标记与回滚策略
- 监控：核心接口可用性、支付成功率、登录成功率、错误分布与慢查询

## 项目里程碑与排期（建议）
- 第 0 周：需求与架构评审；数据模型敲定；技术栈选择；原型图
- 第 1–2 周：鉴权与用户体系（注册/登录/邮箱验证/重置）；个人中心初版
- 第 3–4 周：支付与订单闭环（微信/支付宝/Stripe）；订阅与会员态同步；管理后台
- 第 5 周：学习进度采集与报表；页面门禁接入（部分模块）
- 第 6 周：安全加固与灰度发布；备份与告警；性能优化与压测
- 第 7–8 周：充值余额/次卡、优惠券；试用/限额；团队/班级（可选）

## 风险与应对
- 支付回调丢失：签名验真+去重；补偿任务与对账工具
- 数据一致性：订单/支付/订阅采用事务与幂等键；最终一致的异步补偿
- 隐私与合规：明确隐私条款与数据导出/删除流程；日志脱敏
- 扩展性：计划支持更多支付渠道与第三方登录；模块化的权限与开关系统

## 后续演进
- 学习内容编排与测评体系（题库/练习/成就）
- 移动端与 PWA，离线学习与同步
- A/B 测试与推荐、学习路径规划
- 内容创作平台（教师/助手）与多角色协作