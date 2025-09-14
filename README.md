# FIT5032 Youth Wellbeing Web Application

A Vue 3 + Vite based web application developed as part of the FIT5032 assignment.  
The project focuses on youth mental health and wellbeing, implementing journaling, mood tracking, and community support features.

This README provides setup instructions, project structure, and mapping to **Business Requirements (BR A & B)** as specified in the course documentation.

---

## Getting Started

### Prerequisites

- **Node.js ≥ 18** (LTS recommended)  
  Check your version:
  ```bash
  node -v
  ```
- **npm** (default package manager for this project)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd fit5032-mainproject

# Install exact dependencies from package-lock.json
npm ci
# or, if npm ci fails
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
fit5032-mainproject/
├─ public/                # Static assets (e.g., favicon)
├─ src/
│  ├─ components/         # Shared UI components
│  │  ├─ common/AppHeader.vue
│  │  └─ AppFooter.vue
│  ├─ pages/              # Route-based views
│  │  ├─ HomePage.vue
│  │  ├─ AuthPage.vue          # Includes form validation (BR B.1)
│  │  ├─ JournalCompose.vue    # Write journal (BR B.2, LocalStorage draft)
│  │  └─ JournalList.vue       # View/search/filter journals (BR B.2)
│  ├─ router/
│  │  └─ index.js              # Vue Router configuration
│  ├─ styles/
│  │  └─ theme.css             # Bootstrap overrides and custom styles
│  ├─ utils/
│  │  └─ journalStore.js       # LocalStorage utilities (BR B.2)
│  ├─ App.vue                  # App shell with router-view
│  └─ main.js                  # App entry point
├─ index.html                  # HTML template (includes Bootstrap CDN)
├─ vite.config.js              # Vite configuration
├─ package.json                # Scripts and dependencies
└─ package-lock.json           # Locked dependency versions
```

---

## Tech Stack

- **Vue 3 (Composition API)** — Component framework
- **Vite** — Build tool and dev server
- **Vue Router** — Routing management
- **Bootstrap 5 (CDN)** — Responsive layout and UI utilities
- **LocalStorage** — Client-side persistence (journals, drafts)

---

## Business Requirements Coverage

### Category A

- **BR (A.1) Development Stack**: Built with VueJS 3 and Vite.
- **BR (A.2) Responsiveness**: Responsive design achieved with Bootstrap grid system.

### Category B

- **BR (B.1) Validations**:
  - Auth form validates required fields, email format, and password length.
  - Error messages displayed inline.
- **BR (B.2) Dynamic Data**:
  - Journals stored/retrieved via LocalStorage.
  - Draft auto-saved, refresh-proof.
  - JournalList dynamically renders, with search and tag filter.

---

## 🔍 Dependency Versions

- Check **exact versions** in `package.json` under `dependencies` and `devDependencies`.  
  Example commands:
  ```bash
  npm ls vue
  npm ls vite
  npm ls bootstrap
  ```
- Bootstrap version: See `<link>` and `<script>` in `index.html`.

---

## Development Notes

- Use `<script setup>` in Vue SFCs for concise code.
- Routing handled in `src/router/index.js`.
- Component naming convention: `PascalCase.vue`.
- Custom styles should be added to `src/styles/theme.css`.

---

## Troubleshooting

1. **`vite: command not found`**  
   → Run `npm ci` or `npm install` in project root.

2. **No styles / broken layout**  
   → Ensure Bootstrap CDN links exist in `index.html`.

3. **LocalStorage not persisting**  
   → Check browser DevTools → Application → Local Storage keys:

   - `yw_journals`
   - `yw_journal_draft`

4. **Case-sensitive imports**  
   → On Linux/CI ensure import paths match file names exactly.

---

## Next Steps (Future BRs)

- **Authentication (C.1, C.2)**: Implement login/register and role-based access.
- **Rating (C.3)**: Add aggregated rating system for resources or journals.
- **Interactive Tables (D.3)**: Integrate DataTables with sorting, search, pagination.
- **Cloud Deployment (D.4)**: Host on Cloudflare, Vercel, or similar.
- **Innovation (F.1)**: Explore features like calendar booking, admin dashboard, GenAI integration.

---

## License & Credits

This project is part of **FIT5032** coursework.  
Open-source libraries used: Vue, Vite, Vue Router, Bootstrap.

pages/
├── HomePage.vue # 首页/着陆页
├── auth/
│ ├── LoginPage.vue # 登录页面
│ ├── RegisterPage.vue # 注册页面
│ └── ForgotPassword.vue # 忘记密码
├── dashboard/
│ ├── UserDashboard.vue # 用户仪表板
│ ├── AdminDashboard.vue # 管理员仪表板
│ └── CounselorDashboard.vue # 咨询师仪表板
├── journal/
│ ├── ComposePage.vue # 写日记页面
│ ├── MyJournals.vue # 我的日记列表
│ └── JournalSquare.vue # 日记广场
├── mood/
│ └── TrendsPage.vue # 情绪趋势页面
├── learn/
│ └── LearnPage.vue # 学习页面
├── resources/
│ └── MapView.vue # 资源地图页面
├── profile/
│ └── ProfilePage.vue # 个人设置页面
└── support/
└── SupportPage.vue # 支持聊天页面

components/
├── common/
│ ├── common/AppHeader.vue # 头部导航
│ ├── AppFooter.vue # 页脚
│ ├── LoadingSpinner.vue # 加载动画
│ └── ConfirmDialog.vue # 确认对话框
├── auth/
│ ├── LoginForm.vue # 登录表单
│ ├── RegisterForm.vue # 注册表单
│ └── ExternalAuth.vue # 外部认证按钮
├── journal/
│ ├── MoodRating.vue # 情绪评分组件
│ ├── JournalEditor.vue # 日记编辑器
│ ├── TagSelector.vue # 标签选择器
│ ├── JournalCard.vue # 日记卡片
│ └── JournalTable.vue # 日记表格
├── mood/
│ ├── MoodChart.vue # 情绪图表
│ └── TrendAnalysis.vue # 趋势分析
├── map/
│ ├── ResourceMap.vue # 资源地图
│ ├── ResourcePin.vue # 地图标记
│ └── FilterPanel.vue # 筛选面板
├── learn/
│ ├── KnowledgeCard.vue # 知识卡片
│ └── VideoPlayer.vue # 视频播放器
└── admin/
├── UserManagement.vue # 用户管理
├── ContentModeration.vue # 内容审核
└── Analytics.vue # 数据分析
