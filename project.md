# garden-admin 项目文档

## 1. 项目概述

`garden-admin` 是 **我的花园** 电商平台的后台管理系统前端项目，基于 Vue 3 + Vite + Element Plus 构建，提供商品、订单、用户、会员、营销、系统等模块的管理能力。

- **项目名称**: `cosmetics-shop-admin`
- **版本**: `1.0.0`
- **应用标题**: 我的花园-管理后台
- **基础路径**: `/admin/`
- **开发端口**: `5174`
- **代理目标后端**: `http://localhost:3001`

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 4.x |
| UI 组件库 | Element Plus 2.x |
| 状态管理 | Pinia 2.x |
| 路由 | Vue Router 4.x |
| 网络请求 | Axios |
| 图表 | ECharts 5.x |
| 日期处理 | dayjs |
| 样式 | SCSS |
| 图标 | @element-plus/icons-vue |
| 容器化 | Docker + Nginx |

---

## 3. 目录结构

```
garden-admin/
├── README.md                 # 项目说明
├── .gitignore                # Git 忽略规则
├── admin/                    # 前端源码目录
│   ├── Dockerfile            # Docker 多阶段构建配置
│   ├── nginx.conf            # Nginx 部署配置
│   ├── index.html            # HTML 入口
│   ├── package.json          # 依赖与脚本
│   ├── package-lock.json     # 锁定依赖版本
│   ├── vite.config.js        # Vite 配置
│   ├── dist/                 # 生产构建产物（已忽略）
│   └── src/
│       ├── main.js           # 应用入口
│       ├── App.vue           # 根组件
│       ├── router/index.js   # 路由配置
│       ├── layout/index.vue  # 后台布局（侧边栏 + 顶部 + 主内容）
│       ├── utils/request.js  # Axios 封装（Token、拦截器、图片修复）
│       └── views/            # 页面视图
│           ├── login/index.vue
│           ├── dashboard/index.vue
│           ├── product/
│           │   ├── list.vue      # 商品列表/编辑/SKU
│           │   └── category.vue  # 商品分类
│           ├── order/list.vue
│           ├── user/list.vue
│           ├── member/
│           │   ├── level.vue     # 会员等级
│           │   ├── period.vue    # 考核期
│           │   └── user.vue      # 会员详情/部门业绩
│           ├── marketing/
│           │   ├── banner.vue           # Banner 管理
│           │   ├── coupon.vue           # 优惠券管理
│           │   ├── quick-entry.vue      # 快捷入口
│           │   ├── product-recommend.vue # 商品推荐
│           │   └── hot-products.vue     # 热销商品
│           └── system/dict.vue          # 字典管理
```

---

## 4. 核心配置

### 4.1 Vite 配置 (`admin/vite.config.js`)

- `base: '/admin/'`：应用部署在 `/admin/` 子路径下。
- 路径别名 `@` 指向 `src` 目录。
- 开发服务器监听 `0.0.0.0:5174`。
- 代理配置：
  - `/api` → `http://localhost:3001`
  - `/uploads` → `http://localhost:3001`

### 4.2 Nginx 配置 (`admin/nginx.conf`)

- 监听 `80` 端口。
- 静态资源根目录：`/usr/share/nginx/html/admin`。
- 支持 Vue Router 的 `history` 模式（`try_files` 回退到 `index.html`）。

### 4.3 Dockerfile

- **构建阶段**: 使用 `node:18-alpine` 安装依赖并执行 `npm run build`。
- **运行阶段**: 使用 `nginx:alpine`，将构建产物复制到 `/usr/share/nginx/html/admin`，并覆盖默认 Nginx 配置。
- 暴露端口 `80`。

---

## 5. 应用入口与全局设置

### 5.1 `main.js`

- 创建 Vue 应用实例。
- 注册所有 Element Plus 图标组件。
- 挂载 Pinia、Vue Router、Element Plus（使用中文语言包 `zh-cn`）。

### 5.2 `App.vue`

- 仅包含 `<router-view />`。
- 全局样式重置：移除默认边距、设置 `box-sizing: border-box`、全屏高度。
- 覆盖 Element Plus 部分组件样式（`el-select`、`el-input` 宽度等），统一表单控件尺寸为 200px。

---

## 6. 路由与权限

