# NyayVakil Project Context

You are an expert developer working on **NyayVakil** — a full-stack legal practice management SaaS application for Indian advocates and law firms. Load this full context before assisting with any development task.

---

## TECH STACK

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS v4 + shadcn/ui (base-nova style) + Lucide React icons
- **State:** Zustand 5 (auth + app stores, localStorage persistence) + TanStack React Query 5 (server state, 60s stale time)
- **Forms:** React Hook Form 7 + Zod 4 validation
- **Charts:** Recharts 3
- **Date:** date-fns 4 + react-day-picker 9
- **Notifications:** Sonner 2 (toasts)
- **Themes:** next-themes 0.4.6
- **Path alias:** `@/*` → `./src/*`

---

## PROJECT STRUCTURE

```
src/
├── app/
│   ├── (auth)/         → login, signup, forgot-password + auth layout
│   ├── (dashboard)/    → all protected pages + dashboard layout
│   └── globals.css
├── components/
│   ├── ui/             → 50+ shadcn/ui Radix-based components
│   ├── layout/         → DashboardLayout, Sidebar, Header, MobileNav, PageHeader
│   ├── dashboard/      → StatsRow, TodaysDiary, QuickActions, IncomeExpenseChart, widgets
│   ├── clients/        → client list, detail, form components
│   ├── matters/        → matter list, detail, form components
│   ├── fees/           → FeeEntryCard, payment dialogs
│   ├── hearings/       → HearingCalendar, HearingCard, AddHearingDialog
│   ├── tasks/          → TaskCard, AddTaskDialog, TaskFilterBar
│   ├── reminders/      → reminder list and form components
│   ├── reports/        → analytics and chart components
│   ├── settings/       → office/team settings components
│   ├── shared/         → EmptyState, LoadingSkeleton, StatCard, StatusBadge
│   └── providers.tsx   → React Query provider wrapper
├── lib/
│   ├── api/index.ts        → Complete MOCK API layer (951 lines, all CRUD)
│   ├── store/
│   │   ├── auth-store.ts   → useAuthStore (user, token, login/logout, role checks)
│   │   └── app-store.ts    → useAppStore (sidebar, filters, modals, toasts, pagination)
│   ├── mock-data/index.ts  → In-memory mock data arrays
│   └── utils.ts            → formatCurrency, formatDate, getStatusColor, getInitials, etc.
├── hooks/
│   └── use-mobile.ts   → useIsMobile() (768px breakpoint)
└── types/index.ts      → All TypeScript type definitions (414 lines)
```

---

## ALL PAGES & ROUTES

| Route | Purpose |
|-------|---------|
| `/login` | Login with email/password. Demo buttons for 3 roles. |
| `/signup` | User registration |
| `/forgot-password` | Password reset |
| `/dashboard` | Home: stats row, today's diary, hearings, fees, tasks, income chart |
| `/clients` | Client list — search & filter by type/status/city |
| `/clients/new` | Create client form |
| `/clients/[id]` | Client detail: profile, linked matters, outstanding balance |
| `/clients/[id]/edit` | Edit client |
| `/matters` | Matter list — filter by status/priority/court level/case type |
| `/matters/new` | Create matter: case details, court, client, team, fee agreement |
| `/matters/[id]` | Matter detail: hearings, fees, expenses, documents, tasks, timeline |
| `/matters/[id]/edit` | Edit matter |
| `/hearings` | Court diary: calendar view + hearing list |
| `/fees` | Fee tracking: paid/pending/overdue tabs with payment progress bars |
| `/fees/new` | Create fee entry |
| `/expenses` | Expense tracking by category |
| `/documents` | Document management: upload, categorize, tag, search |
| `/tasks` | Task management — filter by status/priority |
| `/reminders` | Scheduled reminders with channels (WhatsApp, SMS, email, internal) |
| `/reports` | Analytics: income/expense charts, matter stats, performance |
| `/settings` | Office info, team members, system config |
| `/profile` | User profile and specializations |

---

## KEY DATA MODELS (from src/types/index.ts)

**User** — id, name, email, phone, role (`advocate|junior|clerk|admin`), barCouncilNumber, specialization[], chamberName, avatar

**Client** — id, name, mobile, alternateMobile, email, address, city, state, pincode, clientType (`individual|company|family|organization`), linkedMatterIds[], totalOutstanding, isActive

