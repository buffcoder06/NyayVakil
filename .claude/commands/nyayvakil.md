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
├── app/api/            → Route handlers (thin: auth + validate + call a service)
├── proxy.ts            → Cookie gate: no session cookie → 401 (API) / redirect to /login
├── lib/
│   ├── db.ts               → Prisma client (pg adapter, small pool)
│   ├── dates.ts            → todayIST(), parseDateOnly(), addDays() — IST calendar helpers
│   ├── http.ts             → apiFetch() for client components (unwraps {success,data}, 401 → /login)
│   ├── auth/session.ts     → createSession / getSession / destroySession (DB-backed cookie sessions)
│   ├── auth/rate-limit.ts  → login throttling (login_attempts table)
│   ├── server/route.ts     → withAuth() wrapper, ApiError, role lists, error mapping
│   ├── server/dto.ts       → Prisma row → @/types mappers (Decimal → number, DATE → "YYYY-MM-DD")
│   ├── services/*.ts       → All DB access, always scoped by firmId; tenant.ts = ownership checks
│   ├── validation/index.ts → Zod schemas for every request body
│   ├── store/
│   │   ├── auth-store.ts   → useAuthStore (cached user profile, login/signup/logout, role checks)
│   │   └── app-store.ts    → useAppStore (sidebar, filters, modals, toasts, pagination)
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

## BACKEND ARCHITECTURE

PostgreSQL (Supabase) via Prisma 7. Multi-tenant: every tenant row has `firmId`.

**Request flow:** `proxy.ts` (cookie present?) → `withAuth()` in the route (valid session, role) → Zod schema → service (scoped by `session.firmId`) → DTO mapper → `{ success: true, data }`.

**Rules (don't break these):**
1. Never take `firmId`, `createdBy`, `uploadedById`, `assignedBy`, fee `receivedAmount/pendingAmount/status` from the request — the server derives them.
2. Every service update/delete uses `where: { id, firmId }` (cross-firm ids → 404).
3. Ids from a body (clientId, matterId, assignedToId, …) are checked with `requireClient/requireMatter/requireMember` from `services/tenant.ts`.
4. Money is `Decimal(12,2)`; calendar dates are `@db.Date` and travel as `"YYYY-MM-DD"`. "Today" is always `todayIST()`, never `new Date().toISOString()`.
5. Fee payments only change via `services/fees.ts` (atomic increments + overpayment check). "overdue" is derived from `dueDate`, never stored. Matter `totalFeePaid/totalExpenses` are computed from payments/expenses.
6. Server components can call services directly with `getSession()`; client components use `apiFetch()`.

**Endpoints:**
```
POST /api/auth/login | signup | logout      GET /api/auth/me       GET /api/team
GET|POST /api/clients      GET|PUT|DELETE(deactivate) /api/clients/:id
GET|POST /api/matters      GET|PUT|DELETE(close) /api/matters/:id
GET|POST /api/hearings (?today=true, dateFrom/dateTo)   PUT|DELETE /api/hearings/:id
GET|POST /api/fees         PUT|DELETE /api/fees/:id              (advocate/admin)
GET|POST /api/payments     DELETE /api/payments/:id (reversal)   (advocate/admin)
GET|POST /api/expenses     PUT|DELETE /api/expenses/:id          (advocate/admin)
GET|POST /api/documents    DELETE /api/documents/:id
GET|POST /api/tasks        PUT (body.complete=true) | DELETE /api/tasks/:id
GET|POST /api/reminders    PUT /api/reminders/:id (body.action = markSent | cancel)
GET /api/dashboard/stats
```

**Pagination:** `?page=&pageSize=` (max 500) → `PaginatedResponse<T>` `{ data, total, page, pageSize, totalPages }`

**Migrations:** `npx prisma migrate dev` / `migrate deploy` (uses `DIRECT_URL`, falls back to `DATABASE_URL`). Never change the schema with raw SQL scripts.

---

## STATE MANAGEMENT

### useAuthStore (src/lib/store/auth-store.ts)
Persisted to localStorage key `nyayvakil-auth`.
- Only caches the display profile — the real session is an httpOnly cookie. No token in JS.
- **State:** `user: User | null`, `status: 'idle'|'loading'|'authenticated'|'unauthenticated'`, `error: string | null`
- **Actions:** `login(identifier, password)`, `signup(data)`, `logout()` (revokes server session), `refreshUser()` (GET /api/auth/me), `clearError()`, `setUser()`
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

**Sessions:** random token in httpOnly `nv_session` cookie; only its SHA-256 is stored in `sessions` (30-day expiry). Login is throttled (5 failures / identifier / 15 min, 20 / IP).

**Signup** always creates a new firm with the caller as `advocate` (owner); role is never read from the body. Juniors/clerks will join via invites (not built yet).

**Dev account:** seed with `SEED_ADMIN_PASSWORD=... npx prisma db seed` → `advocate@nyayvakil.in`.

**Role hierarchy:** advocate > admin > junior > clerk. Enforced on the server via `withAuth(..., { roles })`: finance (fees/payments/expenses) = advocate/admin; matter edits = advocate/admin/junior. Client-side hooks only hide UI.

**Protected routes:** `proxy.ts` gates by cookie; `(dashboard)/layout.tsx` validates the session with `getSession()` and redirects to `/login?expired=1`.

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
4. New endpoints: Zod schema in `lib/validation`, logic in `lib/services` (scoped by firmId), mapper in `lib/server/dto.ts`, thin route using `withAuth()`
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