### 6.1 路由结构 (`src/router/index.js`)

- 使用 `createWebHistory('/admin')`，基础路径为 `/admin`。
- 登录页 `/login` 为独立页面。
- 其他页面均挂载在布局组件 `Layout` 下，路径以 `/` 为根。

| 模块 | 路径 | 页面 |
|------|------|------|
| 首页 | `/dashboard` | `dashboard/index.vue` |

> 注：其他功能页面（商品、订单、用户、会员、营销、系统）的视图文件仍保留在 `src/views/` 中，但已从路由与侧边栏菜单中移除，无法直接访问。

### 6.2 路由守卫

- 根据路由 `meta.title` 动态设置页面标题：`{title} - 我的花园管理后台`。
- 校验 `localStorage` 中的 `admin_token`：未登录且非登录页时，重定向到 `/login`。

---

## 7. 布局组件 (`src/layout/index.vue`)

- 采用经典后台布局：`el-container` + `el-aside` + `el-header` + `el-main`。
- **侧边栏**:
  - 宽度可在 `220px` 与 `64px` 间切换（折叠）。
  - Logo 区域：展开显示“我的花园”，折叠显示“花园”。
  - 背景色 `#304156`，文字色 `#bfcbd9`，激活色 `#ff4a8d`。
  - 菜单与路由完全对应，当前仅保留「首页」入口。
- **顶部栏**:
  - 左侧折叠按钮。
  - 右侧用户头像 + 昵称下拉，支持退出登录。
- 退出登录时清除 `admin_token` 和 `admin_username`，跳转登录页。

---

## 8. 网络请求封装 (`src/utils/request.js`)

- 基于 Axios 创建实例：
  - `baseURL: '/api'`
  - `timeout: 10000`
- **请求拦截器**: 从 `localStorage` 读取 `admin_token`，自动添加 `Authorization: Bearer {token}` 请求头。
- **响应拦截器**:
  - 仅当 `code` 为 `0` 或 `200` 时返回 `res.data`。
  - 否则通过 `ElMessage.error` 提示错误。
- **401 处理**: 清除 Token 并重定向到 `/admin/login`。
- **图片 URL 修复**:
  - 基础域名 `https://xiaodigua.shop`。
  - 对占位图或无效图片返回 `picsum.photos` 随机图或空字符串。

---

## 9. 各模块功能详解

### 9.1 登录页 (`login/index.vue`)

- 页面背景为粉色渐变（`#ff4a8d` → `#ff6b9d`）。
- 登录表单字段：账号、密码。
- 登录接口：`POST /api/auth/admin-login`。
- 登录成功后保存 `admin_token`、`adminUser`，并跳转到首页。

### 9.2 首页占位页 (`dashboard/index.vue`)

- 当前首页为空白占位页，不展示任何业务数据与功能入口。
- 保留最小化样式容器，方便后续扩展。

### 9.3 商品管理

#### 9.3.1 商品列表 (`product/list.vue`)

- **筛选条件**：商品名称、分类（级联选择）、商品状态、商品标签（推荐/热卖/新品）。
- **表格展示**：ID、封面图、商品信息、分类、售价、原价、库存、销量、状态、操作。
- **操作**：编辑、复制、上架/下架、删除。
- **批量操作**：批量上架、批量下架、批量删除（支持勾选）。
- **商品详情抽屉**：展示商品完整信息、SKU 规格、图片列表。
- **添加/编辑弹窗**：
  - 基本信息页签：名称、分类、副标题、售价、原价、库存、单位、标签、状态。
  - 商品图片页签：最多上传 10 张，支持设置封面。
  - SKU 规格页签：自定义规格名称与规格值，生成笛卡尔积 SKU 组合。
  - 商品详情页签：富文本/简洁模式 HTML 描述。
- 涉及接口：
  - `GET /category/tree`
  - `GET /product/list`
  - `DELETE /product/{id}`
  - `PUT /product/{id}/status`
  - `PUT /product/{id}`
  - `POST /product`
  - `PUT /product/batch-status`
  - `POST /upload/image`

#### 9.3.2 分类管理 (`product/category.vue`)