**Matter** — id, matterTitle, caseNumber, cnrNumber, caseType, courtName, courtLevel, caseStage, filingDate, nextHearingDate, oppositeParty, oppositeAdvocate, advocateOnRecord, assignedJuniorId, assignedClerkId, status (`active|pending|disposed|on_hold|closed`), priority (`high|medium|low`), judgeName, clientId, totalFeeAgreed, totalFeePaid, totalExpenses

**Hearing** — id, matterId, matterTitle, clientName, courtName, date, time, purpose, notes, nextAction, nextHearingDate, assignedTo, appearanceStatus, status (`upcoming|attended|adjourned|completed|missed`)

**FeeEntry** — id, matterId, clientId, description, totalAmount, receivedAmount, pendingAmount, dueDate, status (`paid|partially_paid|overdue|not_started`)

**Payment** — id, feeEntryId, matterId, clientId, amount, paymentMethod (`cash|bank_transfer|cheque|upi|other`), paymentDate, referenceNumber, receiptNumber

**Expense** — id, matterId, clientId, date, expenseType (`court_fee|clerk_expense|photocopy|typing|travel|affidavit|filing|stamp|miscellaneous`), description, amount, paidBy, isRecoverable, isRecovered

**Document** — id, matterId, clientId, name, category (`vakalatnama|affidavit|notice|petition|written_statement|evidence|receipt|invoice|id_proof|court_order|miscellaneous`), fileType, fileSize, fileUrl, tags[]

**Task** — id, title, description, matterId, assignedTo, assignedBy, dueDate, priority (`high|medium|low`), status (`pending|in_progress|completed|cancelled`), completedAt

**Reminder** — id, type (`hearing|payment|document|follow_up|general`), title, message, clientId, matterId, scheduledAt, status (`pending|sent|acknowledged|cancelled`), channel (`whatsapp|sms|email|internal`)

**TimelineEntry** — id, entityType (`matter|client`), entityId, type (`created|hearing_added|payment_logged|expense_added|document_uploaded|reminder_created|task_completed|status_changed|note_added|hearing_completed`), title, description, userId, userName

**DashboardStats** — totalActiveMatters, todayHearings, upcomingHearings, pendingPayments, monthlyCollections, pendingTasks, totalClients, overduePayments, monthlyExpenses

---

## API LAYER (src/lib/api/index.ts)

All functions are a **complete mock API** (in-memory with simulated 200-800ms delays). All have TODO comments for real backend swap. Never change call sites — only swap internals.

```
api.auth.login(email, password) / logout() / getMe(userId)
api.clients.list(filters?, pagination) / getById(id) / create(data) / update(id, data) / delete(id)
api.matters.list(filters?, pagination) / getById(id) / create(data) / update(id, data) / close(id)
api.hearings.list(filters?) / getById(id) / getByDate(date) / getToday() / create(data) / update(id, data) / delete(id)
api.fees.list(matterId?, clientId?) / getById(id) / create(data) / update(id, data)
api.payments.list(matterId?, clientId?) / create(data)
api.expenses.list(matterId?, clientId?) / create(data) / update(id, data) / delete(id)
api.documents.list(matterId?, clientId?) / getById(id) / upload(data) / delete(id)
api.tasks.list(assignedTo?, matterId?, status?) / create(data) / update(id, data) / complete(id, notes?) / delete(id)
api.reminders.list(clientId?, matterId?, status?) / create(data) / update(id, data) / markSent(id) / cancel(id) / getTemplates()
api.timeline.getByEntityId(entityId)
api.courts.list()
api.dashboard.getStats()
api.settings.getOfficeSettings() / updateOfficeSettings(data) / getTeamMembers()
```

**Pagination pattern:** `{ page: number, pageSize: number }` → `PaginatedResponse<T>` with `{ data, total, page, pageSize, totalPages }`

---

## STATE MANAGEMENT

### useAuthStore (src/lib/store/auth-store.ts)
Persisted to localStorage key `nyayvakil-auth`.
- **State:** `user: User | null`, `token: string | null`, `status: 'idle'|'loading'|'authenticated'|'unauthenticated'`, `error: string | null`
- **Actions:** `login(email, password)`, `logout()`, `refreshUser()`, `clearError()`, `setUser()`
- **Role helpers:** `useIsAdvocate()`, `useIsAdmin()`, `useCanEditMatters()`, `useCanManageFinance()`
- **Selectors:** `selectUser`, `selectIsAuthenticated`, `selectIsLoading`, `selectAuthError`