- 卡片式展示一级分类与二级分类。
- 支持添加、编辑、删除、启停用分类。
- 分类支持上传图标。
- 涉及接口：
  - `GET /category/tree`
  - `POST /category`
  - `PUT /category/{id}`
  - `DELETE /category/{id}`
  - `POST /upload/image`

### 9.4 订单管理 (`order/list.vue`)

- **筛选条件**：订单状态、支付状态、订单号、下单时间范围。
- **导出功能**：生成 CSV 文件下载。
- **表格展示**：订单号、用户信息、商品信息、金额、状态、支付渠道、下单时间、操作。
- **订单详情弹窗**：基本信息、收货信息、物流信息、商品信息、费用信息、备注。
- **发货弹窗**：选择快递公司、填写快递单号。
- **物流轨迹弹窗**：时间线展示物流节点。
- **退款 / 模拟支付回调**：支持已付款/已发货订单退款，支持待付款订单模拟支付成功。
- 涉及接口：
  - `GET /order/admin/list`
  - `GET /order/{id}`
  - `PUT /order/admin/{id}/ship`
  - `GET /order/admin/{id}/tracking`
  - `PUT /order/admin/{id}/refund`
  - `POST /payment/mock/success`
  - `GET /api/order/admin/export`

### 9.5 用户管理 (`user/list.vue`)

- **筛选条件**：用户 ID、手机号、用户状态。
- **表格展示**：用户 ID、头像昵称、手机号、性别、OpenID、状态、登录/注册时间、操作。
- **操作**：查看详情、跳转会员、启用/禁用。
- **用户详情弹窗**：基本信息、登录信息、等级与积分。
- 涉及接口：
  - `GET /user/admin/list`
  - `GET /user/admin/{id}`
  - `PUT /user/admin/{id}/status`

### 9.6 会员中心

#### 9.6.1 会员等级 (`member/level.vue`)

- 表格展示：ID、等级名称、折扣率、权益描述、排序、状态、操作。
- 支持添加、编辑、删除会员等级。
- 涉及接口：
  - `GET /member/admin/levels`
  - `POST /member/admin/levels`
  - `PUT /member/admin/levels/{id}`
  - `DELETE /member/admin/levels/{id}`

#### 9.6.2 考核期管理 (`member/period.vue`)

- 表格展示：ID、期数编码、期数名称、时间范围、合格门槛、状态、操作。
- 支持添加、编辑、删除考核期。
- 涉及接口：
  - `GET /member/admin/periods`
  - `POST /member/admin/periods`
  - `PUT /member/admin/periods/{id}`
  - `DELETE /member/admin/periods/{id}`

#### 9.6.3 会员详情 (`member/user.vue`)

- 通过用户 ID 查询会员信息。
- 展示：用户基本信息、会员等级、累计下单、累计节省、团队统计（直属/二级/总人数）。
- 支持修改会员等级与上级用户 ID。
- **部门业绩**：按考核期展示部门名称、负责人、总人数、总业绩、有效业绩、状态，支持编辑。
- 支持重新计算部门业绩。
- 涉及接口：
  - `GET /member/admin/levels`
  - `GET /member/admin/periods`
  - `GET /member/admin/users/{id}`
  - `PUT /member/admin/users/{id}`
  - `GET /member/admin/departments`
  - `POST /member/admin/departments/recalculate`
  - `PUT /member/admin/departments/{id}`
  - `POST /member/admin/departments/upsert`

### 9.7 营销管理

#### 9.7.1 Banner 管理 (`marketing/banner.vue`)

- 表格展示：ID、图片、标题、跳转类型、跳转内容、排序、状态、操作。
- 跳转类型：无跳转、商品、分类、链接。
- 支持上传 Banner 图片（建议 750x400）。
- 涉及接口：
  - `GET /banner/admin`
  - `POST /banner`
  - `PUT /banner/{id}`
  - `DELETE /banner/{id}`
  - `POST /upload/image`

#### 9.7.2 优惠券管理 (`marketing/coupon.vue`)

- **筛选条件**：优惠券名称、类型（满减/折扣/无门槛）、状态。
- **表格展示**：ID、优惠券信息、优惠内容、发行量、已领取、已使用、有效期、状态、操作。
- **操作**：编辑、上架/下架、发放、删除。
- **添加/编辑弹窗**：名称、类型、优惠金额/折扣、使用门槛、发行总量、每人限领、有效期、描述、状态。
- **发放弹窗**：通过手机号查找用户，指定发放数量。
- 涉及接口：
  - `GET /coupon/admin/list`
  - `POST /coupon/admin`
  - `PUT /coupon/admin/{id}`
  - `DELETE /coupon/admin/{id}`
  - `GET /user/admin/search`
  - `POST /coupon/admin/grant`

#### 9.7.3 快捷入口 (`marketing/quick-entry.vue`)

- 表格展示：ID、图标、标题、类型、跳转内容、排序、状态、操作。
- 支持配置背景色、上传图标（建议 100x100）。
- 涉及接口：
  - `GET /quick-entry/admin`
  - `POST /quick-entry`
  - `PUT /quick-entry/{id}`
  - `DELETE /quick-entry/{id}`
  - `POST /upload/image`

#### 9.7.4 商品推荐 (`marketing/product-recommend.vue`)

- 管理首页推荐商品列表。
- 通过弹窗从商品库中选择商品批量添加。
- 自动过滤已添加商品。
- 涉及接口：
  - `GET /product-recommend/admin`
  - `GET /product/{id}`
  - `GET /product/list`
  - `POST /product-recommend`
  - `PUT /product-recommend/{id}`
  - `DELETE /product-recommend/{id}`

#### 9.7.5 热销商品 (`marketing/hot-products.vue`)

- 管理与首页热销区对应的商品列表。
- 功能与商品推荐类似，使用 `recommend_type: 'hot'`。
- 涉及接口：
  - `GET /product-recommend/hot-admin`
  - `GET /product/{id}`
  - `GET /product/list`
  - `POST /product-recommend`
  - `PUT /product-recommend/{id}`
  - `DELETE /product-recommend/{id}`

### 9.8 系统管理

#### 9.8.1 字典管理 (`system/dict.vue`)

- 左右布局：左侧字典列表 + 添加表单，右侧字典项列表。
- 支持新增字典、新增字典项、编辑/删除字典项、启停用字典项。
- 涉及接口：
  - `GET /dict/list`
  - `GET /dict/item`
  - `POST /dict`
  - `POST /dict/item`
  - `PUT /dict/item/{id}`
  - `DELETE /dict/{id}`
  - `DELETE /dict/item/{id}`

---

## 10. 通用交互规范

- 列表页通常包含：筛选表单 + 数据表格 + 分页器。
- 新增/编辑通常使用 `el-dialog` 弹窗。
- 删除操作均通过 `ElMessageBox.confirm` 二次确认。
- 成功/失败操作通过 `ElMessage` 提示。
- 表格加载状态使用 `v-loading`。
- 图片上传统一调用 `/upload/image`，部分页面拼接 `https://xiaodigua.shop` 前缀。
- 金额字段统一保留两位小数，千分位格式化展示。

---

## 11. 构建与部署

### 11.1 本地开发

```bash
cd admin
npm install
npm run dev
```

开发服务器地址：`http://localhost:5174/admin/`

### 11.2 生产构建

```bash
cd admin
npm run build
```

构建产物输出到 `admin/dist/` 目录。

### 11.3 Docker 部署

```bash
docker build -t garden-admin .
docker run -p 80:80 garden-admin
```

---

## 12. 后端接口前缀说明

所有业务接口均通过 Vite 代理到 `http://localhost:3001`，前端代码中统一以 `/api` 为前缀（已在 `request.js` 中设置 `baseURL`）。

- 例如代码中 `request.get('/product/list')` 实际请求 `http://localhost:3001/api/product/list`。
- 图片上传返回相对路径时，部分模块拼接为 `https://xiaodigua.shop{url}`。

---

## 13. 注意事项

1. `package-lock.json` 已纳入版本控制，建议使用 `npm ci` 安装依赖。
2. 生产部署路径为 `/admin/`，Nginx 已配置 `try_files` 支持 History 路由。
3. 当前 `.gitignore` 已忽略 `node_modules/`、`dist/`、`.env`、IDE 配置等不需要提交的文件。
4. 图片域名 `https://xiaodigua.shop` 与本地代理 `/uploads` 可能存在环境差异，部署时需确认。
5. 部分页面（如商品列表）保留了模拟数据生成函数 `generateMockData`，但默认使用真实 API。