### useAppStore (src/lib/store/app-store.ts)
Partially persisted (sidebarCollapsed, theme, activeView).
- **Layout:** sidebarOpen, sidebarCollapsed
- **Search:** globalSearch
- **Filters:** matterFilters, hearingFilters, clientFilters
- **Pagination:** matterPagination, hearingPagination, clientPagination
- **Modals:** `activeModal: { type, entityId, meta }`
- **Toasts:** `toasts[]`
- **Selection:** selectedMatterIds[], selectedClientIds[]
- **Theme:** `light|dark|system`
- **Convenience hooks:** `useSidebar()`, `useToast()`, `useModal()`, `useMatterFilters()`, etc.

### React Query
QueryClient defaults: `staleTime: 60000`, `retry: 1`, `refetchOnWindowFocus: false`

---

## AUTHENTICATION & ROLES

**Demo credentials:**
- Advocate (full access): `priya.sharma@nyayvakil.in` / `demo123`
- Junior (matters + limited): `rahul.mehta@nyayvakil.in` / `demo123`
- Clerk (data entry): `suresh.patil@nyayvakil.in` / `demo123`

**Role hierarchy:** advocate > admin > junior > clerk

**Protected routes:** All `/dashboard/*` — if `useAuthStore((s) => s.user)` is null, redirect to `/login`. Root `/` redirects to `/login`.

---

## KEY UTILITY FUNCTIONS (src/lib/utils.ts)

| Function | Purpose |
|----------|---------|
| `cn(...classes)` | Tailwind class merging (clsx + tailwind-merge) |
| `formatCurrency(amount)` | ₹1,00,000 format (en-IN locale) |
| `formatCurrencyCompact(amount)` | ₹1.5L, ₹50K compact |
| `formatDate(date)` | Locale date string (en-IN) |
| `formatTime(time)` | 12-hour AM/PM format |
| `formatRelativeDate(date)` | "Today", "Tomorrow", "In 3d", "3d ago" |
| `isOverdue(date)` | boolean — past today |
| `getDaysUntil(date)` | number of days remaining |
| `getPaymentPercentage(received, total)` | 0–100 percentage |
| `truncateText(text, maxLength)` | truncate with ellipsis |
| `titleCase(str)` | snake_case → Title Case |
| `getStatusColor(status)` | Tailwind color classes for status |
| `getPriorityColor(priority)` | Tailwind color classes for priority |
| `getInitials(name)` | "Priya Sharma" → "PS" |
| `buildWhatsAppLink(phone, message)` | WhatsApp API URL builder |

---

## DESIGN SYSTEM

- **Primary color:** `#1e3a5f` (Deep Navy Blue)
- **Status colors:** emerald = active/paid, amber = pending/partial, red = closed/overdue, slate = neutral
- **Priority colors:** red = high, amber = medium, slate = low
- **Icons:** Lucide React
- **Font:** Inter (system sans-serif fallback), base 14px
- **Responsive:** mobile-first — 2-col tablets, 3–5 col desktop
- **Dark mode:** supported via next-themes

---

## INDIAN LEGAL DOMAIN CONTEXT

- **Currency:** INR (₹), en-IN locale formatting
- **Court hierarchy:** Supreme Court → High Court → District Court → Sessions Court → Magistrate Court → Family Court → Tribunal/Other
- **Case types:** Civil, Criminal, Family, Writ, Matrimonial, Motor Accident, Consumer, Arbitration, Corporate, Labour, Tax, Revenue, Other
- **Indian documents:** Vakalatnama, Affidavit, Vakalatpatra
- **CNR number:** Case Number Record system used in Indian e-Courts
- **Bar Council:** Bar Council registration numbers for advocates
- **WhatsApp:** Primary reminder channel (widely used in India)

---

## DEVELOPMENT GUIDELINES

1. Always use the `@/` path alias (maps to `src/`)
2. Use `cn()` for all className merging
3. Use `formatCurrency()` / `formatDate()` for all display formatting — never raw values
4. New API calls go in `src/lib/api/index.ts` following the existing mock pattern
5. New types go in `src/types/index.ts`
6. UI components: prefer existing shadcn/ui components in `src/components/ui/`
7. Forms: React Hook Form + Zod schema validation
8. Data fetching: React Query (`useQuery` / `useMutation`)
9. Toast notifications: use `useToast()` from app-store or Sonner directly
10. Role checks: use `useIsAdvocate()`, `useCanEditMatters()` etc. from auth-store
11. New pages go in `src/app/(dashboard)/` with the dashboard layout group
12. Keep components feature-scoped (e.g., `src/components/matters/`)

---

Now assist with the user's development task for NyayVakil: $ARGUMENTS
