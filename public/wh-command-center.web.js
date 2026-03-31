(async () => {
        const root = document.getElementById('so-rc-web');
        if (!root) return;
        document.querySelectorAll('.soRc__attachMenu').forEach(el => el.remove());

        const els = {
          devBadge: root.querySelector('#soDevBadge'),
          dataModePill: root.querySelector('#soDataModePill'),
          navItems: [...root.querySelectorAll('.soRc__navItem')],
          panels: [...root.querySelectorAll('.soRc__panel')],
          chatWrap: root.querySelector('.soRc__chatWrap'),
          chat: root.querySelector('#soChat'),
          input: root.querySelector('#soInput'),
          send: root.querySelector('#soSend'),
          files: root.querySelector('#soFiles'),
          mobileTop: root.querySelector('#soMobileTop'),
          main: root.querySelector('.soRc__main'),
          mobileMenuBtn: root.querySelector('#soMobileMenuBtn'),
          mobileClose: root.querySelector('#soMobileClose'),
          attachBtn: root.querySelector('#soAttachBtn'),
          filterVendor: root.querySelector('#soFilterVendor'),
          filterCategory: root.querySelector('#soFilterCategory'),
          filterPrice: root.querySelector('#soFilterPrice'),
          filterSort: root.querySelector('#soFilterSort'),
          newChat: root.querySelector('#soNewChatBtn'),
          recentList: root.querySelector('#soRecentList'),
          deleteModal: root.querySelector('#soDeleteModal'),
          acctBtn: root.querySelector('#soAcctBtn'),
          acctMenu: root.querySelector('#soAcctMenu'),
          themeToggle: root.querySelector('#soThemeToggle'),
          themeLabel: root.querySelector('#soThemeLabel'),
          planStatusBanner: root.querySelector('#soPlanStatusBanner'),
          planStatusWarn: root.querySelector('#soPlanStatusWarn'),
          planStatusLastSynced: root.querySelector('#soPlanStatusLastSynced'),
          budgetVal: root.querySelector('#soBudgetVal'),
          planTotalSub: root.querySelector('#soPlanTotalSub'),
          reordersList: root.querySelector('#soReordersList'),
          cartBody: root.querySelector('#soCartBody'),
cartTotal: root.querySelector('#soCartTotal'),
recommendedBody: root.querySelector('#soRecommendedBody'),
recommendedTotal: root.querySelector('#soRecommendedTotal'),
proceedBtn: root.querySelector('#soProceedBtn'),
          riskKpi: root.querySelector('#soRiskKpi'),
          riskVal: root.querySelector('#soRiskVal'),
          marginVal: root.querySelector('#soMarginVal'),
          billingPlanLabel: root.querySelector('#soBillingPlanLabel'),
          billingStatusLabel: root.querySelector('#soBillingStatusLabel'),
          billingUsagePeriod: root.querySelector('#soBillingUsagePeriod'),
          usageAiText: root.querySelector('#soUsageAiText'),
          usageAiFill: root.querySelector('#soUsageAiFill'),
          usageProductsText: root.querySelector('#soUsageProductsText'),
          usageProductsFill: root.querySelector('#soUsageProductsFill'),
          usageStoresText: root.querySelector('#soUsageStoresText'),
          usageStoresFill: root.querySelector('#soUsageStoresFill'),
          billingUpgradeBtn: root.querySelector('#soBillingUpgradeBtn'),
          billingManageBtn: root.querySelector('#soBillingManageBtn'),
          exportPerformanceBtn: root.querySelector('#soExportPerformanceBtn'),
          exportDecisionsBtn: root.querySelector('#soExportDecisionsBtn'),
          reportWeeklyBtn: root.querySelector('#soReportWeeklyBtn'),
          reportMonthlyBtn: root.querySelector('#soReportMonthlyBtn'),
          reportOpportunitiesBtn: root.querySelector('#soReportOpportunitiesBtn'),
          reportsHistoryList: root.querySelector('#soReportsHistoryList'),
          forecastMeta: root.querySelector('#soForecastMeta'),
          forecastKpis: root.querySelector('#soForecastKpis'),
          forecastList: root.querySelector('#soForecastList'),
          classificationMeta: root.querySelector('#soClassificationMeta'),
          classificationKpis: root.querySelector('#soClassificationKpis'),
          classificationList: root.querySelector('#soClassificationList'),
          locationsMeta: root.querySelector('#soLocationsMeta'),
          locationsTop: root.querySelector('#soLocationsTop'),
          locationsActions: root.querySelector('#soLocationsActions'),
          subTabs: [...root.querySelectorAll('.soRc__subTab')],
          subPanels: [...root.querySelectorAll('.soRc__subPanel')],
          assumpBadge: root.querySelector('#soAssumpBadge'),
          missingBadge: root.querySelector('#soMissingBadge'),
          assumptionsList: root.querySelector('#soAssumptionsList'),
          missingList: root.querySelector('#soMissingList'),
          shopSearch: root.querySelector('#soShopSearch'),
          shopGrid: root.querySelector('#soShopGrid'),
                    companyName: root.querySelector('#soCompanyName'),
          composer: root.querySelector('.soRc__composer'),
avatar: root.querySelector('#soAvatar'),
          composerInner: root.querySelector('.soRc__composerInner'),
          accountBtn: root.querySelector('#soMenuAccount'),
          billingBtn: root.querySelector('#soMenuBilling'),
          settingsBtn: root.querySelector('#soMenuSettings'),
perfStatus: root.querySelector('#soPerfStatus'),
perfMeta: root.querySelector('#soPerfMeta'),
perfState: root.querySelector('#soPerfState'),
perfDisconnected: root.querySelector('#soPerfDisconnected'),
perfConnected: root.querySelector('#soPerfConnected'),
perfProviders: root.querySelector('#soPerfProviders'),
perfKpis: root.querySelector('#soPerfKpis'),
perfAlerts: root.querySelector('#soPerfAlerts'),
perfCards: root.querySelector('#soPerfCards'),
perfConnectionsBtn: root.querySelector('#soPerfConnectionsBtn'),
perfConnectionsCount: root.querySelector('#soPerfConnectionsCount'),
perfConnectionsMenu: root.querySelector('#soPerfConnectionsMenu'),
        };

        const authState = {
  backendJwt: '',
  backendJwtExp: 0
};

function setBackendJwt(token, expUnix) {
  authState.backendJwt = String(token || '').trim();
  authState.backendJwtExp = Number(expUnix || 0);
}

function getBackendJwt() {
  const now = Math.floor(Date.now() / 1000);
  if (!authState.backendJwt) return '';
  if (authState.backendJwtExp && now >= authState.backendJwtExp - 20) return '';
  return authState.backendJwt;
}

async function ensureBackendJwt() {
  const now = Math.floor(Date.now() / 1000);
  if (authState.backendJwt && (!authState.backendJwtExp || now < authState.backendJwtExp - 20)) {
    return true;
  }
  const access = await ensureRetailerRole();
  if (!access?.ok) return false;
  return !!getBackendJwt();
}

        const API_BASE = String(window.__COODRA_API_BASE__ || 'https://api.coodra.com').trim().replace(/\/+$/, '');
const apiPath = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
const CHAT_API = apiPath('/api/chat');
const CATALOG_API = apiPath('/api/shopify-catalog');
const RECOMMEND_API = apiPath('/api/recommend');
const ACCESS_API = apiPath('/api/log');
const PLAN_API = apiPath('/api/plan');
const REORDERS_API = apiPath('/api/reorders');
const MFA_API = apiPath('/api/mfa');
const RETAILER_PLAN_API = apiPath('/api/retailer-plan');
const WELCOME_CONTEXT_API = apiPath('/api/welcome-context');
const ANALYZE_ATTACHMENT_API = apiPath('/api/analyze-attachment');
const ATTACHMENT_ANALYSIS_ENABLED = false;
const PERFORMANCE_STATUS_API = apiPath('/api/performance/status');
const PERFORMANCE_SYNC_API = apiPath('/api/performance/sync');
const PERFORMANCE_CONNECTIONS_API = apiPath('/api/performance/connections');
const BILLING_ENTITLEMENTS_API = apiPath('/api/retailer-plan?view=billing');
const BILLING_USAGE_API = apiPath('/api/retailer-plan?view=usage');
const BILLING_PORTAL_API = apiPath('/api/retailer-plan?view=billing_portal');
const EXPORT_PERFORMANCE_API = apiPath('/api/retailer-plan?view=export_performance_csv');
const EXPORT_DECISIONS_API = apiPath('/api/retailer-plan?view=export_decisions_csv');
const SAVED_REPORTS_API = apiPath('/api/retailer-plan?view=saved_reports');
const GENERATE_REPORT_API = apiPath('/api/retailer-plan?action=generate_report_csv');
const API_ACCESS_STATUS_API = apiPath('/api/retailer-plan?view=api_access_status');
const API_ACCESS_ROTATE_API = apiPath('/api/retailer-plan?action=api_access_rotate_key');
const TEAM_MEMBERS_API = apiPath('/api/retailer-plan?view=team_members');
const TEAM_MEMBER_ADD_API = apiPath('/api/retailer-plan?action=team_member_add');
const TEAM_MEMBER_REMOVE_API = apiPath('/api/retailer-plan?action=team_member_remove');
const MFA_SECURITY_STATUS_API = apiPath('/api/retailer-plan?view=mfa_security_status');
const MFA_SECURITY_UPDATE_API = apiPath('/api/retailer-plan?action=mfa_security_update');
const ACCOUNT_PROFILE_STATUS_API = apiPath('/api/retailer-plan?view=account_profile_status');
const ACCOUNT_PROFILE_UPDATE_API = apiPath('/api/retailer-plan?action=account_profile_update');
const PRICING_PAGE_URL = '/pricing';
const USER_ID = window.__SO_RC_BOOT__?.userId ?? null;
const CUSTOMER_ID = USER_ID;
const CUSTOMER_EMAIL = window.__SO_RC_BOOT__?.email || "";
const CUSTOMER_COMPANY = window.__SO_RC_BOOT__?.company || "Retailer";
const CUSTOMER_REGION = window.__SO_RC_BOOT__?.region || "Unknown";
const CUSTOMER_FIRST_NAME = window.__SO_RC_BOOT__?.firstName || "";
const SESSION_ID = `retailer_${String(USER_ID || CUSTOMER_EMAIL || 'anon')}`;
const USER_SCOPE = String(USER_ID || CUSTOMER_EMAIL || 'anon')
  .toLowerCase()
  .replace(/[^a-z0-9_-]/g, '_');
const USER_ID_STR = String(USER_ID || '').trim();
const GLOBAL_THEME_KEY = 'so_theme_last_v1';

const STORAGE = {
  theme: `so_theme_v6_${USER_SCOPE}`,
  chats: `so_chats_v6_${USER_SCOPE}`,
  active: `so_active_chat_v6_${USER_SCOPE}`,
  ui: `so_ui_v6_${USER_SCOPE}`,
  policiesAutomation: `so_policies_automation_v1_${USER_SCOPE}`,
  cadence: `so_order_cadence_v1_${USER_SCOPE}`,
  reportsHistory: `so_reports_history_v1_${USER_SCOPE}`,
  logoIntroSeen: `so_logo_intro_v1_${USER_SCOPE}`,
  perfAppHandle: `so_perf_app_handle_v1_${USER_SCOPE}`,
  mfaToken: `so_mfa_token_v1_${USER_SCOPE}`,
  mfaDevice: `so_mfa_device_v1_${USER_SCOPE}`,
  mfaTrusted: `so_mfa_trusted_device_v1_${USER_SCOPE}`,
  };

function normalizeThemeMode(v) {
  return String(v || '').trim().toLowerCase() === 'dark' ? 'dark' : 'light';
}

function readThemePreference() {
  const scoped = safeGet(STORAGE.theme, '');
  if (scoped) return normalizeThemeMode(scoped);
  const globalTheme = safeGet(GLOBAL_THEME_KEY, '');
  return normalizeThemeMode(globalTheme || 'light');
}

function persistThemePreference(next) {
  const mode = normalizeThemeMode(next);
  safeSet(STORAGE.theme, mode);
  safeSet(GLOBAL_THEME_KEY, mode);
}

const authHeaders = (extra = {}) => {
  const h = {
    ...extra,
    'x-user-email': String(CUSTOMER_EMAIL || '').trim().toLowerCase()
  };
  const jwt = getBackendJwt();
  if (jwt) h.Authorization = `Bearer ${jwt}`;
  return h;
};

const CHAT_STATE_API = ACCESS_API;

if (window.__SO_RC_BOOT__?.backendJwt) {
  setBackendJwt(String(window.__SO_RC_BOOT__.backendJwt || ''), Number(window.__SO_RC_BOOT__.backendJwtExp || 0));
}

function chatHeaders(extra = {}) {
  return authHeaders({ 'Content-Type': 'application/json', ...extra });
}

function recommendHeaders(extra = {}) {
  const h = { ...extra };
  const jwt = getBackendJwt();
  if (jwt) h.Authorization = `Bearer ${jwt}`;
  return h;
}

async function fetchWithJwtRetry(url, options = {}, retry = true) {
  const opts = options && typeof options === 'object' ? options : {};
  let resp = await fetch(url, opts);
  if (!retry) return resp;

  let errCode = '';
  try {
    const clone = resp.clone();
    const j = await clone.json().catch(() => ({}));
    errCode = String(j?.error || '').trim().toLowerCase();
  } catch (_) {}

  const needsJwtRefresh = resp.status === 401 || errCode === 'jwt_required' || errCode === 'unauthorized';
  if (!needsJwtRefresh) return resp;

  setBackendJwt('', 0);
  const refreshed = await ensureBackendJwt();
  if (!refreshed) return resp;

  const baseHeaders = (opts.headers && typeof opts.headers === 'object') ? opts.headers : {};
  const retryHeaders = { ...baseHeaders };
  delete retryHeaders.Authorization;
  const next = { ...opts, headers: authHeaders(retryHeaders) };
  resp = await fetch(url, next);
  return resp;
}

function getMfaToken() {
  return safeGet(STORAGE.mfaToken, '');
}

function setMfaToken(token) {
  const next = String(token || '').trim();
  if (next) safeSet(STORAGE.mfaToken, next);
}

function clearMfaToken() {
  try { localStorage.removeItem(STORAGE.mfaToken); } catch (_) {}
}

function getMfaDeviceId() {
  let id = safeGet(STORAGE.mfaDevice, '');
  if (id) return id;
  try {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      id = window.crypto.randomUUID();
    }
  } catch (_) {}
  if (!id) id = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  safeSet(STORAGE.mfaDevice, id);
  return id;
}

function isTrustedDeviceActive() {
  try {
    const raw = safeGet(STORAGE.mfaTrusted, '');
    if (!raw) return false;
    const data = JSON.parse(raw);
    const did = String(data?.device_id || '');
    const exp = Number(data?.expires_at || 0);
    return !!did && did === getMfaDeviceId() && Number.isFinite(exp) && Date.now() < exp;
  } catch (_) {
    return false;
  }
}

function setTrustedDevice(hours = 24 * 30) {
  const ttlMs = Math.max(1, Number(hours || 24 * 30)) * 60 * 60 * 1000;
  safeSet(STORAGE.mfaTrusted, JSON.stringify({
    device_id: getMfaDeviceId(),
    expires_at: Date.now() + ttlMs
  }));
}

function clearTrustedDevice() {
  try { localStorage.removeItem(STORAGE.mfaTrusted); } catch (_) {}
}

function mfaHeaders(extra = {}) {
  const token = getMfaToken();
  const deviceId = getMfaDeviceId();
  return authHeaders({
    ...extra,
    'x-mfa-token': token,
    'x-mfa-device': deviceId
  });
}

async function apiMfaStatus(opts = {}) {
  const reason = String(opts.reason || 'login').trim().toLowerCase();
  const u = new URL(MFA_API);
  u.searchParams.set('action', 'status');
  if (reason) u.searchParams.set('reason', reason);
  const r = await fetch(u.toString(), {
    method: 'GET',
    headers: mfaHeaders()
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j?.ok, status: r.status, j };
}

async function apiMfaStart(opts = {}) {
  const reason = String(opts.reason || 'login').trim().toLowerCase();
  const channel = String(opts.channel || 'email').trim().toLowerCase() === 'sms' ? 'sms' : 'email';
  const u = new URL(MFA_API);
  u.searchParams.set('action', 'start');
  if (reason) u.searchParams.set('reason', reason);
  const r = await fetch(u.toString(), {
    method: 'POST',
    headers: mfaHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ channel, reason })
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j?.ok, status: r.status, j };
}

async function apiMfaResend(opts = {}) {
  const reason = String(opts.reason || 'login').trim().toLowerCase();
  const channel = String(opts.channel || 'email').trim().toLowerCase() === 'sms' ? 'sms' : 'email';
  const u = new URL(MFA_API);
  u.searchParams.set('action', 'resend');
  if (reason) u.searchParams.set('reason', reason);
  const r = await fetch(u.toString(), {
    method: 'POST',
    headers: mfaHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ channel, reason })
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j?.ok, status: r.status, j };
}

async function apiMfaVerify(code, opts = {}) {
  const reason = String(opts.reason || 'login').trim().toLowerCase();
  const channel = String(opts.channel || 'email').trim().toLowerCase() === 'sms' ? 'sms' : 'email';
  const u = new URL(MFA_API);
  u.searchParams.set('action', 'verify');
  if (reason) u.searchParams.set('reason', reason);
  const r = await fetch(u.toString(), {
    method: 'POST',
    headers: mfaHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ code: String(code || '').trim(), channel, reason })
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j?.ok, status: r.status, j };
}

async function apiListChats(limit = 30) {
  const u = new URL(CHAT_STATE_API);
  u.searchParams.set('view', 'retailer_chats');
  u.searchParams.set('limit', String(limit));
  const r = await fetch(u.toString(), { headers: chatHeaders() });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(j?.error || 'retailer_chats_fetch_failed');
  return Array.isArray(j.threads) ? j.threads : [];
}

async function apiGetChatMessages(chatId, limit = 200) {
  const u = new URL(CHAT_STATE_API);
  u.searchParams.set('view', 'retailer_chat_messages');
  u.searchParams.set('chat_id', String(chatId));
  u.searchParams.set('limit', String(limit));
  const r = await fetch(u.toString(), { headers: chatHeaders() });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(j?.error || 'retailer_chat_messages_fetch_failed');
  return Array.isArray(j.messages) ? j.messages : [];
}

async function apiCreateChat(title = 'New chat') {
  const u = new URL(CHAT_STATE_API);
  u.searchParams.set('action', 'retailer_chat_create');
  const r = await fetchWithJwtRetry(u.toString(), {
    method: 'POST',
    headers: chatHeaders(),
    body: JSON.stringify({ title })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok || !j?.chat?.id) throw new Error(j?.error || 'retailer_chat_create_failed');
  return j.chat;
}

async function apiAddMessage(chatId, role, content, kind = null) {
  const u = new URL(CHAT_STATE_API);
  u.searchParams.set('action', 'retailer_chat_message_add');
  const r = await fetchWithJwtRetry(u.toString(), {
    method: 'POST',
    headers: chatHeaders(),
    body: JSON.stringify({ chat_id: chatId, role, content, kind })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(j?.error || 'retailer_chat_message_add_failed');
  return j.message || null;
}

async function apiDeleteChat(chatId) {
  const u = new URL(CHAT_STATE_API);
  u.searchParams.set('action', 'retailer_chat_delete');
  const r = await fetch(u.toString(), {
    method: 'PATCH',
    headers: chatHeaders(),
    body: JSON.stringify({ chat_id: chatId })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(j?.error || 'retailer_chat_delete_failed');
  return true;
}

const memoryStore = {};
const safeGet = (k, fallback = null) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fallback : v;
  } catch {
    return Object.prototype.hasOwnProperty.call(memoryStore, k) ? memoryStore[k] : fallback;
  }
};
const safeSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    memoryStore[k] = v;
  }
};

const uiPrefs = {
  activeTab: 'chat',
  activeSubTab: 'cart',
  shopQuery: '',
  shopQty: {},
  shopFilters: {
    vendor: 'all',
    category: 'all',
    price: 'all',
    sort: 'relevance'
  }
};

        const DEV_MODE = false;
        if (els.devBadge) els.devBadge.hidden = !DEV_MODE;
        if (els.dataModePill) els.dataModePill.hidden = !DEV_MODE;

const state = {
  chats: [],
  activeChatId: null,
  plan: {
  budget: 5000,
  risk: 'unknown',
  margin: null,
  recommended_lines: [],
  assumptions: [],
  missing: []
},

  liveCart: { item_count: 0, total: 0, items: [] },
  profile: { store_type: null, location: null, locations_count: null, budget: null, priority: null, constraints: null },
  shop: [],
  performance: { loading: false, last: null },
  billing: null,
  accountProfile: null,
  policiesAutomation: {
    loadedAt: 0,
    lastSyncedAt: 0,
    open_to_buy: { loading: false, saving: false, error: '', updatedAt: 0, data: null },
    supplier_constraints: { loading: false, saving: false, error: '', updatedAt: 0, data: null },
    po_workflow: { loading: false, saving: false, error: '', updatedAt: 0, data: null },
    transfer_opportunities: { loading: false, saving: false, error: '', updatedAt: 0, data: null },
    forecast_scenarios: { loading: false, saving: false, error: '', updatedAt: 0, data: null },
    automation_rules: { loading: false, saving: false, error: '', updatedAt: 0, data: null }
  },
  reportsHistory: [],
  teamMembers: { members: [], seats: { used: 0, limit: 0, unlimited: false, remaining: 0 } }
};

const nearLimitWarned = {
  ai_decisions: false,
  ai_decisions_80: false,
  ai_decisions_95: false,
  products_analyzed: false,
  products_analyzed_80: false,
  products_analyzed_95: false,
  stores: false,
  stores_80: false,
  stores_95: false
};

        const stream = { active: false, stopped: false };
        let pendingSmartOverride = '';
        const isMobileViewport = () => window.innerWidth <= 1100;
let autoFollow = true;

function isNearBottom() {
  if (!els.chat) return true;
  return (els.chat.scrollHeight - els.chat.scrollTop - els.chat.clientHeight) < 80;
}
function scrollChatToBottom(behavior = 'auto') {
  if (!els.chat) return;
  els.chat.scrollTo({ top: els.chat.scrollHeight, behavior });
}
function maybeFollow(behavior = 'auto') {
  if (!els.chat) return;
  if (!isMobileViewport() || autoFollow) {
    requestAnimationFrame(() => scrollChatToBottom(behavior));
  }
}

let pendingDeleteChatId = null;
let modalDeleteChatId = null;
let mfaStatusUnavailable = false;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const esc = (s) => (s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        // Convert newlines to <br> for paragraph breaks in HTML rendering
        const nlToBr = (s) => (s || '').replace(/\n\n/g, '<br><br>').replace(/\n/g, ' ');
        const money = (n) => new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(n || 0));

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const out = String(reader.result || "");
      const base64 = out.includes(",") ? out.split(",")[1] : out;
      resolve(base64 || "");
    };
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

function normalizeAssistantDisplayText(text = '') {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\be\s*\.\s*g\s*\./gi, 'e.g.')
    .replace(/\bi\s*\.\s*e\s*\./gi, 'i.e.')
    .replace(/\betc\s*\./gi, 'etc.')
    .replace(/([a-z0-9,])\n(?=[a-z0-9(])/gi, '$1 ')
    .replace(/([a-z])\n(?=[A-Z][a-z])/g, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

let logoIntroStarted = false;

function runLogoIntroOnce() {
  if (logoIntroStarted) return;

  const introEl = root.querySelector('[data-logo-intro]');
  if (!introEl) return;

  const isLight = root.getAttribute('data-theme') === 'light';
  const darkSrc = introEl.getAttribute('data-logo-dark-src') || '';
  const lightSrc = introEl.getAttribute('data-logo-light-src') || '';
  const logoSrc = isLight ? (lightSrc || darkSrc) : (darkSrc || lightSrc);
  const imgEl = introEl.querySelector('.soRc__logoIntroImg');

  if (!logoSrc || !imgEl) return;

  logoIntroStarted = true;
  imgEl.style.display = 'block';
  imgEl.style.visibility = 'hidden';
  introEl.classList.remove('is-ready', 'is-enter', 'is-idle');

  // Build a square logo-mark image from the left icon area of the horizontal logo file.
  const srcImg = new Image();
  srcImg.crossOrigin = 'anonymous';
  srcImg.onload = () => {
    try {
      const sw = Math.max(1, Number(srcImg.naturalWidth || 1));
      const sh = Math.max(1, Number(srcImg.naturalHeight || 1));
      const markCropW = Math.max(1, Math.min(sw, Math.round(sh * 1.08)));
      const markCropX = 0;
      const markCropY = 0;

      const outSize = 320;
      const pad = 22;
      const target = outSize - (pad * 2);
      const ratio = markCropW / sh;
      let dw = target;
      let dh = dw / Math.max(0.1, ratio);
      if (dh > target) {
        dh = target;
        dw = dh * ratio;
      }
      const dx = Math.round((outSize - dw) / 2);
      const dy = Math.round((outSize - dh) / 2);

      const out = document.createElement('canvas');
      out.width = outSize;
      out.height = outSize;
      const octx = out.getContext('2d', { alpha: true });
      if (octx) {
        octx.clearRect(0, 0, outSize, outSize);
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = 'high';
        octx.drawImage(srcImg, markCropX, markCropY, markCropW, sh, dx, dy, dw, dh);
        imgEl.src = out.toDataURL('image/png');
      } else {
        imgEl.src = logoSrc;
      }
    } catch (_) {
      imgEl.src = logoSrc;
    }

    imgEl.style.visibility = 'visible';
    introEl.classList.add('is-ready');
    if (prefersReducedMotion) {
      introEl.classList.add('is-idle');
      return;
    }
    requestAnimationFrame(() => {
      introEl.classList.add('is-enter');
      setTimeout(() => {
        introEl.classList.remove('is-enter');
        introEl.classList.add('is-idle');
      }, 980);
    });
  };
  srcImg.onerror = () => {
    imgEl.src = logoSrc;
    imgEl.style.visibility = 'visible';
    introEl.classList.add('is-ready');
    if (prefersReducedMotion) {
      introEl.classList.add('is-idle');
      return;
    }
    requestAnimationFrame(() => {
      introEl.classList.add('is-enter');
      setTimeout(() => {
        introEl.classList.remove('is-enter');
        introEl.classList.add('is-idle');
      }, 980);
    });
  };
  srcImg.src = logoSrc;
}

async function analyzeAttachmentFile(file) {
  if (!ATTACHMENT_ANALYSIS_ENABLED) {
    throw new Error("attachments_disabled");
  }
  const mimeType = String(file?.type || "").trim();
  if (!mimeType) throw new Error("missing_mime");

  const base64 = await fileToBase64(file);
  const resp = await fetch(ANALYZE_ATTACHMENT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name || "upload",
      mimeType,
      base64
    })
  });

  const body = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(body?.error || "analyze_failed");
  return body;
}

 function saveState() {
  safeSet(STORAGE.active, state.activeChatId || '');
  safeSet(STORAGE.ui, JSON.stringify(uiPrefs));
}


function loadState() {
  state.chats = [];
  state.activeChatId = safeGet(STORAGE.active, '') || null;

  try {
    const ui = JSON.parse(safeGet(STORAGE.ui, '{}'));
    Object.assign(uiPrefs, ui || {});
  } catch {}
}

        const MAX_CHARS = 1200;

const jumpBtn = document.createElement('button');
jumpBtn.className = 'soRc__jumpBtn';
jumpBtn.type = 'button';
jumpBtn.setAttribute('aria-label', 'Jump to latest');
jumpBtn.innerHTML = '↓';
els.chatWrap?.appendChild(jumpBtn);

const toastHost = document.createElement('div');
toastHost.className = 'soRc__toasts';
root.appendChild(toastHost);

function showToast(message, type = 'ok') {
  const t = document.createElement('div');
  t.className = `soRc__toast soRc__toast--${type}`;
  t.textContent = message;
  toastHost.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function updateSendState() {
  const hasText = !!(els.input?.value || '').trim();
  if (els.send) els.send.disabled = !hasText || stream.active;
}

function updateJumpButton() {
  if (!els.chat || !jumpBtn) return;
  const nearBottom = (els.chat.scrollHeight - els.chat.scrollTop - els.chat.clientHeight) < 100;
  const hasMessages = !!currentChat()?.messages?.length;
  jumpBtn.classList.toggle('is-open', hasMessages && !nearBottom);
}

function getShopQty(id) {
  return Math.max(1, Number(uiPrefs.shopQty?.[id] || 1));
}
function setShopQty(id, qty) {
  uiPrefs.shopQty = uiPrefs.shopQty || {};
  uiPrefs.shopQty[id] = Math.max(1, Number(qty || 1));
  saveState();
}

function toBackendMessages(chat) {
  return (chat?.messages || [])
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: m.text || '' }))
    .filter(m => m.content.trim());
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 1100) {
    root.classList.remove('is-sidebar-open');
  }
}

function installMobileSwipeOpenSidebar() {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let mode = ''; // open | close

  const inMobile = () => window.innerWidth <= 1100;

  document.addEventListener('touchstart', (e) => {
    if (!inMobile()) return;
    const t = e.touches && e.touches[0];
    if (!t) return;

    startX = t.clientX;
    startY = t.clientY;
    tracking = false;
    mode = '';

    const open = root.classList.contains('is-sidebar-open');
    const inSidebar = !!e.target.closest('.soRc__sidebar');

    // Open only from very left edge to reduce accidental triggers.
    if (!open && startX <= 28) {
      tracking = true;
      mode = 'open';
      return;
    }

    if (open && inSidebar) {
      tracking = true;
      mode = 'close';
      return;
    }

    // Allow close from near left edge as a backup gesture.
    if (open && startX <= 48) {
      tracking = true;
      mode = 'close';
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!tracking || !inMobile()) return;
    const t = e.touches && e.touches[0];
    if (!t) return;

    const dx = t.clientX - startX;
    const dy = Math.abs(t.clientY - startY);

    if (Math.abs(dx) < 34 || Math.abs(dx) <= (dy * 1.35)) return;

    if (mode === 'open' && dx > 64) {
      root.classList.add('is-sidebar-open');
      e.preventDefault();
      tracking = false;
      return;
    }

    if (mode === 'close' && dx < -64) {
      root.classList.remove('is-sidebar-open');
      e.preventDefault();
      tracking = false;
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    tracking = false;
    mode = '';
  }, { passive: true });
}

function getPlanIdentity() {
  return {
    user_id: String(USER_ID || '').trim(),
    email: String(CUSTOMER_EMAIL || '').trim().toLowerCase()
  };
}

let planSaveTimer = null;
let lastPlanSyncAt = 0;
let saveInFlight = false;

function retailerPlanUrl(id) {
  const u = new URL(RETAILER_PLAN_API);
  if (id?.user_id) u.searchParams.set('user_id', String(id.user_id).trim());
  if (id?.email) u.searchParams.set('email', String(id.email).trim().toLowerCase());
  u.searchParams.set('_ts', String(Date.now()));
  return u.toString();
}

const POLICY_FEATURE_KEYS = [
  'open_to_buy',
  'supplier_constraints',
  'po_workflow',
  'transfer_opportunities',
  'forecast_scenarios',
  'automation_rules'
];

const POLICY_CARD_IDS = {
  open_to_buy: {
    status: 'soOpenToBuyStatus',
    meta: 'soOpenToBuyMeta',
    summary: 'soOpenToBuySummary',
    budget: 'soOpenToBuyBudget',
    committed: 'soOpenToBuyCommitted',
    available: 'soOpenToBuyAvailable',
    notes: 'soOpenToBuyNotes',
    list: 'soOpenToBuyDrivers'
  },
  supplier_constraints: {
    status: 'soSupplierConstraintsStatus',
    meta: 'soSupplierConstraintsMeta',
    summary: 'soSupplierConstraintsSummary',
    text: 'soSupplierConstraintsText',
    list: 'soSupplierConstraintsList'
  },
  po_workflow: {
    status: 'soPoWorkflowStatus',
    meta: 'soPoWorkflowMeta',
    summary: 'soPoWorkflowSummary',
    approvalMode: 'soPoWorkflowApprovalMode',
    threshold: 'soPoWorkflowThreshold',
    autoEmail: 'soPoWorkflowAutoEmail',
    steps: 'soPoWorkflowSteps',
    list: 'soPoWorkflowList'
  },
  transfer_opportunities: {
    status: 'soTransferOpportunitiesStatus',
    meta: 'soTransferOpportunitiesMeta',
    summary: 'soTransferOpportunitiesSummary',
    notes: 'soTransferOpportunitiesNotes',
    list: 'soTransferOpportunitiesList'
  },
  forecast_scenarios: {
    status: 'soForecastScenariosStatus',
    meta: 'soForecastScenariosMeta',
    summary: 'soForecastScenariosSummary',
    active: 'soForecastScenariosActive',
    horizon: 'soForecastScenariosHorizon',
    lift: 'soForecastScenariosLift',
    notes: 'soForecastScenariosNotes',
    list: 'soForecastScenariosList'
  },
  automation_rules: {
    status: 'soAutomationRulesStatus',
    meta: 'soAutomationRulesMeta',
    summary: 'soAutomationRulesSummary',
    enabled: 'soAutomationRulesEnabled',
    cadence: 'soAutomationRulesCadence',
    text: 'soAutomationRulesText',
    list: 'soAutomationRulesList'
  }
};

const POLICY_API_CONFIG = {
  open_to_buy: { view: 'open_to_buy', action: 'open_to_buy_save' },
  supplier_constraints: { view: 'supplier_constraints', action: 'supplier_constraints_save' },
  po_workflow: { view: 'po_workflow', action: 'po_workflow_save' },
  transfer_opportunities: { view: 'transfer_opportunities', action: 'transfer_opportunities_save' },
  forecast_scenarios: { view: 'forecast_scenarios', action: 'forecast_scenarios_save' },
  automation_rules: { view: 'automation_rules', action: 'automation_rules_save' }
};

let policiesAutomationLoadPromise = null;

function policyNode(key, field) {
  const id = POLICY_CARD_IDS?.[key]?.[field];
  return id ? root.querySelector(`#${id}`) : null;
}

function policyEsc(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function policyMoney(value) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(safe);
}

function policyNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[$,\s]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function policyMoneyFieldAsDollars(src = {}, centsKeys = [], dollarKeys = [], fallback = 0) {
  for (const k of centsKeys) {
    if (Object.prototype.hasOwnProperty.call(src, k) && src[k] !== null && src[k] !== undefined && src[k] !== '') {
      return policyNumber(src[k], fallback) / 100;
    }
  }
  for (const k of dollarKeys) {
    if (Object.prototype.hasOwnProperty.call(src, k) && src[k] !== null && src[k] !== undefined && src[k] !== '') {
      return policyNumber(src[k], fallback);
    }
  }
  return fallback;
}

function policyRound(value, digits = 1, fallback = 0) {
  const n = policyNumber(value, fallback);
  const p = 10 ** Math.max(0, Number(digits) || 0);
  return Math.round(n * p) / p;
}

function normalizeScenarioLabel(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'base';
  const low = raw.toLowerCase();
  if (low.includes('upside') || low === 'up') return 'upside';
  if (low.includes('downside') || low === 'down') return 'downside';
  if (low.includes('base')) return 'base';
  // Backend may return generated ids like scenario_593eaf03; avoid leaking internal ids in UI.
  if (low.startsWith('scenario_')) return 'base';
  return 'base';
}

function policyTimestamp(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return parsed;
  return policyNumber(value, fallback);
}

function policyYesNo(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  const v = String(value || '').trim().toLowerCase();
  if (!v) return !!fallback;
  return ['1', 'true', 'yes', 'y', 'on', 'enabled', 'auto'].includes(v);
}

function policyLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function policyRows(value, fields = []) {
  return policyLines(value).map((line) => {
    const parts = line.split('|').map((part) => part.trim()).filter((part) => part !== '');
    return fields.reduce((acc, field, idx) => {
      acc[field] = parts[idx] || '';
      return acc;
    }, {});
  });
}

function policyRowsToText(rows = [], fields = []) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    if (typeof row === 'string') return row.trim();
    return fields.map((field) => String(row?.[field] || '').trim()).join(' | ');
  }).filter(Boolean).join('\n');
}

function unwrapPolicyPayload(key, payload = {}) {
  const candidates = [
    payload?.data?.[key],
    payload?.feature?.[key],
    payload?.result?.[key],
    payload?.payload?.[key],
    payload?.[key],
    payload?.data,
    payload?.feature,
    payload?.result,
    payload?.payload,
    payload
  ];
  return candidates.find((item) => item && typeof item === 'object') || {};
}

function policyListHtml(rows = [], emptyText = 'No items yet.') {
  const list = Array.isArray(rows) ? rows.filter(Boolean) : [];
  if (!list.length) {
    return `<div class="soRc__emptyState">${policyEsc(emptyText)}</div>`;
  }
  return list.map((row) => `
    <div class="soRc__policyListRow">
      <div class="soRc__policyListMain">
        <div class="soRc__policyListTitle">${policyEsc(typeof row === 'string' ? row : (row.title || row.name || 'Item'))}</div>
        ${typeof row === 'string' ? '' : row.meta ? `<div class="soRc__policyListMeta">${policyEsc(row.meta)}</div>` : ''}
      </div>
      ${typeof row === 'string' ? '' : row.right ? `<div class="soRc__policyListRight">${policyEsc(row.right)}</div>` : ''}
    </div>
  `).join('');
}

function policySummaryHtml(items = []) {
  return (Array.isArray(items) ? items : []).map((item) => `
    <div class="soRc__policySummaryItem">
      <div class="soRc__policySummaryLabel">${policyEsc(item.label || '')}</div>
      <div class="soRc__policySummaryValue">${policyEsc(item.value || '-')}</div>
    </div>
  `).join('');
}

function getPolicyFeatureState(key) {
  if (!state.policiesAutomation[key]) {
    state.policiesAutomation[key] = { loading: false, saving: false, error: '', updatedAt: 0, data: null };
  }
  return state.policiesAutomation[key];
}

function setPolicyFeatureState(key, patch = {}) {
  const next = getPolicyFeatureState(key);
  state.policiesAutomation[key] = { ...next, ...patch };
  return state.policiesAutomation[key];
}

function normalizePolicyFeatureData(key, raw = {}) {
  const data = raw && typeof raw === 'object' ? raw : {};
  switch (key) {
    case 'open_to_buy': {
      const budget = policyMoneyFieldAsDollars(
        data,
        ['budget_cents'],
        ['budget', 'total_budget', 'allocated_budget'],
        0
      );
      const committed = policyMoneyFieldAsDollars(
        data,
        ['committed_cents'],
        ['committed', 'committed_amount', 'ordered_amount'],
        0
      );
      const available = policyMoneyFieldAsDollars(
        data,
        ['open_to_buy_cents', 'available_cents'],
        ['open_to_buy', 'available', 'remaining'],
        Math.max(0, budget - committed)
      );
      const drivers = Array.isArray(data.drivers)
        ? data.drivers.map((item) => (typeof item === 'string' ? { title: item } : item))
        : policyLines(data.drivers_text || data.notes || '').map((line, idx) => ({ title: `Driver ${idx + 1}`, meta: line, right: '' }));
      return {
        budget: policyNumber(budget, 0),
        committed: policyNumber(committed, 0),
        available: policyNumber(available, 0),
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || data.comment || '').trim(),
        drivers
      };
    }
    case 'supplier_constraints': {
      const sourceSuppliers = Array.isArray(data.suppliers) ? data.suppliers : (Array.isArray(data.items) ? data.items : []);
      const suppliers = sourceSuppliers.length
        ? sourceSuppliers.map((item) => (typeof item === 'string'
          ? { name: item }
          : {
              name: item.name || item.supplier_name || '',
              minimum_order: item.minimum_order || item.moq || '',
              lead_time: item.lead_time || item.lead_time_days || '',
              note: item.note || (Array.isArray(item.notes) ? item.notes.join(' ') : item.notes || '')
            }))
        : policyRows(data.constraints_text || data.constraints || data.notes || '', ['name', 'minimum_order', 'lead_time', 'note']).map((row) => ({
          name: row.name,
          minimum_order: row.minimum_order,
          lead_time: row.lead_time,
          note: row.note
        }));
      return {
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || data.summary || '').trim(),
        suppliers
      };
    }
    case 'po_workflow': {
      const steps = Array.isArray(data.steps)
        ? data.steps.map((item) => (typeof item === 'string' ? { step: item } : item))
        : policyLines(data.steps_text || data.notes || '').map((line) => ({ step: line }));
      return {
        approval_mode: String(data.approval_mode || data.mode || 'review').trim() || 'review',
        threshold: policyNumber((data.threshold_cents ?? data.threshold ?? data.approval_threshold ?? 0) / 100, 0),
        auto_email: policyYesNo(data.auto_email ?? data.send_email, true),
        steps,
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || '').trim()
      };
    }
    case 'transfer_opportunities': {
      const sourceOpportunities = Array.isArray(data.opportunities) ? data.opportunities : (Array.isArray(data.items) ? data.items : []);
      const opportunities = sourceOpportunities.length
        ? sourceOpportunities.map((item) => (typeof item === 'string'
          ? { sku: item }
          : {
              sku: item.sku || '',
              path: item.path || [item.from_location, item.to_location].filter(Boolean).join(' -> '),
              qty: item.qty || '',
              priority: item.priority || '',
              note: item.reason || item.note || ''
            }))
        : policyRows(data.opportunities_text || data.transfer_text || data.notes || '', ['sku', 'path', 'qty', 'priority']).map((row) => ({
          sku: row.sku,
          path: row.path,
          qty: row.qty,
          priority: row.priority
        }));
      return {
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || data.comment || '').trim(),
        priority: String(data.priority || 'medium').trim() || 'medium',
        opportunities
      };
    }
    case 'forecast_scenarios': {
      const scenarios = Array.isArray(data.scenarios)
        ? data.scenarios.map((item) => (typeof item === 'string'
          ? { name: item }
          : {
              name: item.name || '',
              horizon: policyRound((item.horizon_days ?? item.horizon ?? 84) / 7, 1, 12),
              lift: policyRound(item.lift_pct ?? item.lift ?? item.growth_pct ?? 0, 1, 0),
              note: item.note || (Array.isArray(item.notes) ? item.notes.join(' ') : item.notes || '')
            }))
        : policyRows(data.scenarios_text || data.notes || '', ['name', 'horizon', 'lift', 'note']).map((row) => ({
          name: row.name,
          horizon: row.horizon,
          lift: row.lift,
          note: row.note
        }));
      return {
        active: normalizeScenarioLabel(data.active || data.active_scenario_id || data.active_scenario || 'base'),
        horizon: policyRound((data.horizon_days ?? data.horizon ?? data.horizon_weeks ?? 84) / 7, 1, 12),
        lift: policyRound(data.lift ?? data.lift_pct ?? data.uplift_pct ?? 0, 1, 0),
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || '').trim(),
        scenarios
      };
    }
    case 'automation_rules': {
      const rules = Array.isArray(data.rules)
        ? data.rules.map((item) => (typeof item === 'string'
          ? { name: item }
          : {
              name: item.name || '',
              trigger: item.trigger || '',
              action: item.action || item.rule_action || '',
              owner: item.owner || '',
              enabled: item.enabled
            }))
        : policyRows(data.rules_text || data.notes || '', ['name', 'trigger', 'action', 'owner']).map((row) => ({
          name: row.name,
          trigger: row.trigger,
          action: row.action,
          owner: row.owner
        }));
      return {
        enabled: policyYesNo(data.enabled ?? data.is_enabled ?? true, true),
        cadence: String(data.cadence || data.schedule || 'Daily').trim() || 'Daily',
        notes: Array.isArray(data.notes) ? data.notes.join('\n') : String(data.notes || '').trim(),
        rules
      };
    }
    default:
      return data;
  }
}

function normalizePoliciesAutomationState(raw = {}) {
  const next = {
    loadedAt: policyTimestamp(raw.loadedAt, 0),
    lastSyncedAt: policyTimestamp(raw.lastSyncedAt, 0)
  };
  POLICY_FEATURE_KEYS.forEach((key) => {
    const src = raw?.[key] || {};
    next[key] = {
      loading: false,
      saving: false,
      error: String(src.error || ''),
      updatedAt: policyTimestamp(src.updatedAt, 0),
      data: normalizePolicyFeatureData(key, src.data || src)
    };
  });
  return next;
}

function loadPoliciesAutomationCache() {
  try {
    const raw = safeGet(STORAGE.policiesAutomation, '');
    if (!raw) return false;
    state.policiesAutomation = normalizePoliciesAutomationState(JSON.parse(raw));
    return true;
  } catch (_) {
    return false;
  }
}

function savePoliciesAutomationCache() {
  try {
    safeSet(STORAGE.policiesAutomation, JSON.stringify(state.policiesAutomation));
  } catch (_) {}
}

function renderPolicyStatus(key, text, tone = 'ok') {
  const el = policyNode(key, 'status');
  if (!el) return;
  el.textContent = String(text || 'Ready');
  el.classList.remove('soRc__policyStatus--ok', 'soRc__policyStatus--warn', 'soRc__policyStatus--err');
  if (tone) el.classList.add(`soRc__policyStatus--${tone}`);
}

function renderPolicyCard(key) {
  const data = getPolicyFeatureState(key).data || normalizePolicyFeatureData(key, {});
  const updatedAt = getPolicyFeatureState(key).updatedAt || 0;
  const isLoading = !!getPolicyFeatureState(key).loading;
  const error = String(getPolicyFeatureState(key).error || '');
  const statusText = isLoading
    ? 'Loading'
    : error
      ? 'Needs attention'
      : updatedAt
        ? `Synced ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(updatedAt))}`
        : 'Ready';
  renderPolicyStatus(key, statusText, error ? 'warn' : 'ok');

  switch (key) {
    case 'open_to_buy': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        summary.innerHTML = policySummaryHtml([
          {
            label: `Available to buy (Budget ${policyMoney(data.budget)} • Committed ${policyMoney(data.committed)})`,
            value: policyMoney(data.available)
          }
        ]);
      }
      if (policyNode(key, 'budget')) policyNode(key, 'budget').value = String(data.budget ?? 0);
      if (policyNode(key, 'committed')) policyNode(key, 'committed').value = String(data.committed ?? 0);
      if (policyNode(key, 'available')) policyNode(key, 'available').value = String(data.available ?? 0);
      if (policyNode(key, 'notes')) policyNode(key, 'notes').value = String(data.notes || '');
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.drivers || []).map((item, idx) => ({
          title: item.title || item.name || `Driver ${idx + 1}`,
          meta: item.meta || item.note || item.description || '',
          right: item.right || item.value || ''
        })), 'No OTB drivers yet.');
      }
      break;
    }
    case 'supplier_constraints': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        summary.innerHTML = policySummaryHtml([
          { label: 'Suppliers', value: String((data.suppliers || []).length || 0) },
          { label: 'Notes', value: data.notes ? 'Added' : 'Empty' },
          { label: 'Mode', value: 'Manual' }
        ]);
      }
      if (policyNode(key, 'text')) policyNode(key, 'text').value = policyRowsToText(data.suppliers || [], ['name', 'minimum_order', 'lead_time', 'note']);
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.suppliers || []).map((item, idx) => ({
          title: item.name || item.vendor || `Supplier ${idx + 1}`,
          meta: [item.minimum_order ? `Min order: ${item.minimum_order}` : '', item.lead_time ? `Lead time: ${item.lead_time}` : '', item.note || ''].filter(Boolean).join(' | '),
          right: item.status || ''
        })), 'No supplier constraints yet.');
      }
      break;
    }
    case 'po_workflow': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        summary.innerHTML = policySummaryHtml([
          { label: 'Mode', value: data.approval_mode || 'review' },
          { label: 'Threshold', value: policyMoney(data.threshold) },
          { label: 'Auto email', value: data.auto_email ? 'Yes' : 'No' }
        ]);
      }
      if (policyNode(key, 'approvalMode')) policyNode(key, 'approvalMode').value = String(data.approval_mode || 'review');
      if (policyNode(key, 'threshold')) policyNode(key, 'threshold').value = String(data.threshold ?? 0);
      if (policyNode(key, 'autoEmail')) policyNode(key, 'autoEmail').value = data.auto_email ? 'yes' : 'no';
      if (policyNode(key, 'steps')) policyNode(key, 'steps').value = policyRowsToText(data.steps || [], ['step']);
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.steps || []).map((item, idx) => ({
          title: item.step || item.name || `Step ${idx + 1}`,
          meta: item.note || '',
          right: item.status || ''
        })), 'No workflow steps configured.');
      }
      break;
    }
    case 'transfer_opportunities': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        summary.innerHTML = policySummaryHtml([
          { label: 'Opportunities', value: String((data.opportunities || []).length || 0) },
          { label: 'Priority', value: data.priority || 'medium' },
          { label: 'Notes', value: data.notes ? 'Added' : 'Empty' }
        ]);
      }
      if (policyNode(key, 'notes')) policyNode(key, 'notes').value = String(data.notes || '');
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.opportunities || []).map((item, idx) => ({
          title: item.sku || item.name || `Transfer ${idx + 1}`,
          meta: [item.path || [item.from, item.to].filter(Boolean).join(' -> '), item.qty ? `Qty: ${item.qty}` : '', item.note || ''].filter(Boolean).join(' | '),
          right: item.priority || ''
        })), 'No transfer opportunities yet.');
      }
      break;
    }
    case 'forecast_scenarios': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        const horizonWeeks = policyRound(data.horizon, 1, 12);
        const liftPct = policyRound(data.lift, 1, 0);
        summary.innerHTML = policySummaryHtml([
          { label: 'Active', value: String(data.active || 'base').replace(/^./, (c) => c.toUpperCase()) },
          { label: 'Horizon', value: `${horizonWeeks} wks` },
          { label: 'Lift', value: `${liftPct}%` }
        ]);
      }
      if (policyNode(key, 'active')) policyNode(key, 'active').value = normalizeScenarioLabel(data.active || 'base');
      if (policyNode(key, 'horizon')) policyNode(key, 'horizon').value = String(policyRound(data.horizon, 1, 12));
      if (policyNode(key, 'lift')) policyNode(key, 'lift').value = String(policyRound(data.lift, 1, 0));
      if (policyNode(key, 'notes')) policyNode(key, 'notes').value = String(data.notes || '');
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.scenarios || []).map((item, idx) => ({
          title: item.name || `Scenario ${idx + 1}`,
          meta: [item.horizon ? `${item.horizon} wks` : '', item.lift ? `${item.lift}%` : '', item.note || ''].filter(Boolean).join(' | '),
          right: item.forecast || ''
        })), 'No forecast scenarios yet.');
      }
      break;
    }
    case 'automation_rules': {
      const summary = policyNode(key, 'summary');
      if (summary) {
        summary.innerHTML = policySummaryHtml([
          { label: 'Enabled', value: data.enabled ? 'Yes' : 'No' },
          { label: 'Cadence', value: data.cadence || 'Daily' },
          { label: 'Rules', value: String((data.rules || []).length || 0) }
        ]);
      }
      if (policyNode(key, 'enabled')) policyNode(key, 'enabled').value = data.enabled ? 'yes' : 'no';
      if (policyNode(key, 'cadence')) policyNode(key, 'cadence').value = String(data.cadence || 'Daily');
      if (policyNode(key, 'text')) policyNode(key, 'text').value = policyRowsToText(data.rules || [], ['name', 'trigger', 'action', 'owner']);
      if (policyNode(key, 'list')) {
        policyNode(key, 'list').innerHTML = policyListHtml((data.rules || []).map((item, idx) => ({
          title: item.name || `Rule ${idx + 1}`,
          meta: [item.trigger || '', item.action || '', item.owner || ''].filter(Boolean).join(' | '),
          right: item.enabled === false ? 'Off' : 'On'
        })), 'No automation rules yet.');
      }
      break;
    }
    default:
      break;
  }
}

function renderPoliciesAutomation() {
  if (policyNode('open_to_buy', 'meta')) {
    policyNode('open_to_buy', 'meta').textContent = 'Budget guardrail and available buy capacity.';
  }

  const loadedAt = state.policiesAutomation.loadedAt || state.policiesAutomation.lastSyncedAt || 0;
  if (policyNode('open_to_buy', 'meta')) {
    const meta = policyNode('open_to_buy', 'meta');
    if (meta) meta.textContent = 'Budget guardrail and available buy capacity.';
  }
  const panelMeta = root.querySelector('#soPoliciesAutomationMeta');
  if (panelMeta) {
    panelMeta.textContent = loadedAt
      ? `Last synced ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(loadedAt))}.`
      : 'Loading policy controls and automation rules...';
  }

  renderPolicyCard('open_to_buy');
  renderPolicyCard('supplier_constraints');
  renderPolicyCard('po_workflow');
  renderPolicyCard('transfer_opportunities');
  renderPolicyCard('forecast_scenarios');
  renderPolicyCard('automation_rules');

  const openToBuy = getPolicyFeatureState('open_to_buy').data || {};
  const transfer = getPolicyFeatureState('transfer_opportunities').data || {};
  const automation = getPolicyFeatureState('automation_rules').data || {};

  const otbKpi = root.querySelector('#soPoliciesOtbKpi');
  const otbSub = root.querySelector('#soPoliciesOtbSub');
  if (otbKpi) otbKpi.textContent = policyMoney(openToBuy.available ?? 0);
  if (otbSub) otbSub.textContent = openToBuy.committed ? `${policyMoney(openToBuy.committed)} committed` : 'No committed spend yet';

  const transferKpi = root.querySelector('#soPoliciesTransferKpi');
  const transferSub = root.querySelector('#soPoliciesTransferSub');
  if (transferKpi) transferKpi.textContent = String((transfer.opportunities || []).length || 0);
  if (transferSub) transferSub.textContent = transfer.priority ? `Priority ${transfer.priority}` : 'No priority set';

  const automationKpi = root.querySelector('#soPoliciesAutomationKpi');
  const automationSub = root.querySelector('#soPoliciesAutomationSub');
  if (automationKpi) automationKpi.textContent = automation.enabled ? 'On' : 'Off';
  if (automationSub) automationSub.textContent = automation.cadence || 'Daily';
}

function syncOpenToBuyAvailableFromInputs() {
  const budgetEl = policyNode('open_to_buy', 'budget');
  const committedEl = policyNode('open_to_buy', 'committed');
  const availableEl = policyNode('open_to_buy', 'available');
  if (!budgetEl || !committedEl) return;
  const budget = policyNumber(budgetEl.value, 0);
  const committed = policyNumber(committedEl.value, 0);
  const nextAvailable = Math.max(0, Math.round(budget - committed));
  if (availableEl) availableEl.value = String(nextAvailable);

  const feature = getPolicyFeatureState('open_to_buy');
  const data = feature.data || normalizePolicyFeatureData('open_to_buy', {});
  setPolicyFeatureState('open_to_buy', {
    data: {
      ...data,
      budget,
      committed,
      available: nextAvailable
    }
  });
  renderPoliciesAutomation();
}

async function retailerPlanFeatureRequest({ view = '', action = '', method = 'GET', body = null } = {}) {
  const u = new URL(RETAILER_PLAN_API);
  const id = getPlanIdentity();
  if (id?.user_id) u.searchParams.set('user_id', String(id.user_id).trim());
  if (id?.email) u.searchParams.set('email', String(id.email).trim().toLowerCase());
  if (view) u.searchParams.set('view', String(view));
  if (action) u.searchParams.set('action', String(action));
  u.searchParams.set('_ts', String(Date.now()));
  await ensureBackendJwt();
  const r = await fetch(u.toString(), {
    method,
    headers: authHeaders(body == null ? {} : { 'Content-Type': 'application/json' }),
    body: body == null ? undefined : JSON.stringify(body),
    cache: 'no-store'
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j?.ok === false) {
    throw new Error(String(j?.error || j?.message || `${view || action || 'retailer_plan'}_failed`));
  }
  return j;
}

async function loadPolicyFeature(key, opts = {}) {
  const config = POLICY_API_CONFIG[key];
  if (!config) return null;
  const feature = setPolicyFeatureState(key, { loading: true, error: '' });
  if (!opts?.silent) renderPoliciesAutomation();
  try {
    const j = await retailerPlanFeatureRequest({ view: config.view, method: 'GET' });
    const raw = unwrapPolicyPayload(key, j);
    const hasPayload = hasMeaningfulPolicyPayload(key, raw);
    const data = hasPayload
      ? normalizePolicyFeatureData(key, raw)
      : (getPolicyFeatureState(key).data || normalizePolicyFeatureData(key, {}));
    setPolicyFeatureState(key, {
      loading: false,
      error: '',
      updatedAt: policyTimestamp(j?.updated_at || raw?.updated_at || raw?.updatedAt || Date.now(), Date.now()),
      data
    });
    state.policiesAutomation.loadedAt = Date.now();
    state.policiesAutomation.lastSyncedAt = Date.now();
    savePoliciesAutomationCache();
    return data;
  } catch (err) {
    setPolicyFeatureState(key, {
      loading: false,
      error: String(err?.message || 'load_failed')
    });
    if (!getPolicyFeatureState(key).data) {
      setPolicyFeatureState(key, { data: normalizePolicyFeatureData(key, {}) });
    }
    if (!opts?.silent && uiPrefs.activeTab === 'policies-automation') {
      showToast(`${POLICY_FEATURE_LABELS[key] || key} load failed`, 'warn');
    }
    return getPolicyFeatureState(key).data;
  } finally {
    if (!opts?.silent) renderPoliciesAutomation();
  }
}

async function savePolicyFeature(key) {
  const config = POLICY_API_CONFIG[key];
  if (!config) return null;
  const current = getPolicyFeatureState(key);
  const previousData = current.data || normalizePolicyFeatureData(key, {});
  const body = buildPolicyPayload(key);
  const optimisticData = normalizePolicyFeatureData(key, body);

  // Optimistic UI: reflect user-entered values immediately on Save.
  setPolicyFeatureState(key, {
    data: optimisticData,
    saving: true,
    error: ''
  });
  renderPoliciesAutomation();

  if (key === 'open_to_buy') {
    // Keep plan-level budget aligned with manual OTB edits.
    state.plan.budget = policyNumber(optimisticData?.budget, state.plan.budget || 0);
    renderPlan();
  }
  try {
    const j = await retailerPlanFeatureRequest({ action: config.action, method: 'POST', body });
    const responsePayload = unwrapPolicyPayload(key, j);
    const raw = hasMeaningfulPolicyPayload(key, responsePayload) ? responsePayload : body;
    const data = normalizePolicyFeatureData(key, raw);
    setPolicyFeatureState(key, {
      saving: false,
      error: '',
      updatedAt: policyTimestamp(j?.updated_at || raw?.updated_at || raw?.updatedAt || Date.now(), Date.now()),
      data
    });
    state.policiesAutomation.loadedAt = Date.now();
    state.policiesAutomation.lastSyncedAt = Date.now();
    savePoliciesAutomationCache();
    renderPoliciesAutomation();
    // Background re-sync to ensure UI matches persisted backend shape.
    loadPolicyFeature(key, { silent: true }).then(() => {
      renderPoliciesAutomation();
    }).catch(() => {});
    showToast(`${POLICY_FEATURE_LABELS[key] || key} saved`, 'ok');
    return data;
  } catch (err) {
    setPolicyFeatureState(key, {
      saving: false,
      error: String(err?.message || 'save_failed'),
      data: previousData
    });
    renderPoliciesAutomation();
    showToast(String(err?.message || `${POLICY_FEATURE_LABELS[key] || key} save failed`), 'err');
    return null;
  }
}

async function loadPoliciesAutomation(force = false) {
  if (policiesAutomationLoadPromise && !force) return policiesAutomationLoadPromise;
  const cachedLoaded = !!state.policiesAutomation.loadedAt;
  if (cachedLoaded && !force) renderPoliciesAutomation();
  POLICY_FEATURE_KEYS.forEach((key) => setPolicyFeatureState(key, { loading: true, error: '' }));
  renderPoliciesAutomation();
  policiesAutomationLoadPromise = (async () => {
    await Promise.all(POLICY_FEATURE_KEYS.map((key) => loadPolicyFeature(key, { silent: true })));
    renderPoliciesAutomation();
    return state.policiesAutomation;
  })().finally(() => {
    policiesAutomationLoadPromise = null;
  });
  return policiesAutomationLoadPromise;
}

function buildPolicyPayload(key) {
  switch (key) {
    case 'open_to_buy': {
      const budget = policyNumber(policyNode(key, 'budget')?.value, 0);
      const committed = policyNumber(policyNode(key, 'committed')?.value, 0);
      const availableInput = policyNode(key, 'available');
      const available = availableInput
        ? policyNumber(availableInput.value, Math.max(0, budget - committed))
        : Math.max(0, budget - committed);
      return {
        budget_cents: Math.round(budget * 100),
        committed_cents: Math.round(committed * 100),
        open_to_buy_cents: Math.round(available * 100),
        notes: String(policyNode(key, 'notes')?.value || '').trim()
      };
    }
    case 'supplier_constraints': {
      const text = String(policyNode(key, 'text')?.value || '').trim();
      return {
        notes: text,
        constraints_text: text,
        suppliers: policyRows(text, ['name', 'minimum_order', 'lead_time', 'note'])
      };
    }
    case 'po_workflow': {
      const stepsText = String(policyNode(key, 'steps')?.value || '').trim();
      return {
        approval_mode: String(policyNode(key, 'approvalMode')?.value || 'review').trim() || 'review',
        threshold_cents: Math.round(policyNumber(policyNode(key, 'threshold')?.value, 0) * 100),
        auto_email: policyYesNo(policyNode(key, 'autoEmail')?.value, true),
        steps_text: stepsText,
        steps: policyRows(stepsText, ['step']),
        notes: String(stepsText || '').trim()
      };
    }
    case 'transfer_opportunities':
      return {
        notes: String(policyNode(key, 'notes')?.value || '').trim()
      };
    case 'forecast_scenarios': {
      const notes = String(policyNode(key, 'notes')?.value || '').trim();
      return {
        active: String(policyNode(key, 'active')?.value || 'base').trim() || 'base',
        horizon_days: Math.max(1, Math.round(policyNumber(policyNode(key, 'horizon')?.value, 12) * 7)),
        lift_pct: policyNumber(policyNode(key, 'lift')?.value, 0),
        notes,
        scenarios_text: notes
      };
    }
    case 'automation_rules': {
      const text = String(policyNode(key, 'text')?.value || '').trim();
      return {
        enabled: policyYesNo(policyNode(key, 'enabled')?.value, true),
        cadence: String(policyNode(key, 'cadence')?.value || 'Daily').trim() || 'Daily',
        notes: text,
        rules_text: text,
        rules: policyRows(text, ['name', 'trigger', 'action', 'owner'])
      };
    }
    default:
      return {};
  }
}

const POLICY_FEATURE_LABELS = {
  open_to_buy: 'Open-to-Buy',
  supplier_constraints: 'Supplier Constraints',
  po_workflow: 'PO Workflow',
  transfer_opportunities: 'Transfer Opportunities',
  forecast_scenarios: 'Forecast Scenarios',
  automation_rules: 'Automation Rules'
};

const POLICY_RESPONSE_FIELDS = {
  open_to_buy: ['budget_cents', 'budget', 'total_budget', 'allocated_budget', 'committed_cents', 'committed', 'committed_amount', 'ordered_amount', 'open_to_buy_cents', 'available', 'remaining', 'drivers', 'drivers_text', 'notes'],
  supplier_constraints: ['suppliers', 'items', 'constraints_text', 'constraints', 'notes', 'summary'],
  po_workflow: ['approval_mode', 'mode', 'threshold_cents', 'threshold', 'approval_threshold', 'auto_email', 'send_email', 'steps', 'steps_text', 'notes'],
  transfer_opportunities: ['opportunities', 'items', 'opportunities_text', 'transfer_text', 'priority', 'notes', 'comment'],
  forecast_scenarios: ['active', 'active_scenario_id', 'active_scenario', 'horizon_days', 'horizon_weeks', 'horizon', 'lift_pct', 'lift', 'uplift_pct', 'scenarios', 'scenarios_text', 'notes'],
  automation_rules: ['enabled', 'is_enabled', 'cadence', 'schedule', 'rules', 'rules_text', 'notes']
};

function hasMeaningfulPolicyPayload(key, payload = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  const fields = POLICY_RESPONSE_FIELDS[key] || [];
  return fields.some((field) => Object.prototype.hasOwnProperty.call(payload, field));
}

function markLocalPlanChange() {
  const iso = new Date().toISOString();
  state.plan._updated_at = iso;
  lastPlanSyncAt = Date.parse(iso) || Date.now();
}

async function loadPlanFromBackend() {
  const id = getPlanIdentity();
  if (!id.user_id && !id.email) return false;

  await ensureBackendJwt();

  const r = await fetch(retailerPlanUrl(id), {
    headers: authHeaders(),
    cache: 'no-store'
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) return false;

  const remotePlan = j.plan || null;
  const remoteProfile = j.profile || null;

  if (remotePlan && typeof remotePlan === 'object') {
    state.plan = {
      ...state.plan,
      budget: Number(remotePlan?.budget ?? state.plan.budget ?? 0),
      risk: remotePlan?.risk ?? state.plan.risk,
      margin: remotePlan?.margin ?? state.plan.margin,
      recommended_lines: Array.isArray(remotePlan?.recommended_lines)
        ? remotePlan.recommended_lines
        : state.plan.recommended_lines,
      assumptions: Array.isArray(remotePlan?.assumptions)
        ? remotePlan.assumptions
        : state.plan.assumptions,
      missing: Array.isArray(remotePlan?.missing)
        ? remotePlan.missing
        : state.plan.missing,
      _updated_at: j.updated_at || remotePlan?._updated_at || state.plan._updated_at
    };

    lastPlanSyncAt = Date.parse(j.updated_at || remotePlan?._updated_at || 0) || Date.now();
  }

  if (remoteProfile && typeof remoteProfile === 'object') {
    state.profile = {
      ...state.profile,
      store_type: remoteProfile?.store_type ?? state.profile.store_type,
      location: remoteProfile?.location ?? state.profile.location,
      locations_count: remoteProfile?.locations_count ?? state.profile.locations_count,
      budget: remoteProfile?.budget ?? state.profile.budget,
      priority: remoteProfile?.priority ?? state.profile.priority,
      constraints: remoteProfile?.constraints ?? state.profile.constraints
    };
  }

  renderPlan();
  return true;
}

async function hydrateChatsFromBackend() {
  const threads = await apiListChats(50);
  state.chats = threads.map((t) => ({
    id: String(t.id),
    title: t.title || 'New chat',
    meta: 'Synced',
    messages: [],
    draft: '',
    attachmentSummary: '',
    unreadCount: 0,
    lastSeenAt: Date.now(),
    createdAt: Date.parse(t.created_at || 0) || Date.now()
  }));

  if (!state.activeChatId || !state.chats.some((c) => c.id === state.activeChatId)) {
    state.activeChatId = state.chats[0]?.id || null;
  }
  saveState();
}

async function hydrateActiveChatMessages() {
  const c = currentChat();
  if (!c) return;
  const rows = await apiGetChatMessages(c.id, 300);
  c.messages = rows.map((m) => ({
    role: m.role,
    text: m.content,
    at: Date.parse(m.created_at || 0) || Date.now(),
    kind: m.kind || null
  }));
}

async function savePlanNow() {
  const id = getPlanIdentity();
  if (!id.user_id && !id.email) return;

  markLocalPlanChange();
  await ensureBackendJwt();

  const r = await fetch(retailerPlanUrl(id), {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    cache: 'no-store',
    body: JSON.stringify({
  user_id: id.user_id,
  email: id.email,
  plan: state.plan,
  profile: state.profile
})
  });

  const raw = await r.text();
  let j = {};
  try { j = raw ? JSON.parse(raw) : {}; } catch { j = { raw }; }

  if (!r.ok || !j?.ok) {
    console.error('savePlanNow failed', r.status, j);
    throw new Error(j?.error || `plan_save_failed_${r.status}`);
  }

  lastPlanSyncAt = Date.parse(j.updated_at || 0) || Date.now();
  await loadPlanFromBackend();
    renderPlan();
}

function queuePlanSave() {
  clearTimeout(planSaveTimer);
  planSaveTimer = setTimeout(async () => {
    if (saveInFlight) return;

    const id = getPlanIdentity();
    if (!id.user_id && !id.email) return;

    saveInFlight = true;
    try {
      markLocalPlanChange();
      await ensureBackendJwt();

      const r = await fetch(retailerPlanUrl(id), {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        cache: 'no-store',
        body: JSON.stringify({
  user_id: id.user_id,
  email: id.email,
  plan: state.plan,
  profile: state.profile
})
      });

      const raw = await r.text();
      let j = {};
      try { j = raw ? JSON.parse(raw) : {}; } catch { j = { raw }; }

      if (!r.ok || !j?.ok) {
        console.error('queuePlanSave failed', r.status, j);
        showToast('Could not save cart', 'err');
        return;
      }

      lastPlanSyncAt = Date.parse(j.updated_at || 0) || Date.now();
    } catch (e) {
      console.error('queuePlanSave exception', e);
      showToast('Could not save cart', 'err');
    } finally {
      saveInFlight = false;
    }
  }, 300);
}

async function syncPlanNow() {
  try { await loadPlanFromBackend(); } catch (e) { console.error(e); }
}

const PLAN_POLL_MS = 5000;
setInterval(syncPlanNow, PLAN_POLL_MS);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') syncPlanNow();
});

async function clearShopifyCart() {
  const r = await fetch('/cart/clear.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(text || 'cart_clear_failed');
  }
  return r.json().catch(() => ({}));
}

async function addLinesToShopifyCart(lines) {
  const items = (Array.isArray(lines) ? lines : [])
    .map((line) => ({
      id: Number(line.shopify_variant_id || 0),
      quantity: Math.max(1, Number(line.quantity || 1))
    }))
    .filter((line) => Number.isFinite(line.id) && line.id > 0 && line.quantity > 0);

  if (!items.length) throw new Error('cart_lines_missing');

  const r = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ items })
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.description || j?.message || j?.error || 'cart_add_failed');
  return j;
}

async function changeShopifyCartLine(lineKey, quantity) {
  const r = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      id: String(lineKey || ''),
      quantity: Math.max(0, Number(quantity || 0))
    })
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.description || j?.message || j?.error || 'cart_change_failed');
  return j;
}

async function addSingleVariantToShopifyCart(variantId, quantity) {
  const id = Number(variantId || 0);
  const qty = Math.max(1, Number(quantity || 1));
  if (!id) throw new Error('variant_id_missing');

  const r = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      items: [{ id, quantity: qty }]
    })
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.description || j?.message || j?.error || 'cart_add_failed');
  return j;
}

async function fetchShopifyCart() {
  const r = await fetch('/cart.js', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.description || j?.message || j?.error || 'cart_fetch_failed');
  return j;
}

async function applyChatCartAction(cartAction) {
  if (!cartAction) return false;

  if (cartAction.type === 'clear_cart') {
    await clearShopifyCart();
    return true;
  }

  if (cartAction.type === 'apply_plan_to_cart') {
    const lines = Array.isArray(cartAction.lines) ? cartAction.lines : [];
    if (!lines.length) throw new Error('cart_action_empty');

    await addLinesToShopifyCart(lines);
    return true;
  }

  return false;
}

async function getLiveCartContext() {
  try {
    const cart = await fetchShopifyCart();

    state.liveCart = {
      item_count: Number(cart?.item_count || 0),
      total: Number(((Number(cart?.total_price || 0)) / 100).toFixed(2)),
      items: Array.isArray(cart?.items)
        ? cart.items.map((item) => ({
            key: String(item?.key || ''),
            variant_id: Number(item?.variant_id || 0),
            title: String(item?.product_title || item?.title || ''),
            quantity: Math.max(1, Number(item?.quantity || 1)),
            unit_price: Number(((Number(item?.final_price || item?.price || 0)) / 100).toFixed(2)),
            total: Number(((Number(item?.final_line_price || 0)) / 100).toFixed(2)),
            image: String(item?.featured_image?.url || item?.image || '')
          }))
        : []
    };

    return {
      item_count: state.liveCart.item_count,
      cart_total: state.liveCart.total,
      items: state.liveCart.items.map((item) => ({
        title: item.title,
        quantity: item.quantity
      }))
    };
  } catch (e) {
    state.liveCart = { item_count: 0, total: 0, items: [] };
    return {
      item_count: 0,
      cart_total: 0,
      items: []
    };
  }
}

        function applyTheme(mode) {
          const light = mode === 'light';
          root.setAttribute('data-theme', light ? 'light' : 'dark');
          document.documentElement.style.backgroundColor = light ? '#f4f5f7' : '#0b0d10';
          document.body.style.backgroundColor = light ? '#f4f5f7' : '#0b0d10';
          document.documentElement.setAttribute('data-so-rc-theme', light ? 'light' : 'dark');
          document.body.setAttribute('data-so-rc-theme', light ? 'light' : 'dark');
          els.themeToggle?.classList.toggle('is-on', light);
          if (els.themeLabel) els.themeLabel.textContent = light ? 'Light' : 'Dark';
          if (root.classList.contains('is-chat-empty')) {
            logoIntroStarted = false;
            runLogoIntroOnce();
          }
        }
        applyTheme(readThemePreference());

        function ensurePanelStatusPills() {
          (els.panels || []).forEach((panel) => {
            if (!panel || panel.querySelector('.soRc__panelStatusPills')) return;
            const wrap = document.createElement('div');
            wrap.className = 'soRc__panelStatusPills';
            const plan = document.createElement('div');
            plan.className = 'soRc__panelStatusPill soRc__panelStatusPill--plan';
            plan.innerHTML = '<b>Plan</b>: Loading...';
            const sync = document.createElement('div');
            sync.className = 'soRc__panelStatusPill soRc__panelStatusPill--sync';
            sync.innerHTML = '<b>Last synced</b>: Never';
            wrap.appendChild(plan);
            wrap.appendChild(sync);
            panel.insertBefore(wrap, panel.firstChild);
          });
          if (els.planStatusBanner) els.planStatusBanner.style.display = 'none';
        }

        ensurePanelStatusPills();

        function closeMenu() {
  if (!els.acctMenu || !els.acctBtn) return;
  els.acctMenu.hidden = true;
  els.acctBtn.setAttribute('aria-expanded', 'false');
  els.acctBtn.classList.remove('is-open');
}

function openMenu() {
  if (!els.acctMenu || !els.acctBtn) return;
  els.acctMenu.hidden = false;
  els.acctBtn.setAttribute('aria-expanded', 'true');
  els.acctBtn.classList.add('is-open');
}

function closePerfConnectionsMenu() {
  if (!els.perfConnectionsMenu || !els.perfConnectionsBtn) return;
  els.perfConnectionsMenu.hidden = true;
  els.perfConnectionsBtn.setAttribute('aria-expanded', 'false');
}

function openPerfConnectionsMenu() {
  if (!els.perfConnectionsMenu || !els.perfConnectionsBtn) return;
  els.perfConnectionsMenu.hidden = false;
  els.perfConnectionsBtn.setAttribute('aria-expanded', 'true');
}

root.addEventListener('click', (e) => {
  const acctBtnHit = e.target.closest('#soAcctBtn');
  const acctMenuHit = e.target.closest('#soAcctMenu');
  const perfBtnHit = e.target.closest('#soPerfConnectionsBtn');
  const perfMenuHit = e.target.closest('#soPerfConnectionsMenu');

  if (acctBtnHit) {
    if (els.acctMenu?.hidden) openMenu();
    else closeMenu();
    return;
  }

  if (perfBtnHit) {
    if (els.perfConnectionsMenu?.hidden !== false) openPerfConnectionsMenu();
    else closePerfConnectionsMenu();
    return;
  }

  if (!acctMenuHit) closeMenu();
  if (!perfMenuHit) closePerfConnectionsMenu();
});

        els.themeToggle?.addEventListener('click', () => {
  const next = (safeGet(STORAGE.theme, 'dark') === 'dark') ? 'light' : 'dark';
  persistThemePreference(next);
  applyTheme(next);
});

function setActiveTab(tabName) {
  uiPrefs.activeTab = tabName;
  saveState();

  els.navItems.forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabName));
  els.panels.forEach(p => p.hidden = p.dataset.panel !== tabName);

  if (tabName === 'chat') markActiveChatSeen();
  if (tabName === 'reorders') {
  loadReorders();
}
if (tabName === 'performance') {
  loadPerformanceStatus();
} else {
  closePerfConnectionsMenu();
}
if (tabName === 'forecasts' || tabName === 'classification' || tabName === 'locations') {
  ensurePerformanceSnapshot().catch(() => {});
}
if (tabName === 'policies-automation') {
  loadPoliciesAutomation();
}
if (tabName === 'plan') {
  loadBillingUsageOnly();
}

}


        function setSub(sub) {
  uiPrefs.activeSubTab = sub;
  saveState();
  els.subTabs.forEach(b => b.classList.toggle('is-active', b.dataset.sub === sub));
  els.subPanels.forEach(p => p.hidden = p.dataset.subpanel !== sub);
}

els.navItems.forEach(b => b.addEventListener('click', async () => {
  if (b.dataset.lockedNav === '1') return;
  if (b.dataset.upgradeRequired === '1') {
    await openPricingWithStepUp();
    return;
  }
  if (b.dataset.action === 'new-chat') {
    await createChat();
    setActiveTab('chat');
    return; // no closeSidebarOnMobile() here
  }

  if (b.dataset.tab) {
    setActiveTab(b.dataset.tab);
    closeSidebarOnMobile();
  }
}));

els.subTabs.forEach(b => b.addEventListener('click', () => setSub(b.dataset.sub)));

els.mobileClose?.addEventListener('click', (e) => {
  e.stopPropagation();
  root.classList.remove('is-sidebar-open');
});



        function deriveChatTitle(text) {
          const t = (text || '').trim();
          if (!t) return 'New chat';
          const cleaned = t.replace(/\s+/g, ' ').replace(/[^\w\s$-]/g, '');
          return cleaned.split(' ').slice(0, 6).join(' ');
        }

        function currentChat() { return state.chats.find(c => c.id === state.activeChatId) || null; }

        function markActiveChatSeen() {
  const c = currentChat();
  if (!c) return;
  c.lastSeenAt = Date.now();
  c.unreadCount = 0;
  saveState();
  renderRecent();
}

function incrementUnreadForChat(chatId) {
  const c = state.chats.find(x => x.id === chatId);
  if (!c) return;
  if (chatId === state.activeChatId && uiPrefs.activeTab === 'chat') return;
  c.unreadCount = (c.unreadCount || 0) + 1;
}

        async function createChat(seedText = '') {
  const fallbackTitle = deriveChatTitle(seedText) || 'New chat';
  let created = null;
  let id = '';
  let meta = 'Synced';

  try {
    created = await apiCreateChat(fallbackTitle);
    id = String(created.id || '');
  } catch (_) {
    id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    meta = 'Local only';
  }

  if (!id) {
    id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    meta = 'Local only';
  }

  state.chats.unshift({
    id,
    title: (created && created.title) || fallbackTitle,
    meta,
    messages: [],
    draft: '',
    attachmentSummary: '',
    unreadCount: 0,
    lastSeenAt: Date.now(),
    createdAt: Date.parse((created && created.created_at) || 0) || Date.now()
  });

  state.activeChatId = id;
  saveState();
  renderRecent();
  renderChat();
  updateSendState();
}

        async function deleteChat(id) {
  const isLocalOnly = String(id || '').startsWith('local-');
  if (!isLocalOnly) {
    try {
      await apiDeleteChat(id);
    } catch (_) {
      showToast('Could not delete synced chat. Removed from this session.', 'warn');
    }
  }
  const idx = state.chats.findIndex(c => c.id === id);
  if (idx > -1) state.chats.splice(idx, 1);
  if (state.activeChatId === id) state.activeChatId = state.chats[0]?.id || null;
  saveState();
  renderRecent();
  renderChat();
}

        function addMessage(role, text) {
  const c = currentChat();
  if (!c) return;

  const trimmed = String(text || '').trim();
  if (!trimmed) return;

  c.messages.push({ role, text: trimmed, at: Date.now() });
  c.meta = role === 'user' ? 'Active now' : c.meta;
  saveState();
  renderChat();
  renderRecent();

  apiAddMessage(c.id, role, trimmed).catch(() => {
    showToast('Message sync failed', 'warn');
  });
}

function renderRecent() {
  if (!els.recentList) return;
  if (!state.chats.length) {
    els.recentList.innerHTML = `<div class="soRc__emptyMini">No saved chats.</div>`;
    return;
  }

  els.recentList.innerHTML = state.chats.map((c, i) => `
    <div class="soRc__recentItem ${c.id === state.activeChatId ? 'is-active' : ''}" data-chat="${c.id}" tabindex="0" data-chat-idx="${i}">
      <div class="soRc__recentMain">
        <div class="soRc__recentTitle">${esc(c.title)}</div>
        <div class="soRc__recentMeta">${esc(c.meta)}</div>
      </div>
      ${(c.unreadCount || 0) > 0 ? `<span class="soRc__recentUnread">${c.unreadCount > 9 ? '9+' : c.unreadCount}</span>` : ''}
      <button class="soRc__recentDel" type="button" data-del-chat="${c.id}" aria-label="Delete chat">×</button>
${pendingDeleteChatId === c.id ? `
  <div class="soRc__confirmCard">
    <div class="soRc__confirmText">Delete this chat?</div>
    <div class="soRc__confirmActions">
      <button class="soRc__confirmBtn soRc__confirmBtn--danger" type="button" data-open-del-modal="${c.id}">Delete</button>
      <button class="soRc__confirmBtn" type="button" data-cancel-del="1">Cancel</button>
    </div>
  </div>
` : ''}
    </div>
  `).join('');
  updateJumpButton();
}

function renderDeleteModal() {
  if (!els.deleteModal) return;
  if (!modalDeleteChatId) {
    els.deleteModal.classList.remove('is-open');
    els.deleteModal.setAttribute('aria-hidden', 'true');
    els.deleteModal.innerHTML = '';
    return;
  }

  const chat = state.chats.find((c) => c.id === modalDeleteChatId);
  const title = chat?.title || 'this chat';
  els.deleteModal.innerHTML = `
    <div class="soRc__delCard" role="dialog" aria-modal="true" aria-label="Delete chat confirmation">
      <div class="soRc__delTitle">Are you sure?</div>
      <div class="soRc__delBody">Delete "${esc(title)}"? This cannot be undone.</div>
      <div class="soRc__delActions">
        <button class="soRc__confirmBtn soRc__confirmBtn--danger" type="button" data-confirm-del-modal="${esc(modalDeleteChatId)}">Delete</button>
        <button class="soRc__confirmBtn" type="button" data-close-del-modal="1">Cancel</button>
      </div>
    </div>
  `;
  els.deleteModal.classList.add('is-open');
  els.deleteModal.setAttribute('aria-hidden', 'false');
}

function renderShopSkeleton(count = 8) {
  if (!els.shopGrid) return;
  els.shopGrid.innerHTML = Array.from({ length: count }).map(() => `<div class="soRc__skeleton"></div>`).join('');
}

function heroIntroText() {
  const n = String(CUSTOMER_FIRST_NAME || '').trim();
  return n ? `Hey ${n}, what's on your mind?` : "Hey, what's on your mind?";
}

// Greeting variants keyed by context type
const GREETING_VARIANTS = {
  stockout_risk: (n) => n ? `Hey ${n}, any stockouts to handle?` : "Hey, any stockouts to handle?",
  pending_recs:   (n) => n ? `Hey ${n}, any updates on your recommendations?` : "Hey, any updates on your recommendations?",
  low_margin:     (n) => n ? `Hey ${n}, want to check on your margins?` : "Hey, want to check on your margins?",
  sales_up:       (n) => n ? `Hey ${n}, want to build on this week's sales?` : "Hey, want to build on this week's sales?",
  last_topic:     (n, topic) => {
    if (!n) return "Hey, how did that conversation go?";
    if (topic) return `Hey ${n}, how did your ${topic} conversation go?`;
    return `Hey ${n}, how did that go?`;
  },
  default:        (n) => n ? `Hey ${n}, what's on your mind?` : "Hey, what's on your mind?"
};

// Priority: stockout_risk > pending_recs > low_margin > sales_up > last_topic > default
function pickGreeting(ctx, firstName) {
  const fn = String(firstName || '').trim();
  const topic = ctx?.topic || null;
  const type = ctx?.type || 'default';
  const fnOrEmpty = fn ? fn : null;

  switch (type) {
    case 'stockout_risk': return GREETING_VARIANTS.stockout_risk(fnOrEmpty);
    case 'pending_recs':  return GREETING_VARIANTS.pending_recs(fnOrEmpty);
    case 'low_margin':    return GREETING_VARIANTS.low_margin(fnOrEmpty);
    case 'sales_up':      return GREETING_VARIANTS.sales_up(fnOrEmpty);
    case 'last_topic':    return GREETING_VARIANTS.last_topic(fnOrEmpty, topic);
    default:              return GREETING_VARIANTS.default(fnOrEmpty);
  }
}

// Cache so we only fetch once per session
let _cachedWelcomeCtx = null;

async function fetchWelcomeContext() {
  if (_cachedWelcomeCtx !== null) return _cachedWelcomeCtx;
  _cachedWelcomeCtx = { type: 'default' };
  return _cachedWelcomeCtx;
}

function applyGreetingToHero(ctx) {
  const el = els.chat?.querySelector('.soRc__emptyHeroText');
  if (!el) return;
  const greeting = pickGreeting(ctx, CUSTOMER_FIRST_NAME);
  el.textContent = greeting;
}

function renderChat() {
  if (!els.chat) return;
  const c = currentChat();

  if (!c || !c.messages.length) {
  // Empty chat hero is rebuilt with innerHTML, so re-arm logo intro for the new node.
  logoIntroStarted = false;
  els.chat.innerHTML = `
    <div class="soRc__emptyHero">
  <div class="soRc__logoIntro" data-logo-intro="1" data-logo-dark-src="/images/logo.png" data-logo-light-src="/images/logo.png" aria-hidden="true">
    <img class="soRc__logoIntroImg" alt="" loading="eager" decoding="async" />
  </div>
  <div class="soRc__emptyHeroText">${esc(heroIntroText())}</div>
  <div class="soRc__emptyQuick">
    <button class="soRc__emptyQuickBtn" type="button" data-quick-prompt="Build me a starter cart for a $5,000 monthly budget." data-feature-required="reorder_decisions">Starter Cart</button>
    <button class="soRc__emptyQuickBtn" type="button" data-quick-prompt="What should I reorder this week to avoid stockouts?" data-feature-required="reorder_decisions,inventory_risk_alerts">Avoid Stockouts</button>
    <button class="soRc__emptyQuickBtn" type="button" data-quick-prompt="Show margin-safe substitutions for my top SKUs." data-feature-required="replace_decisions,margin_insights">Margin-Safe Swaps</button>
    <button class="soRc__emptyQuickBtn" type="button" data-quick-prompt="What assumptions are you using in my current plan?">Review Assumptions</button>
  </div>
    </div>
  `;
  els.chatWrap?.classList.add('is-empty');
  root.classList.add('is-chat-empty');
  if (els.input) els.input.value = c?.draft || '';
  updateSendState();
  updateJumpButton();
  runLogoIntroOnce();
  fetchWelcomeContext().then(applyGreetingToHero);
  return;
}

  root.classList.remove('is-chat-empty');
  els.chatWrap?.classList.remove('is-empty');
  els.chat.innerHTML = c.messages.map(m => {
  if (m.kind === 'plan_event') {
    return `
      <div class="soRc__msg">
        <div class="soRc__bubble soRc__eventCard">
          <div class="soRc__eventTitle">${esc(m.title || 'Plan updated')}</div>
          <div class="soRc__eventText">${esc(m.summary || '')}</div>
          <button class="soRc__eventCta" type="button" data-view-plan="1">View in Billing &amp; Limits</button>
        </div>
      </div>
    `;
  }
    const displayText = m.role === 'assistant'
    ? normalizeAssistantDisplayText(m.text)
    : String(m.text || '');

  return `
    <div class="soRc__msg ${m.role === 'user' ? 'soRc__msg--user' : ''}">
      <div class="soRc__bubble"><div class="soRc__text">${m.role === 'assistant' ? nlToBr(esc(displayText)) : esc(displayText)}</div></div>
    </div>
  `;

}).join('');

  if (els.input) els.input.value = c.draft || '';
  maybeFollow();
  updateSendState();
  updateJumpButton();
}

        function setDraft(v) {
          const c = currentChat();
          if (!c) return;
          c.draft = v || '';
          saveState();
        }

        const stopBtn = document.createElement('button');
        stopBtn.type = 'button';
        stopBtn.className = 'soRc__stop';
        stopBtn.textContent = 'Stop';
        els.composerInner?.insertBefore(stopBtn, els.send);
        stopBtn.addEventListener('click', () => { stream.stopped = true; });
        function showStop(v) { stopBtn.classList.toggle('is-visible', !!v); }

        let thinkingTimer = null;
        function stopThinkingCycle() {
  if (thinkingTimer) {
    clearInterval(thinkingTimer);
    thinkingTimer = null;
  }
}

        function buildThinkingFocus(text, opts = {}) {
  const q = String(text || '').toLowerCase();
  const has = (re) => re.test(q);
  const lines = ['Thinking...'];

  if (has(/\binventory|stock|reorder|coverage|low stock|stockout\b/)) {
    lines.push('Checking inventory data...');
    lines.push('Finding stock risks...');
  }
  if (has(/\bmargin|profit|gross margin|gm\b/)) {
    lines.push('Comparing margin trends...');
    lines.push('Reviewing profit impact...');
  }
  if (has(/\bprice|pricing|discount|promo\b/)) {
    lines.push('Analyzing pricing signals...');
    lines.push('Checking promo impact...');
  }
  if (has(/\bforecast|demand|trend|season\b/)) {
    lines.push('Reading demand patterns...');
    lines.push('Comparing recent trends...');
  }
  if (has(/\brecommend|suggest|what should|next step\b/)) {
    lines.push('Forming recommendation...');
  }
  if (opts.hasCart) {
    lines.push('Checking cart context...');
  }
  if (opts.hasAttachments) {
    lines.push('Reading attachment details...');
  }

  lines.push('Generating insight...');
  lines.push('Almost done...');
  return Array.from(new Set(lines)).slice(0, 7);
}

        function addThinking(focusLines = []) {
  if (document.getElementById('soThinking')) return;
  const sanitize = (x) => String(x || '').replace(/\.+\s*$/, '').slice(0, 40);
  const lines = (Array.isArray(focusLines) && focusLines.length ? focusLines : ['Thinking']).map(sanitize);
  const n = document.createElement('div');
  n.className = 'soRc__msg soRc__msg--thinking';
  n.id = 'soThinking';
  n.innerHTML = `
    <div class="soRc__thinking">
      <span id="soThinkingText" class="soRc__thinkingText">${esc(lines[0])}</span>
      <span class="soRc__thinkingBeam" aria-hidden="true"></span>
    </div>
  `;
  els.chat.appendChild(n);
  maybeFollow();

  stopThinkingCycle();
  let i = 1;
  thinkingTimer = setInterval(() => {
    const target = document.getElementById('soThinkingText');
    if (!target) {
      stopThinkingCycle();
      return;
    }
    target.textContent = sanitize(lines[i % lines.length]);
    i += 1;
    maybeFollow();
  }, 1200);
}

        function removeThinking() {
  stopThinkingCycle();
  document.getElementById('soThinking')?.remove();
}

        // Stream assistant message — accepts either a plain string (local simulation)
        // or an async generator yielding SSE chunk objects from the server.
        async function streamAssistantMessage(textOrChunks, speed = 12) {
  const c = currentChat();
  if (!c) return;
  stopThinkingCycle();

  try {
    if (prefersReducedMotion) {
      const normalizedText = typeof textOrChunks === 'string'
        ? normalizeAssistantDisplayText(textOrChunks)
        : textOrChunks;
      addMessage('assistant', normalizedText);
      return;
    }

    stream.active = true;
    stream.stopped = false;
    showStop(true);

    const msg = document.createElement('div');
    msg.className = 'soRc__msg';
    msg.innerHTML = `<div class="soRc__bubble"><div class="soRc__text" id="soStreamTarget"></div></div>`;
    els.chat.appendChild(msg);

    const target = msg.querySelector('#soStreamTarget');
    let out = '';
    let lastWasNl = false;

    // Helper: process a raw text segment, applying paragraph formatting
    async function processText(raw) {
      if (stream.stopped || !raw) return;
      const parts = raw.split(/(\n\n|\n)/g);
      for (const part of parts) {
        if (!part || stream.stopped) continue;
        // Accumulate output
        out += (part === '\n' ? ' ' : part === '\n\n' ? '\n' : part);

        if (part === '\n') {
          if (lastWasNl) {
            target.appendChild(document.createElement('br'));
          } else {
            target.appendChild(document.createTextNode(' '));
          }
          lastWasNl = true;
        } else {
          target.appendChild(document.createTextNode(part));
          lastWasNl = false;
        }

        // Only apply typing delay for the local-simulation path (string input)
        if (typeof textOrChunks === 'string') {
          const end = part.trim().slice(-1);
          let delay = 26;
          if (end === ',' || end === '.') delay = 55;
          if (/[!?]/.test(end)) delay = 75;
          if (end === ':') delay = 65;
          delay += Math.floor(Math.random() * 12);
          await new Promise(r => setTimeout(r, delay));
        }
        maybeFollow();
      }
    }

    if (typeof textOrChunks === 'string') {
      // Local simulation: split pre-loaded text into word chunks
      const normalizedText = normalizeAssistantDisplayText(textOrChunks);
      const chunks = normalizedText.match(/(\S+\s*|\n)/g) || [normalizedText];
      for (const chunk of chunks) {
        if (stream.stopped) break;
        await processText(chunk);
      }
    } else {
      // Server streaming: consume async chunk iterator (yields SSE chunk objects)
      for await (const item of textOrChunks) {
        if (stream.stopped) break;
        const raw = item?.content || item?.text || '';
        if (raw) await processText(raw);
      }
    }

    if (stream.stopped && out && !out.endsWith('…')) out += '…';
    const storedText = normalizeAssistantDisplayText(out);
    if (!storedText) {
      // Stream produced no visible text; remove placeholder bubble.
      msg.remove();
      return;
    }

    c.messages.push({ role: 'assistant', text: storedText, at: Date.now() });
    apiAddMessage(c.id, 'assistant', storedText).catch(() => {
      showToast('Message sync failed', 'warn');
    });

    c.meta = 'Active now';
    saveState();
    incrementUnreadForChat(c.id);
    renderRecent();
  } finally {
    stream.active = false;
    stream.stopped = false;
    showStop(false);
    updateSendState();
  }
}

async function loadShopCatalog(q = '') {
  state.shop = [];
}

async function refreshPlanFromBackend() {
  const budget = Number(state.plan.budget || 0);
  if (!budget) return;

  await ensureBackendJwt();

  const r = await fetch(RECOMMEND_API, {
    method: 'POST',
    headers: recommendHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
  budget,
  industry: state.profile.store_type || '',
  store_type: state.profile.store_type || '',
  region: state.profile.location || CUSTOMER_REGION || '',
  target_audience: state.profile.priority || '',
      session_id: SESSION_ID,
      user_id: String(USER_ID || '')
    })
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 402) {
      showToast(formatBillingGateMessage(j, 'AI decision limit reached for your plan'), 'warn');
      return;
    }
    throw new Error(j?.error || 'recommend_failed');
  }

  if (j?.billing && typeof j.billing === 'object') {
    state.billing = {
      ...(state.billing || {}),
      ...j.billing
    };
    applyBillingUiGates();
  }

  const recs = Array.isArray(j?.output?.recommendations) ? j.output.recommendations : [];
  const starter = Array.isArray(j?.output?.starter_pack) ? j.output.starter_pack : [];
  const starterMap = new Map(starter.map(x => [String(x.item || '').trim().toLowerCase(), Number(x.suggested_allocation || 0)]));

    state.plan.recommended_lines = recs.slice(0, 8).map((x, i) => {
    const name = String(x.title || `Item ${i + 1}`);
    const total = starterMap.get(name.trim().toLowerCase()) || 0;
    return {
      id: String(x.variant_id || x.key || `line_${i + 1}`),
      name,
      qty: 1,
      total
    };
  });

  state.plan.assumptions = Array.isArray(j?.notes) ? j.notes : [];
  state.plan.missing = Array.isArray(j?.gating?.missing_inputs) ? j.gating.missing_inputs : [];
  state.plan.risk = j?.data_quality?.confidence === 'high' ? 'low' : j?.data_quality?.confidence === 'medium' ? 'medium' : 'high';

  markLocalPlanChange();
  saveState();
  renderPlan();
  queuePlanSave();
}

async function loadReorders() {
  if (!els.reordersList) return;

  els.reordersList.innerHTML = `<div class="soRc__emptyState">Loading…</div>`;

  try {
    const u = new URL(REORDERS_API);
    u.searchParams.set('limit', '20');
    if (CUSTOMER_EMAIL) u.searchParams.set('customer_email', CUSTOMER_EMAIL);

    await ensureBackendJwt();
const r = await fetch(u.toString(), { headers: authHeaders() });
    const j = await r.json().catch(() => ({}));

    if (!r.ok || !j?.ok) {
      els.reordersList.innerHTML = `<div class="soRc__emptyState">No reorder actions right now.</div>`;
      return;
    }

    const items = Array.isArray(j.items) ? j.items : [];
    els.reordersList.innerHTML = items.length
      ? items.map(o => `
        <div class="soRc__emptyState">
          ${esc(o.name)} — ${Number(o.total || 0).toFixed(2)} ${esc(o.currency || 'CAD')} — ${esc(o.financialStatus || 'unknown')}
        </div>
      `).join('')
      : `<div class="soRc__emptyState">No reorder actions right now.</div>`;
  } catch {
    els.reordersList.innerHTML = `<div class="soRc__emptyState">No reorder actions right now.</div>`;
  }
}

function renderPerformance() {
  if (!els.perfState) return;

  const p = state.performance.last || {};
  const d = p.dashboard || p.snapshot || {};
  const providersRaw = Array.isArray(p.providers) ? p.providers : [];
  const connections = Array.isArray(p.connections)
    ? p.connections
    : providersRaw.map((x) => ({
        provider: x.provider || x.key || '',
        status: normalizeProviderStatus(x.status),
        externalAccountId: x.externalAccountId || null,
        isPrimary: Boolean(x.isPrimary),
        lastSyncAt: x.lastSyncAt || null
      }));

  const connectedProviders = connections.filter((c) => normalizeProviderStatus(c.status) === 'connected');
  const connectedCount = connectedProviders.length;

  const todaySales = Number(d.todaySales || 0);
  const weekSales = Number(d.weekSales || 0);
  const todayOrders = Number(d.todayOrders || 0);
  const weekOrders = Number(d.weekOrders || 0);
  const grossMargin = Number(d.grossMargin || 0);
  const lowInventoryAlerts = Number(d.lowInventoryAlerts || 0);

  const atRiskSkuCount =
    Number(d.atRiskSkuCount || 0) ||
    (Array.isArray(d.atRiskSkus) ? d.atRiskSkus.length : 0) ||
    (Array.isArray(d.atRiskItems) ? d.atRiskItems.length : 0) ||
    (Array.isArray(d.inventoryRiskItems) ? d.inventoryRiskItems.length : 0) ||
    0;

  const aiRecommendations = Array.isArray(d.aiRecommendations) ? d.aiRecommendations : [];
  const topProducts = Array.isArray(d.topProducts) ? d.topProducts.slice(0, 5) : [];
  const inventoryRiskItems =
    (Array.isArray(d.inventoryRiskItems) && d.inventoryRiskItems)
    || (Array.isArray(d.atRiskItems) && d.atRiskItems)
    || [];

  const lastSyncAt = d.lastSyncAt || connectedProviders.find((x) => x?.lastSyncAt)?.lastSyncAt || null;
  const syncAgeHours = lastSyncAt ? (Date.now() - new Date(lastSyncAt).getTime()) / 36e5 : null;
  const isStale = connectedCount > 0 && (!lastSyncAt || (syncAgeHours != null && syncAgeHours > 24));

  const hasData =
    todaySales > 0 ||
    weekSales > 0 ||
    weekOrders > 0 ||
    topProducts.length > 0 ||
    lowInventoryAlerts > 0;

  els.perfDisconnected.hidden = true;
  els.perfConnected.hidden = true;
  if (els.perfAlerts) els.perfAlerts.innerHTML = '';

  if (!p || Object.keys(p).length === 0) {
    els.perfState.hidden = false;
    els.perfState.textContent = 'No synced performance data yet.';
    return;
  }

  if (connectedCount === 0) {
    els.perfState.hidden = true;
    els.perfDisconnected.hidden = false;
    if (els.perfKpis) els.perfKpis.innerHTML = '';
    if (els.perfCards) els.perfCards.innerHTML = '';

    const providers = [
      { key: 'shopify', label: 'Shopify', status: 'available' },
      { key: 'square', label: 'Square', status: 'available' },
      { key: 'lightspeed', label: 'Lightspeed', status: 'available' },
      { key: 'clover', label: 'Clover', status: 'available' },
      { key: 'moneris', label: 'Moneris', status: 'coming_soon' }
    ];

    els.perfProviders.innerHTML = providers.map((x) => {
      const isShopify = x.key === 'shopify';
      const isComingSoon = x.status === 'coming_soon';
      return `
        <div class="soRc__eventCard ${isShopify ? 'soRc__eventCard--shopify' : ''}">
          <div class="soRc__eventTitle">${x.label}</div>
          <div class="soRc__eventText">Status: ${isComingSoon ? 'Coming soon' : 'Available'}</div>
          <button class="soRc__eventCta" type="button" ${isComingSoon ? 'disabled' : ''} data-perf-connect="${x.key}">
            ${isComingSoon ? 'Coming soon' : `Connect ${x.label}`}
          </button>
        </div>
      `;
    }).join('');

    if (els.perfMeta) {
      els.perfMeta.textContent = 'Connect a provider to unlock sales, inventory risk, and AI recommendations.';
    }
    return;
  }

  els.perfState.hidden = true;
  els.perfConnected.hidden = false;

  const compactBars = (vals) => {
    const cleaned = (Array.isArray(vals) ? vals : []).map((v) => Math.max(0, Number(v || 0)));
    const max = Math.max(...cleaned, 1);
    return cleaned
      .map((v, idx) => {
        const h = Math.max(6, Math.round((v / max) * 42));
        return `<div class="soRc__perfBar ${idx % 2 ? 'soRc__perfBar--soft' : ''}" style="height:${h}px"></div>`;
      })
      .join('');
  };

  els.perfKpis.innerHTML = `
    <div class="soRc__perfStatCard">
      <div class="soRc__perfStatTop">
        <div class="soRc__perfStatLabel">Sales Today</div>
        <div class="soRc__perfPill">Live</div>
      </div>
      <div class="soRc__perfStatValue">${money(todaySales)}</div>
      <div class="soRc__perfStatSub">${todayOrders > 0 ? `${todayOrders} orders today` : (lastSyncAt ? `Last sync ${new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for first sync')}</div>
      <div class="soRc__perfBars">${compactBars([todaySales * 0.8, todaySales, todaySales * 0.9])}</div>
    </div>
    <div class="soRc__perfStatCard">
      <div class="soRc__perfStatTop">
        <div class="soRc__perfStatLabel">Sales This Week</div>
        <div class="soRc__perfPill">${connectedCount} connected</div>
      </div>
      <div class="soRc__perfStatValue">${money(weekSales)}</div>
      <div class="soRc__perfStatSub">${weekOrders > 0 ? `${weekOrders} orders this week` : 'Waiting for weekly order sync'}</div>
      <div class="soRc__perfBars">${compactBars([weekSales * 0.72, weekSales * 0.85, weekSales])}</div>
    </div>
    <div class="soRc__perfStatCard">
      <div class="soRc__perfStatTop">
        <div class="soRc__perfStatLabel">Inventory Risk</div>
        <div class="soRc__perfPill">${isStale ? 'Stale' : 'Fresh'}</div>
      </div>
      <div class="soRc__perfStatValue">${lowInventoryAlerts}</div>
      <div class="soRc__perfStatSub">${lowInventoryAlerts > 0 ? `${lowInventoryAlerts} alerts across ${Math.max(atRiskSkuCount, lowInventoryAlerts)} SKUs` : 'No inventory risk detected'}</div>
      <div class="soRc__perfBars">${compactBars([Math.max(1, lowInventoryAlerts), Math.max(1, atRiskSkuCount), Math.max(1, grossMargin)])}</div>
    </div>
  `;

  if (els.perfAlerts) {
    const alerts = [];
    const urgentReorders = Number(d.urgentReorders || lowInventoryAlerts || 0);
    const topDemandPct = Number(d.topSkuDemandChangePct || d.demandChangePct || 0);

    if (isStale) alerts.push({ cls: 'soRc__perfAlert--stale', text: 'Inventory sync stale' });
    if (lowInventoryAlerts > 0) alerts.push({ cls: 'soRc__perfAlert--warn', text: `${urgentReorders} urgent reorders` });
    if (aiRecommendations.length > 0) alerts.push({ cls: 'soRc__perfAlert--ok', text: 'New AI recommendation' });
    if (topDemandPct > 0) alerts.push({ cls: 'soRc__perfAlert--warn', text: `Top SKU demand up ${topDemandPct.toFixed(0)}%` });
    if (!alerts.length) alerts.push({ cls: 'soRc__perfAlert--ok', text: 'No urgent issues detected' });

    els.perfAlerts.innerHTML = alerts.slice(0, 4).map((a) => `<div class="soRc__perfAlert ${a.cls}">${a.text}</div>`).join('');
  }

  const aiHeadline = aiRecommendations[0]?.headline || 'No recommendation right now';
  const impactLine = Number(d.estimatedRevenueAtRisk || 0) > 0
    ? `Estimated revenue at risk: ${money(d.estimatedRevenueAtRisk)}`
    : Number(d.estimatedMarginImprovementPct || d.coodraImpact?.marginLiftPct || 0) > 0
      ? `Estimated margin improvement: ${Number(d.estimatedMarginImprovementPct || d.coodraImpact?.marginLiftPct || 0).toFixed(1)}%`
      : aiRecommendations.length > 0
        ? 'Coodra found an action worth reviewing'
        : 'Run sync or wait for more commerce data';

  const riskRows = inventoryRiskItems.length
    ? inventoryRiskItems.slice(0, 3).map((row) => {
        const title = row.title || row.productTitle || row.sku || 'At-risk item';
        const metaBits = [];
        if (row.daysLeft != null) metaBits.push(`${row.daysLeft}d left`);
        if (row.riskLevel) metaBits.push(String(row.riskLevel));
        const meta = metaBits.length ? metaBits.join(' / ') : 'Risk detected';
        const action = row.reorderSuggestion || row.suggestedAction || 'Review reorder';
        return `
          <div class="soRc__perfRiskRow">
            <div>
              <div class="soRc__perfRiskTitle">${esc(title)}</div>
              <div class="soRc__perfRiskMeta">${esc(meta)}</div>
            </div>
            <div class="soRc__perfRiskAction">${esc(action)}</div>
          </div>
        `;
      }).join('')
    : `<div class="soRc__perfAiLead">${lowInventoryAlerts > 0 ? `Low inventory alerts: ${lowInventoryAlerts}. ${d.reorderReason || 'Review reorders now.'}` : 'No inventory risk detected'}</div>`;

  const topMax = Math.max(...topProducts.map((x) => Number(x.revenue || 0)), 1);
  const perfRows = topProducts.length
    ? topProducts.map((x) => {
        const revenue = Number(x.revenue || 0);
        const width = Math.max(6, Math.round((revenue / topMax) * 100));
        const trend = Number(x.trendPct || 0);
        const trendText = Number.isFinite(trend) && trend !== 0 ? ` / ${trend > 0 ? '+' : ''}${trend.toFixed(0)}%` : '';
        const health = x.stockHealth || '';
        return `
          <div class="soRc__perfTrendRow">
            <div>
              <div class="soRc__perfTrendLabel">${esc(x.title || 'Product')}${trendText}</div>
              <div class="soRc__perfTrendTrack"><div class="soRc__perfTrendFill" style="width:${width}%"></div></div>
            </div>
            <div class="soRc__perfTrendValue">${money(revenue)}${health ? `<span class="soRc__perfHealthBadge">${esc(health)}</span>` : ''}</div>
          </div>
        `;
      }).join('')
    : `<div class="soRc__perfAiLead">No ranked products yet</div>`;

  const accepted = Number(d.coodraImpact?.accepted || d.acceptedRecommendations || 0);
  const marginLift = Number(d.coodraImpact?.marginLiftPct || d.estimatedMarginImprovementPct || 0);
  const revenueProtected = Number(d.coodraImpact?.revenueProtected || d.revenueProtected || 0);
  const stockoutsPrevented = Number(d.coodraImpact?.stockoutsPrevented || d.stockoutsPrevented || 0);

  const impactLines = [];
  impactLines.push(`Accepted recommendations: ${accepted}`);
  impactLines.push(`Estimated margin lift: ${marginLift.toFixed(1)}%`);
  if (revenueProtected > 0) impactLines.push(`Revenue protected: ${money(revenueProtected)}`);
  else if (stockoutsPrevented > 0) impactLines.push(`Stockouts prevented: ${stockoutsPrevented}`);
  else impactLines.push(`Connected providers: ${connectedCount}`);

  els.perfCards.innerHTML = `
    <div class="soRc__perfBoard soRc__perfBoard--ai">
      <div class="soRc__perfBoardHead">
        <div class="soRc__perfBoardTitle">Coodra AI Intelligence</div>
        <div class="soRc__perfPill">Model active</div>
      </div>
      <div class="soRc__perfAiLead">${esc(aiHeadline)}</div>
      <div class="soRc__perfRiskMeta" style="margin-bottom:10px;">${esc(impactLine)}</div>
      <div class="soRc__perfPrimaryCtaRow">
        <button class="soRc__eventCta" type="button" data-perf-ai-action="review_recommendation">Review recommendation</button>
        <button class="soRc__eventCta" type="button" data-perf-ai-action="apply_suggestion" data-feature-required="replace_decisions,remove_decisions">Apply suggestion</button>
        <button class="soRc__eventCta" type="button" data-perf-ai-action="ask_why">Ask why</button>
        <button class="soRc__eventCta" type="button" data-export-performance="1" data-feature-required="exports">Export CSV</button>
      </div>
    </div>

    <div class="soRc__perfBoard" data-feature-panel="inventory_risk_alerts,reorder_decisions">
      <div class="soRc__perfBoardHead">
        <div class="soRc__perfBoardTitle">Inventory & Reorder Intelligence</div>
        <div class="soRc__perfPill">${lowInventoryAlerts} alerts</div>
      </div>
      <div class="soRc__perfRiskRows">${riskRows}</div>
    </div>

    <div class="soRc__perfBoard" data-feature-panel="category_performance">
      <div class="soRc__perfBoardHead">
        <div class="soRc__perfBoardTitle">Product Performance</div>
        <div class="soRc__perfPill">Ranked</div>
      </div>
      <div class="soRc__perfTrendRows">${perfRows}</div>
    </div>

    <div class="soRc__perfBoard" data-feature-panel="margin_insights">
      <div class="soRc__perfBoardHead">
        <div class="soRc__perfBoardTitle">Impact</div>
        <div class="soRc__perfPill">Outcomes</div>
      </div>
      <div class="soRc__perfRiskRows">
        ${impactLines.map((line) => `<div class="soRc__perfRiskRow"><div class="soRc__perfRiskTitle">${esc(line)}</div></div>`).join('')}
      </div>
    </div>
  `;

  if (els.perfMeta) {
    const planLabel = String(state.billing?.plan_code || state.billing?.account?.plan_code || '').trim();
    const usageLabel = planLabel ? ` - ${planLabel.toUpperCase()} plan - AI decisions ${billingAiUsageSummary()}` : '';
    if (isStale) els.perfMeta.textContent = `Data may be stale. Run sync to refresh.${usageLabel}`;
    else if (!hasData) els.perfMeta.textContent = `Connected, but no synced performance data yet. Run Full Sync.${usageLabel}`;
    else els.perfMeta.textContent = `Connected providers: ${connectedCount}${usageLabel}`;
  }
}

function listRowHtml(title, meta, value, actionConfig = null) {
  let rowClass = '';
  let actionHtml = '';
  if (actionConfig && actionConfig.action && actionConfig.target) {
    const featureReq = String(actionConfig.feature || '').trim();
    const featureAttr = featureReq ? ` data-feature-required="${esc(featureReq)}"` : '';
    const payloadAttr = actionConfig.payload && typeof actionConfig.payload === 'object'
      ? ` data-smart-payload="${esc(encodeURIComponent(JSON.stringify(actionConfig.payload)))}"`
      : '';
    const missing = featureReq ? missingBillingFeatures(featureReq) : [];
    if (missing.length) {
      const reason = `Upgrade plan to unlock: ${missing.join(', ')}.`;
      rowClass = ' soRc__smartRow--locked';
      actionHtml = `<button class="soRc__smartAction soRc__upgradeRequired" type="button" data-upgrade-required="1" data-upgrade-reason="${esc(reason)}" title="${esc(reason)}"${featureAttr}>Upgrade</button><span class="soRc__upgradeHint">${esc(reason)}</span>`;
    } else {
      actionHtml = `<button class="soRc__smartAction" type="button" data-smart-action="${esc(actionConfig.action)}" data-smart-target="${esc(actionConfig.target)}" data-smart-context="${esc(actionConfig.context || '')}"${payloadAttr}${featureAttr}>${esc(actionConfig.label || 'Run')}</button>`;
    }
  }
  return `
    <div class="soRc__smartRow${rowClass}">
      <div class="soRc__smartMain">
        <div class="soRc__smartTitle">${esc(title || '')}</div>
        <div class="soRc__smartMeta">${esc(meta || '')}</div>
      </div>
      <div class="soRc__smartValue">${esc(value || '')}${actionHtml}</div>
    </div>
  `;
}

function renderForecasts() {
  if (!els.forecastList || !els.forecastKpis || !els.forecastMeta) return;
  const d = state.performance?.last?.dashboard || state.performance?.last?.snapshot || {};
  const topProducts = Array.isArray(d.topProducts) ? d.topProducts : [];
  const aiRecommendations = Array.isArray(d.aiRecommendations) ? d.aiRecommendations : [];
  const inventoryRiskItems = (Array.isArray(d.inventoryRiskItems) && d.inventoryRiskItems) || (Array.isArray(d.atRiskItems) && d.atRiskItems) || [];
  const connectedCount = Array.isArray(state.performance?.last?.connections)
    ? state.performance.last.connections.filter((x) => normalizeProviderStatus(x?.status) === 'connected').length
    : 0;

  if (connectedCount === 0) {
    els.forecastKpis.innerHTML = '';
    els.forecastList.innerHTML = `
      <div class="soRc__emptyState">Connect a store to start forecasts.</div>
      <div class="soRc__panelActions" style="margin-top:10px;">
        <button class="soRc__eventCta" type="button" data-smart-action="connect_store" data-smart-target="shopify" data-smart-context="forecasts">Connect Shopify</button>
      </div>
    `;
    els.forecastMeta.textContent = 'Forecasts activate after your first data sync.';
    return;
  }

  const rising = topProducts
    .filter((x) => Number(x?.trendPct || 0) > 0)
    .sort((a, b) => Number(b?.trendPct || 0) - Number(a?.trendPct || 0))
    .slice(0, 5);
  const riskSoon = inventoryRiskItems
    .map((x) => ({ ...x, daysLeft: Number(x?.daysLeft ?? x?.days_to_stockout ?? 999) }))
    .sort((a, b) => Number(a.daysLeft || 999) - Number(b.daysLeft || 999))
    .slice(0, 5);

  els.forecastKpis.innerHTML = `
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Connected stores</div><div class="soRc__kpiValue">${connectedCount}</div><div class="soRc__kpiSub">Live data inputs</div></div>
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Rising products</div><div class="soRc__kpiValue">${rising.length}</div><div class="soRc__kpiSub">Positive demand trend</div></div>
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Risk soon</div><div class="soRc__kpiValue">${riskSoon.length}</div><div class="soRc__kpiSub">Needs reorder attention</div></div>
  `;

  const rows = [];
  rising.forEach((x) => {
    rows.push(listRowHtml(
      x?.title || 'Product',
      `Trend ${Number(x?.trendPct || 0).toFixed(0)}% | Revenue ${money(Number(x?.revenue || 0))}`,
      'Rising',
      {
        action: 'watch',
        target: x?.title || 'Product',
        context: 'forecast',
        feature: 'trend_detection',
        label: 'Watch',
        payload: {
          source: 'forecasts',
          trend_pct: Number(x?.trendPct || 0),
          revenue: Number(x?.revenue || 0)
        }
      }
    ));
  });
  riskSoon.forEach((x) => {
    const days = Number.isFinite(Number(x?.daysLeft)) ? `${Math.max(0, Number(x.daysLeft))}d` : 'Soon';
    rows.push(listRowHtml(
      x?.title || x?.productTitle || x?.sku || 'At-risk SKU',
      `${x?.riskLevel || 'Risk detected'} | ${x?.reorderSuggestion || 'Review reorder'}`,
      days,
      {
        action: 'reorder',
        target: x?.title || x?.productTitle || x?.sku || 'At-risk SKU',
        context: 'inventory risk',
        feature: 'reorder_decisions,inventory_risk_alerts',
        label: 'Reorder',
        payload: {
          source: 'forecasts',
          days_to_stockout: Number(x?.daysLeft ?? x?.days_to_stockout ?? 0),
          risk_level: x?.riskLevel || '',
          reorder_suggestion: x?.reorderSuggestion || ''
        }
      }
    ));
  });

  if (!rows.length) {
    rows.push('<div class="soRc__emptyState">Forecast signals appear after sync.</div>');
  }

  els.forecastList.innerHTML = rows.join('');
  els.forecastMeta.textContent = aiRecommendations.length
    ? `Forecast view updated from ${aiRecommendations.length} active recommendation signals.`
    : 'Forecasts use trend and inventory movement from your connected data.';
}

function renderClassification() {
  if (!els.classificationList || !els.classificationKpis || !els.classificationMeta) return;
  const d = state.performance?.last?.dashboard || state.performance?.last?.snapshot || {};
  const topProducts = Array.isArray(d.topProducts) ? d.topProducts : [];
  const aiRecommendations = Array.isArray(d.aiRecommendations) ? d.aiRecommendations : [];
  const connectedCount = Array.isArray(state.performance?.last?.connections)
    ? state.performance.last.connections.filter((x) => normalizeProviderStatus(x?.status) === 'connected').length
    : 0;

  if (connectedCount === 0) {
    els.classificationKpis.innerHTML = '';
    els.classificationList.innerHTML = `
      <div class="soRc__emptyState">Connect a store to start classification.</div>
      <div class="soRc__panelActions" style="margin-top:10px;">
        <button class="soRc__eventCta" type="button" data-smart-action="connect_store" data-smart-target="shopify" data-smart-context="classification">Connect Shopify</button>
      </div>
    `;
    els.classificationMeta.textContent = 'Classification activates after your first data sync.';
    return;
  }

  const sortedByRevenue = [...topProducts].sort((a, b) => Number(b?.revenue || 0) - Number(a?.revenue || 0));
  const count = sortedByRevenue.length;
  const aCut = Math.max(1, Math.ceil(count * 0.2));
  const bCut = Math.max(aCut, Math.ceil(count * 0.5));
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  const rows = [];

  sortedByRevenue.slice(0, 12).forEach((x, idx) => {
    let band = 'C';
    if (idx < aCut) {
      band = 'A';
      aCount += 1;
    } else if (idx < bCut) {
      band = 'B';
      bCount += 1;
    } else {
      cCount += 1;
    }
    rows.push(listRowHtml(
      x?.title || 'Product',
      `${money(Number(x?.revenue || 0))} revenue | ${Number(x?.trendPct || 0).toFixed(0)}% trend`,
      `Class ${band}`,
      {
        action: band === 'C' ? 'replace' : 'watch',
        target: x?.title || 'Product',
        context: `class ${band}`,
        feature: band === 'C' ? 'replace_decisions' : '',
        label: band === 'C' ? 'Replace' : 'Watch',
        payload: {
          source: 'classification',
          class_band: band,
          revenue: Number(x?.revenue || 0),
          trend_pct: Number(x?.trendPct || 0)
        }
      }
    ));
  });

  const movers = aiRecommendations.filter((x) => /replace|remove|promote/i.test(String(x?.headline || ''))).length;
  const starterA = count ? aCount : 0;
  const starterB = count ? bCount : 0;
  const starterC = count ? Math.max(0, count - starterA - starterB) : 0;

  els.classificationKpis.innerHTML = `
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Class A</div><div class="soRc__kpiValue">${starterA}</div><div class="soRc__kpiSub">High-value products</div></div>
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Class B</div><div class="soRc__kpiValue">${starterB}</div><div class="soRc__kpiSub">Core performers</div></div>
    <div class="soRc__kpi"><div class="soRc__kpiLabel">Class C</div><div class="soRc__kpiValue">${starterC}</div><div class="soRc__kpiSub">Low-impact tail</div></div>
  `;

  if (!rows.length) rows.push('<div class="soRc__emptyState">Classifications will populate after your first full sync.</div>');
  els.classificationList.innerHTML = rows.join('');
  els.classificationMeta.textContent = movers > 0
    ? `${movers} active replace/remove/promote opportunities mapped by class.`
    : 'Classification is based on product revenue contribution and movement trend.';
}

function renderLocations() {
  if (!els.locationsTop || !els.locationsActions || !els.locationsMeta) return;
  const storeMetric = getMetricFromBilling('stores');
  const metricConnected = Number(storeMetric.used || 0);
  const p = state.performance?.last || {};
  const providersRaw = Array.isArray(p.providers) ? p.providers : [];
  const connections = Array.isArray(p.connections)
    ? p.connections
    : providersRaw.map((x) => ({
        provider: x.provider || x.key || '',
        status: normalizeProviderStatus(x.status)
      }));
  const connectedFromConnections = connections
    .filter((x) => normalizeProviderStatus(x?.status) === 'connected').length;
  const connected = Math.max(metricConnected, connectedFromConnections);
  const limitText = storeMetric.unlimited ? 'Unlimited' : String(Number(storeMetric.limit || 0));
  const d = state.performance?.last?.dashboard || state.performance?.last?.snapshot || {};
  const lowInventoryAlerts = Number(d.lowInventoryAlerts || 0);
  const weekSales = Number(d.weekSales || 0);
  const canConnectMore = storeMetric.unlimited || connected < Number(storeMetric.limit || 0) || connected === 0;

  const connectPillsHtml = connected > 0
    ? `
      <div class="soRc__locationsPillRow">
        <span class="soRc__locationsPill soRc__locationsPill--connected">${esc(`${connected} connected`)}</span>
        ${canConnectMore
          ? `<button class="soRc__locationsPill soRc__locationsPill--action" type="button" data-smart-action="connect_store" data-smart-target="shopify" data-smart-context="locations">Connect another store</button>`
          : ''
        }
      </div>
    `
    : `
      <div class="soRc__locationsPillRow">
        <button class="soRc__locationsPill soRc__locationsPill--action" type="button" data-smart-action="connect_store" data-smart-target="shopify" data-smart-context="locations">Connect store</button>
      </div>
    `;

  els.locationsTop.innerHTML = `
    <div class="soRc__locationsStatusTop">
      <div>
        <div class="soRc__locationsStatusTitle">Connected store coverage</div>
        <div class="soRc__locationsStatusMeta">Store data currently connected.</div>
      </div>
      <div class="soRc__locationsCoverage">${connected}/${limitText}</div>
    </div>
    ${connectPillsHtml}
  `;

  const actionRows = [];
  actionRows.push(locationActionRow(
    'Inventory alerts',
    'Current cross-store inventory risk signals.',
    String(lowInventoryAlerts),
    {
      action: 'reorder',
      target: 'store inventory alerts',
      context: 'locations',
      feature: 'reorder_decisions,inventory_risk_alerts',
      label: 'Review',
      payload: {
        source: 'locations',
        low_inventory_alerts: lowInventoryAlerts,
        connected_stores: connected
      }
    }
  ));
  actionRows.push(locationActionRow(
    'Weekly sales signal',
    'Latest aggregate sales signal.',
    money(weekSales),
    {
      action: 'watch',
      target: 'weekly sales trend',
      context: 'locations',
      feature: 'trend_detection',
      label: 'Analyze',
      payload: {
        source: 'locations',
        week_sales: weekSales,
        connected_stores: connected
      }
    }
  ));
  els.locationsActions.innerHTML = actionRows.join('');
  els.locationsMeta.textContent = storeMetric.unlimited
    ? 'Enterprise location coverage is active.'
    : `Plan limit allows ${limitText} store${Number(limitText) === 1 ? '' : 's'}.`;
}

function locationActionRow(title, meta, value, actionConfig = null) {
  let actionHtml = '';
  if (actionConfig && actionConfig.action && actionConfig.target) {
    const featureReq = String(actionConfig.feature || '').trim();
    const featureAttr = featureReq ? ` data-feature-required="${esc(featureReq)}"` : '';
    const payloadAttr = actionConfig.payload && typeof actionConfig.payload === 'object'
      ? ` data-smart-payload="${esc(encodeURIComponent(JSON.stringify(actionConfig.payload)))}"`
      : '';
    const missing = featureReq ? missingBillingFeatures(featureReq) : [];
    if (missing.length) {
      const reason = `Upgrade plan to unlock: ${missing.join(', ')}.`;
      actionHtml = `<button class="soRc__smartAction soRc__upgradeRequired" type="button" data-upgrade-required="1" data-upgrade-reason="${esc(reason)}" title="${esc(reason)}"${featureAttr}>Upgrade</button>`;
    } else {
      actionHtml = `<button class="soRc__smartAction" type="button" data-smart-action="${esc(actionConfig.action)}" data-smart-target="${esc(actionConfig.target)}" data-smart-context="${esc(actionConfig.context || '')}"${payloadAttr}${featureAttr}>${esc(actionConfig.label || 'Run')}</button>`;
    }
  }
  return `
    <div class="soRc__locationsAction">
      <div class="soRc__locationsActionMain">
        <div class="soRc__locationsActionTitle">${esc(title || '')}</div>
        <div class="soRc__locationsActionMeta">${esc(meta || '')}</div>
      </div>
      <div class="soRc__locationsActionRight">
        <span class="soRc__locationsActionValue">${esc(value || '')}</span>
        ${actionHtml}
      </div>
    </div>
  `;
}

async function ensurePerformanceSnapshot() {
  if (!state.performance?.last) {
    await loadPerformanceStatus();
  }
  renderForecasts();
  renderClassification();
  renderLocations();
  applyBillingUiGates();
}

function renderPerformanceConnectionsMenu() {

  if (!els.perfConnectionsMenu || !els.perfConnectionsCount) return;

  const p = state.performance.last || {};
  const providersRaw = Array.isArray(p.providers) ? p.providers : [];
  const connections = Array.isArray(p.connections)
    ? p.connections
    : providersRaw.map((x) => ({
        provider: x.provider || x.key || '',
        status: normalizeProviderStatus(x.status),
        externalAccountId: x.externalAccountId || null,
        isPrimary: Boolean(x.isPrimary),
        lastSyncAt: x.lastSyncAt || null
      }));
  const providerCatalog = [
    { key: 'shopify', label: 'Shopify', available: true },
    { key: 'square', label: 'Square', available: true },
    { key: 'lightspeed', label: 'Lightspeed', available: true },
    { key: 'clover', label: 'Clover', available: true },
    { key: 'moneris', label: 'Moneris', available: false }
  ];
  const byConn = new Map(connections.map((x) => [String(x.provider || '').toLowerCase(), x]));
  const connectedCount = connections.filter((x) => normalizeProviderStatus(x.status) === 'connected').length;
  els.perfConnectionsCount.textContent = String(connectedCount);

  const launchedProviders = new Set(['shopify', 'square', 'lightspeed', 'clover']);
  els.perfConnectionsMenu.innerHTML = providerCatalog.map((row) => {
    const c = byConn.get(row.key);
    const normalizedStatus = normalizeProviderStatus(c?.status || (row.available ? 'available' : 'coming_soon'));
    // Live providers should never render as coming soon even if legacy metadata still carries that status.
    const status = (launchedProviders.has(row.key) && normalizedStatus === 'coming_soon')
      ? 'not_connected'
      : normalizedStatus;
    const isConnected = status === 'connected';
    const isComingSoon = !row.available && !isConnected;
    const isPrimary = Boolean(c?.isPrimary);
    const canConnect = Boolean(row.available);
    const last = c?.lastSyncAt ? new Date(c.lastSyncAt).toLocaleString() : 'Never';

    const statusLabel = isConnected
      ? 'Connected'
      : isComingSoon
        ? 'Coming soon'
        : 'Not connected';

    const statusClass = isConnected
      ? 'soRc__perfStatusPill--connected'
      : isComingSoon
        ? 'soRc__perfStatusPill--coming'
        : 'soRc__perfStatusPill--idle';

    const rowClass = isConnected
      ? (isPrimary ? 'soRc__perfMenuRow soRc__perfMenuRow--connected soRc__perfMenuRow--primary' : 'soRc__perfMenuRow soRc__perfMenuRow--connected')
      : 'soRc__perfMenuRow';

    return `
      <div class="${rowClass}">
        <div class="soRc__perfMenuHead">
          <div class="soRc__perfMenuIdentity">
            <div class="soRc__perfMenuTitle">${row.label}</div>
          </div>
          <div class="soRc__numBadge soRc__perfStatusPill ${statusClass}">${statusLabel}</div>
        </div>
        <div class="soRc__perfMenuMeta">Last sync: ${last}</div>
        <div class="soRc__perfMenuActions">
          ${isConnected
            ? `
              <button class="soRc__eventCta" type="button" data-perf-provider-action="sync_full" data-perf-provider="${row.key}">Sync</button>
              <button class="soRc__eventCta soRc__eventCta--danger" type="button" data-perf-provider-action="disconnect" data-perf-provider="${row.key}">Disconnect</button>
            `
            : `
              <button class="soRc__eventCta" type="button" data-perf-connect="${row.key}" ${canConnect ? '' : 'disabled'}>Connect</button>
            `
          }
        </div>
      </div>
    `;
  }).join('');
}


async function loadPerformanceStatus() {

  if (!els.perfState) return;
  state.performance.loading = true;
  els.perfState.hidden = false;
  els.perfState.textContent = 'Loading performance status...';

  try {
    await ensureBackendJwt();
    const r = await fetch(PERFORMANCE_STATUS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) throw new Error(j?.error || 'performance_status_failed');

    state.performance.last = j;
    if (j?.billing && typeof j.billing === 'object') {
      state.billing = j.billing;
    }
    renderPerformance();
    renderPerformanceConnectionsMenu();
    renderForecasts();
    renderClassification();
    renderLocations();
    renderPlanStatusBanner();
    applyBillingUiGates();
  } catch (err) {
    const reason = String(err?.message || 'performance_status_failed');
    console.error('Performance status load failed:', reason);
    els.perfState.hidden = false;
    els.perfState.textContent = `Could not load performance status: ${reason}`;
    if (els.perfMeta) els.perfMeta.textContent = '';
    if (els.perfConnectionsMenu) els.perfConnectionsMenu.innerHTML = '';
    if (els.perfConnectionsCount) els.perfConnectionsCount.textContent = '0';
  } finally {
    state.performance.loading = false;
  }
}

function billingAiUsageSummary() {
  const b = state.billing || {};
  const ent = b.entitlements || {};
  const usage = b.usage || {};
  const limit = Number(ent.ai_decisions_monthly_limit ?? -1);
  const used = Number(usage.ai_decisions || 0);
  if (!Number.isFinite(limit) || limit < 0) return `${used} / Unlimited`;
  return `${used} / ${limit}`;
}

function formatUsagePair(used, limit, unlimited) {
  const safeUsed = Number.isFinite(Number(used)) ? Math.max(0, Number(used)) : 0;
  if (unlimited || !Number.isFinite(Number(limit)) || Number(limit) < 0) {
    return `${safeUsed} / Unlimited`;
  }
  return `${safeUsed} / ${Math.max(0, Number(limit))}`;
}

function getMetricFromBilling(code) {
  const usageSummary = state.billing?.usage_summary?.metrics || {};
  if (usageSummary[code]) return usageSummary[code];

  const ent = state.billing?.entitlements || {};
  const usage = state.billing?.usage || {};
  if (code === 'ai_decisions') {
    const limit = Number(ent.ai_decisions_monthly_limit ?? -1);
    const used = Number(usage.ai_decisions || 0);
    const unlimited = !Number.isFinite(limit) || limit < 0;
    const ratio = unlimited ? 0 : (limit <= 0 ? 1 : used / limit);
    return { used, limit, unlimited, ratio, level: ratio >= 1 ? 'critical' : (ratio >= 0.9 ? 'high' : (ratio >= 0.8 ? 'warn' : 'ok')) };
  }
  if (code === 'products_analyzed') {
    const limit = Number(ent.products_analyzed_limit ?? -1);
    const used = Number(usage.products_analyzed || state.billing?.account?.metadata?.products_analyzed_count || 0);
    const unlimited = !Number.isFinite(limit) || limit < 0;
    const ratio = unlimited ? 0 : (limit <= 0 ? 1 : used / limit);
    return { used, limit, unlimited, ratio, level: ratio >= 1 ? 'critical' : (ratio >= 0.9 ? 'high' : (ratio >= 0.8 ? 'warn' : 'ok')) };
  }
  if (code === 'stores') {
    const limit = Number(ent.stores_limit ?? -1);
    const used = Number(usage.stores || state.billing?.account?.metadata?.connected_stores_count || 0);
    const unlimited = !Number.isFinite(limit) || limit < 0;
    const ratio = unlimited ? 0 : (limit <= 0 ? 1 : used / limit);
    return { used, limit, unlimited, ratio, level: ratio >= 1 ? 'critical' : (ratio >= 0.9 ? 'high' : (ratio >= 0.8 ? 'warn' : 'ok')) };
  }
  return { used: 0, limit: 0, unlimited: false, ratio: 0, level: 'ok' };
}

function renderUsageMetric(code, opts = {}) {
  const metric = getMetricFromBilling(code);
  const textEl = opts.textEl;
  const fillEl = opts.fillEl;
  const metricEl = fillEl?.closest('.soRc__usageMetric');
  if (textEl) textEl.textContent = formatUsagePair(metric.used, metric.limit, metric.unlimited);
  if (fillEl) {
    let ratio = 0;
    if (metric.unlimited) {
      const used = Math.max(0, Number(metric.used || 0));
      const softCapByMetric = {
        ai_decisions: 200,
        products_analyzed: 10000,
        stores: 10
      };
      const softCap = Number(softCapByMetric[code] || 100);
      ratio = used <= 0 ? 0 : Math.min(1, Math.sqrt(used / softCap));
    } else {
      ratio = Math.max(0, Math.min(1, Number(metric.ratio || 0)));
    }
    fillEl.style.width = `${Math.round(ratio * 100)}%`;
  }
  if (metricEl) metricEl.setAttribute('data-level', String(metric.level || 'ok'));
}

function renderBillingUsageSummary() {
  const b = state.billing || {};
  const planCode = String(b.plan_code || b.account?.plan_code || 'free').toUpperCase();
  const statusCode = String(b.status || b.account?.status || 'active').replace(/_/g, ' ');
  if (els.billingPlanLabel) els.billingPlanLabel.textContent = planCode;
  if (els.billingStatusLabel) els.billingStatusLabel.textContent = statusCode.charAt(0).toUpperCase() + statusCode.slice(1);
  if (els.billingUsagePeriod) {
    const period = String(b.usage_period || '').trim();
    els.billingUsagePeriod.textContent = period ? `Usage period - ${period}` : 'Usage period - current month';
  }

  renderUsageMetric('ai_decisions', { textEl: els.usageAiText, fillEl: els.usageAiFill });
  renderUsageMetric('products_analyzed', { textEl: els.usageProductsText, fillEl: els.usageProductsFill });
  renderUsageMetric('stores', { textEl: els.usageStoresText, fillEl: els.usageStoresFill });
  renderPlanStatusBanner();
}

function maybeWarnNearLimits() {
  const ai = getMetricFromBilling('ai_decisions');
  const products = getMetricFromBilling('products_analyzed');
  const stores = getMetricFromBilling('stores');

  if (!ai.unlimited && ai.ratio >= 0.95 && !nearLimitWarned.ai_decisions_95 && !billingQuotaReached()) {
    nearLimitWarned.ai_decisions_95 = true;
    showToast('AI decisions are above 95% of your monthly limit.', 'warn');
  } else if (!ai.unlimited && ai.ratio >= 0.8 && !nearLimitWarned.ai_decisions_80 && !billingQuotaReached()) {
    nearLimitWarned.ai_decisions_80 = true;
    showToast('AI decisions are above 80% of your monthly limit.', 'warn');
  }
  if (!products.unlimited && products.ratio >= 0.95 && !nearLimitWarned.products_analyzed_95) {
    nearLimitWarned.products_analyzed_95 = true;
    showToast('Products analyzed is above 95% of your plan limit.', 'warn');
  } else if (!products.unlimited && products.ratio >= 0.8 && !nearLimitWarned.products_analyzed_80) {
    nearLimitWarned.products_analyzed_80 = true;
    showToast('Products analyzed is above 80% of your plan limit.', 'warn');
  }
  if (!stores.unlimited && stores.ratio >= 0.95 && !nearLimitWarned.stores_95) {
    nearLimitWarned.stores_95 = true;
    showToast('Store connections are above 95% of your plan limit.', 'warn');
  } else if (!stores.unlimited && stores.ratio >= 0.8 && !nearLimitWarned.stores_80) {
    nearLimitWarned.stores_80 = true;
    showToast('Store connections are above 80% of your plan limit.', 'warn');
  }

  const near = state.billing?.near_limits || state.billing?.usage_summary?.near_limits || {};
  if (near.ai_decisions && !nearLimitWarned.ai_decisions && !billingQuotaReached()) {
    nearLimitWarned.ai_decisions = true;
    showToast('You are near your monthly AI decision limit.', 'warn');
  }
  if (near.products_analyzed && !nearLimitWarned.products_analyzed) {
    nearLimitWarned.products_analyzed = true;
    showToast('Products analyzed is close to plan limit.', 'warn');
  }
  if (near.stores && !nearLimitWarned.stores) {
    nearLimitWarned.stores = true;
    showToast('Store connections are close to plan limit.', 'warn');
  }
}

function renderPlanStatusBanner() {
  ensurePanelStatusPills();
  const plan = String(state.billing?.plan_code || state.billing?.account?.plan_code || 'free').toUpperCase();
  const ai = getMetricFromBilling('ai_decisions');
  const aiText = formatUsagePair(ai.used, ai.limit, ai.unlimited);
  const panelPlanPills = root.querySelectorAll('.soRc__panelStatusPill--plan');
  panelPlanPills.forEach((pill) => {
    pill.innerHTML = `<b>Plan</b>: ${esc(plan)} ${esc(aiText)}`;
  });
  const perfRaw = state.performance?.last || {};
  const perfDash = perfRaw.dashboard || perfRaw.snapshot || {};
  const perfConnections = Array.isArray(perfRaw.connections) ? perfRaw.connections : [];
  const syncCandidate = perfDash.lastSyncAt
    || perfDash.last_sync_at
    || perfConnections.find((x) => x?.lastSyncAt)?.lastSyncAt
    || state.policiesAutomation?.lastSyncedAt
    || 0;
  const lastSyncText = syncCandidate
    ? new Date(syncCandidate).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';
  const panelSyncPills = root.querySelectorAll('.soRc__panelStatusPill--sync');
  panelSyncPills.forEach((pill) => {
    pill.innerHTML = `<b>Last synced</b>: ${esc(lastSyncText)}`;
  });
  if (els.planStatusBanner) els.planStatusBanner.style.display = 'none';
}

function loadReportsHistory() {
  try {
    const raw = safeGet(STORAGE.reportsHistory, '[]');
    const parsed = JSON.parse(raw || '[]');
    state.reportsHistory = Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    state.reportsHistory = [];
  }
}

function saveReportsHistory() {
  try {
    safeSet(STORAGE.reportsHistory, JSON.stringify(state.reportsHistory || []));
  } catch (_) {}
}

function addReportHistoryEntry(kind, name) {
  const entry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kind: String(kind || 'export'),
    name: String(name || 'CSV export'),
    created_at: new Date().toISOString()
  };
  state.reportsHistory = [entry, ...(Array.isArray(state.reportsHistory) ? state.reportsHistory : [])].slice(0, 12);
  saveReportsHistory();
  renderReportsHistory();
}

function renderReportsHistory() {
  if (!els.reportsHistoryList) return;
  const rows = Array.isArray(state.reportsHistory) ? state.reportsHistory : [];
  if (!rows.length) {
    els.reportsHistoryList.innerHTML = `<div class="soRc__reportsHistoryEmpty">No exports yet. Use export actions above.</div>`;
    return;
  }
  els.reportsHistoryList.innerHTML = rows.map((r) => {
    const d = new Date(r.created_at || Date.now());
    const when = Number.isNaN(d.getTime()) ? 'Just now' : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `
      <div class="soRc__reportsHistoryRow">
        <div>
          <div class="soRc__reportsHistoryName">${esc(r.name || 'Export')}</div>
          <div class="soRc__reportsHistoryMeta">${esc((r.kind || 'export').toUpperCase())} - ${esc(when)}</div>
        </div>
        <button class="soRc__reportsHistoryLink" type="button" data-open-tab="reports">Open</button>
      </div>
    `;
  }).join('');
}

function billingQuotaReached() {
  const b = state.billing || {};
  const ent = b.entitlements || {};
  const usage = b.usage || {};
  const limit = Number(ent.ai_decisions_monthly_limit ?? -1);
  const used = Number(usage.ai_decisions || 0);
  return Number.isFinite(limit) && limit >= 0 && used >= limit;
}

const PLAN_FEATURE_MATRIX = {
  free: ['reorder_decisions', 'margin_insights'],
  starter: ['reorder_decisions', 'replace_decisions', 'remove_decisions', 'margin_insights', 'category_performance', 'exports'],
  growth: ['reorder_decisions', 'replace_decisions', 'remove_decisions', 'margin_insights', 'category_performance', 'market_signals', 'trend_detection', 'inventory_risk_alerts', 'exports'],
  enterprise: ['*']
};

function hasBillingFeature(featureCode) {
  const code = String(featureCode || '').trim();
  if (!code) return true;
  const b = state.billing || {};
  const planCode = String(b.plan_code || b.account?.plan_code || '').trim().toLowerCase();
  const planFeatures = PLAN_FEATURE_MATRIX[planCode];
  if (Array.isArray(planFeatures)) {
    return planFeatures.includes('*') || planFeatures.includes(code);
  }
  const ent = b.entitlements || {};
  const features = ent.features || {};
  return !!features[code];
}

function missingBillingFeatures(rawCodes = '') {
  const codes = String(rawCodes || '')
    .split(',')
    .map((s) => String(s || '').trim())
    .filter(Boolean);
  return codes.filter((code) => !hasBillingFeature(code));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function setUpgradeRequired(node, required, reason = '') {
  if (!node) return;
  const isButton = String(node.tagName || '').toUpperCase() === 'BUTTON';
  if (!isButton) return;
  const msg = String(reason || 'Upgrade plan to continue.').trim();
  const isNavItem = node.classList.contains('soRc__navItem');

  if (required) {
    if (!node.dataset.originalLabelHtml) {
      node.dataset.originalLabelHtml = node.innerHTML;
    }
    if (isNavItem) {
      node.classList.add('soRc__navItem--locked');
      node.dataset.lockedNav = '1';
      node.setAttribute('aria-disabled', 'true');
      delete node.dataset.upgradeRequired;
      delete node.dataset.upgradeReason;
      node.classList.remove('soRc__upgradeRequired');

      let wrap = node.querySelector('.soRc__navLockWrap');
      if (!wrap) {
        wrap = document.createElement('span');
        wrap.className = 'soRc__navLockWrap';
        wrap.innerHTML = `
          <span class="soRc__navLockPill">Locked</span>
          <button class="soRc__navUpgradePill soRc__upgradeRequired" type="button" data-upgrade-required="1">Upgrade</button>
        `;
        node.appendChild(wrap);
      }
      const upgradeBtn = wrap.querySelector('.soRc__navUpgradePill');
      if (upgradeBtn) {
        upgradeBtn.setAttribute('data-upgrade-reason', msg);
        upgradeBtn.setAttribute('title', msg);
      }
      return;
    }
    node.dataset.upgradeRequired = '1';
    node.dataset.upgradeReason = msg;
    node.disabled = false;
    node.setAttribute('title', msg);
    node.classList.add('soRc__upgradeRequired');
    node.textContent = 'Upgrade';
    return;
  }

  if (node.dataset.originalLabelHtml) {
    node.innerHTML = node.dataset.originalLabelHtml;
    delete node.dataset.originalLabelHtml;
  }
  delete node.dataset.upgradeRequired;
  delete node.dataset.upgradeReason;
  delete node.dataset.lockedNav;
  node.classList.remove('soRc__navItem--locked');
  node.removeAttribute('aria-disabled');
  const wrap = node.querySelector('.soRc__navLockWrap');
  if (wrap) wrap.remove();
  node.classList.remove('soRc__upgradeRequired');
  node.removeAttribute('title');
}

function setPanelUpgradeState(panel, required, reason = '') {
  if (!panel) return;
  let note = panel.querySelector('.soRc__upgradeInline');
  if (!required) {
    if (note) note.remove();
    panel.classList.remove('is-locked');
    return;
  }
  panel.classList.add('is-locked');
  if (!note) {
    note = document.createElement('div');
    note.className = 'soRc__upgradeInline';
    note.innerHTML = `
      <span class="soRc__upgradeInlineText"></span>
      <button class="soRc__smartAction soRc__upgradeRequired" type="button" data-upgrade-required="1">Upgrade</button>
    `;
    panel.appendChild(note);
  }
  const txt = note.querySelector('.soRc__upgradeInlineText');
  if (txt) txt.textContent = String(reason || 'Upgrade plan to unlock this panel.');
  const btn = note.querySelector('[data-upgrade-required]');
  if (btn) btn.setAttribute('data-upgrade-reason', String(reason || 'Upgrade plan to unlock this panel.'));
}

function applyBillingUiGates() {
  const b = state.billing || {};
  const ent = b.entitlements || {};
  const planCode = String(b.plan_code || b.account?.plan_code || '').trim().toLowerCase();
  const features = ent.features || {};
  const quotaReached = billingQuotaReached();
  const quotaMsg = 'AI decision limit reached for current plan. Upgrade to continue.';

  const gateReasons = new Map();
  const setReason = (node, reason) => {
    if (!node) return;
    gateReasons.set(node, String(reason || 'Upgrade plan to continue.'));
  };

  const applyButtons = Array.from(root.querySelectorAll('[data-perf-ai-action="apply_suggestion"]'));
  if (planCode && (!features.replace_decisions || !features.remove_decisions)) {
    applyButtons.forEach((node) => setReason(node, 'Upgrade plan to apply replace/remove decisions.'));
  }

  if (quotaReached) {
    Array.from(root.querySelectorAll('[data-quick-prompt]')).forEach((node) => setReason(node, quotaMsg));
  }

  Array.from(root.querySelectorAll('[data-feature-required]')).forEach((node) => {
    const missing = missingBillingFeatures(node.getAttribute('data-feature-required'));
    if (missing.length) setReason(node, `Upgrade plan to unlock: ${missing.join(', ')}.`);
  });

  const gatedNodes = new Set([
    ...Array.from(root.querySelectorAll('[data-feature-required]')),
    ...Array.from(root.querySelectorAll('[data-quick-prompt]')),
    ...applyButtons
  ]);

  gatedNodes.forEach((node) => {
    const reason = gateReasons.get(node) || '';
    setUpgradeRequired(node, !!reason, reason);
  });

  Array.from(root.querySelectorAll('[data-feature-panel]')).forEach((panel) => {
    const missing = missingBillingFeatures(panel.getAttribute('data-feature-panel'));
    panel.hidden = false;
    if (missing.length) {
      setPanelUpgradeState(panel, true, `Upgrade plan to unlock: ${missing.join(', ')}.`);
      panel.querySelectorAll('button').forEach((btn) => {
        if (btn.closest('.soRc__upgradeInline')) return;
        setUpgradeRequired(btn, true, `Upgrade plan to unlock: ${missing.join(', ')}.`);
      });
    } else {
      setPanelUpgradeState(panel, false);
    }
  });
}

function formatBillingGateMessage(payload, fallback = 'Action blocked by current plan limits') {
  const billing = payload?.billing || {};
  if (billing?.ai_decisions) {
    const used = Number(billing.ai_decisions.used || 0);
    const limit = Number(billing.ai_decisions.limit || 0);
    return `AI decisions used ${used}/${limit}. Upgrade plan to continue.`;
  }
  if (billing?.products_analyzed) {
    const used = Number(billing.products_analyzed.used || 0);
    const limit = Number(billing.products_analyzed.limit || 0);
    return `Products analyzed ${used}/${limit}. Upgrade to run more sync operations.`;
  }
  if (billing?.stores) {
    const used = Number(billing.stores.used || 0);
    const limit = Number(billing.stores.limit || 0);
    return `Connected stores ${used}/${limit}. Upgrade to connect more providers.`;
  }
  return payload?.message || fallback;
}

async function loadBillingEntitlements() {
  try {
    await ensureBackendJwt();
    const [billingRes, usageRes] = await Promise.all([
      fetch(BILLING_ENTITLEMENTS_API, {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store'
      }),
      fetch(BILLING_USAGE_API, {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store'
      }).catch(() => null)
    ]);

    const j = await billingRes.json().catch(() => ({}));
    if (!billingRes.ok || !j?.ok) return;

    let usagePayload = null;
    if (usageRes?.ok) {
      usagePayload = await usageRes.json().catch(() => null);
    }

    state.billing = {
      ...j,
      usage_summary: usagePayload?.metrics ? { metrics: usagePayload.metrics, near_limits: usagePayload.near_limits || {} } : (j.usage_summary || null),
      near_limits: usagePayload?.near_limits || j.near_limits || {},
      usage_period: usagePayload?.usage_period || j.usage_period || null
    };
    renderBillingUsageSummary();
    applyBillingUiGates();
    maybeWarnNearLimits();
  } catch (_) {}
}

async function loadBillingUsageOnly() {
  try {
    await ensureBackendJwt();
    const r = await fetch(BILLING_USAGE_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) return;
    state.billing = {
      ...(state.billing || {}),
      usage_summary: j?.metrics ? { metrics: j.metrics, near_limits: j.near_limits || {} } : (state.billing?.usage_summary || null),
      near_limits: j?.near_limits || state.billing?.near_limits || {},
      usage_period: j?.usage_period || state.billing?.usage_period || null,
      plan_code: j?.plan_code || state.billing?.plan_code || state.billing?.account?.plan_code || 'free',
      status: j?.status || state.billing?.status || state.billing?.account?.status || 'active'
    };
    renderBillingUsageSummary();
    applyBillingUiGates();
    maybeWarnNearLimits();
  } catch (_) {}
}

async function openBillingPortal() {
  const stepOk = await ensureStepUpFor('billing_plan_change');
  if (!stepOk) {
    showToast('Verification required to continue.', 'warn');
    return;
  }
  try {
    await ensureBackendJwt();
    const r = await fetch(BILLING_PORTAL_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j?.ok && j?.redirect_url) {
      window.location.assign(String(j.redirect_url));
      return;
    }
  } catch (_) {}
  window.location.assign(PRICING_PAGE_URL);
}

async function openPricingWithStepUp() {
  const stepOk = await ensureStepUpFor('billing_plan_change');
  if (!stepOk) {
    showToast('Verification required to continue.', 'warn');
    return;
  }
  window.location.assign(PRICING_PAGE_URL);
}

async function loadTeamMembers() {
  try {
    await ensureBackendJwt();
    const r = await fetch(TEAM_MEMBERS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) throw new Error(String(j?.message || j?.error || 'team_members_load_failed'));
    state.teamMembers = {
      members: Array.isArray(j.members) ? j.members : [],
      seats: j.seats && typeof j.seats === 'object'
        ? j.seats
        : { used: 0, limit: 0, unlimited: false, remaining: 0 }
    };
    return state.teamMembers;
  } catch (err) {
    state.teamMembers = { members: [], seats: { used: 0, limit: 0, unlimited: false, remaining: 0 } };
    showToast(String(err?.message || 'Could not load team members'), 'err');
    return state.teamMembers;
  }
}

function renderTeamMembersSheet() {
  const wrap = document.getElementById('soTeamMembersWrap');
  if (!wrap) return;
  const seats = state.teamMembers?.seats || {};
  const members = Array.isArray(state.teamMembers?.members) ? state.teamMembers.members : [];
  const used = Number(seats.used || members.length || 0);
  const limit = Number(seats.limit || 0);
  const unlimited = !!seats.unlimited || limit < 0;
  const remaining = unlimited ? null : Math.max(0, Number(seats.remaining ?? (limit - used)));

  const seatLabel = unlimited
    ? `${used} seats used - Unlimited`
    : `${used}/${Math.max(0, limit)} seats used`;

  const rows = members.map((m) => {
    const canRemove = String(m?.role || '').toLowerCase() !== 'owner';
    return `
      <div class="soRc__teamRow">
        <div>
          <div class="soRc__teamName">${esc(m?.name || m?.email || 'Member')}</div>
          <div class="soRc__teamSub">${esc(m?.email || '')}</div>
        </div>
        <div class="soRc__row" style="display:flex;align-items:center;gap:8px;">
          <span class="soRc__teamRole">${esc((m?.role || 'member').toUpperCase())}</span>
          ${canRemove ? `<button class="soRc__eventCta" type="button" data-team-remove="${esc(m?.id || '')}">Remove</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const canInvite = unlimited || (remaining > 0);
  wrap.innerHTML = `
    <div class="soRc__teamWrap">
      <div class="soRc__teamMeta">${esc(seatLabel)}</div>
      <div class="soRc__teamList">${rows || '<div class="soRc__teamSub">No team members yet.</div>'}</div>
      <div class="soRc__teamForm">
        <input id="soTeamMemberName" type="text" placeholder="Name (optional)" maxlength="120">
        <input id="soTeamMemberEmail" type="email" placeholder="Work email" maxlength="320">
        ${canInvite
          ? '<button class="soRc__eventCta" id="soTeamMemberAdd" type="button">Add member</button>'
          : '<button class="soRc__eventCta soRc__upgradeRequired" id="soTeamMemberUpgrade" type="button">Upgrade</button>'}
      </div>
    </div>
  `;

  wrap.querySelectorAll('[data-team-remove]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const memberId = String(btn.getAttribute('data-team-remove') || '').trim();
      if (!memberId) return;
      btn.disabled = true;
      try {
        const stepOk = await ensureStepUpFor('team_member_remove');
        if (!stepOk) return;
        await ensureBackendJwt();
        const r = await fetch(TEAM_MEMBER_REMOVE_API, {
          method: 'POST',
          headers: chatHeaders(),
          body: JSON.stringify({ member_id: memberId })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j?.ok) throw new Error(String(j?.message || j?.error || 'team_member_remove_failed'));
        state.teamMembers = { members: Array.isArray(j.members) ? j.members : [], seats: j.seats || {} };
        renderTeamMembersSheet();
        await loadBillingUsageOnly();
        showToast('Team member removed', 'ok');
      } catch (err) {
        showToast(String(err?.message || 'Remove failed'), 'err');
      } finally {
        btn.disabled = false;
      }
    });
  });

  const addBtn = document.getElementById('soTeamMemberAdd');
  addBtn?.addEventListener('click', async () => {
    const emailEl = document.getElementById('soTeamMemberEmail');
    const nameEl = document.getElementById('soTeamMemberName');
    const email = String(emailEl?.value || '').trim().toLowerCase();
    const name = String(nameEl?.value || '').trim();
    if (!email || !/@/.test(email)) {
      showToast('Enter a valid work email', 'warn');
      return;
    }
    addBtn.disabled = true;
    try {
      const stepOk = await ensureStepUpFor('team_member_add');
      if (!stepOk) return;
      await ensureBackendJwt();
      const r = await fetch(TEAM_MEMBER_ADD_API, {
        method: 'POST',
        headers: chatHeaders(),
        body: JSON.stringify({ name, email, role: 'member' })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) throw new Error(String(j?.message || j?.error || 'team_member_add_failed'));
      state.teamMembers = { members: Array.isArray(j.members) ? j.members : [], seats: j.seats || {} };
      if (emailEl) emailEl.value = '';
      if (nameEl) nameEl.value = '';
      renderTeamMembersSheet();
      await loadBillingUsageOnly();
      showToast('Team member added', 'ok');
    } catch (err) {
      showToast(String(err?.message || 'Add failed'), 'err');
    } finally {
      addBtn.disabled = false;
    }
  });

  document.getElementById('soTeamMemberUpgrade')?.addEventListener('click', () => {
    closeSheet();
    void openPricingWithStepUp();
  });
}


async function downloadPerformanceExport() {
  try {
    await ensureBackendJwt();
    const r = await fetch(EXPORT_PERFORMANCE_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(String(j?.message || j?.error || 'export_failed'));
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coodra-performance-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addReportHistoryEntry('performance', 'Performance CSV');
    showToast('Export downloaded', 'ok');
  } catch (err) {
    showToast(String(err?.message || 'Export failed'), 'err');
  }
}

async function downloadDecisionsExport() {
  try {
    await ensureBackendJwt();
    const r = await fetch(EXPORT_DECISIONS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(String(j?.message || j?.error || 'export_failed'));
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coodra-decisions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addReportHistoryEntry('decisions', 'Decisions CSV');
    showToast('Decision export downloaded', 'ok');
  } catch (err) {
    showToast(String(err?.message || 'Export failed'), 'err');
  }
}

async function loadSavedReportsList() {
  try {
    await ensureBackendJwt();
    const r = await fetch(SAVED_REPORTS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) return [];
    return Array.isArray(j.reports) ? j.reports : [];
  } catch (_) {
    return [];
  }
}

async function downloadSavedReport(preset) {
  const code = String(preset || '').trim().toLowerCase();
  if (!code) return;
  try {
    await ensureBackendJwt();
    const r = await fetch(`${GENERATE_REPORT_API}&preset=${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: authHeaders(),
      cache: 'no-store'
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(String(j?.message || j?.error || 'report_failed'));
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coodra-${code}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addReportHistoryEntry(code, `${code.replace(/_/g, ' ')} report`);
    showToast('Report generated', 'ok');
  } catch (err) {
    showToast(String(err?.message || 'Report generation failed'), 'err');
  }
}

async function loadApiAccessStatus() {
  try {
    await ensureBackendJwt();
    const r = await fetch(API_ACCESS_STATUS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) return { ok: false, error: j?.error || 'api_access_status_failed' };
    return { ok: true, data: j };
  } catch (_) {
    return { ok: false, error: 'api_access_status_failed' };
  }
}

async function rotateApiAccessKey() {
  const stepOk = await ensureStepUpFor('api_key_action');
  if (!stepOk) throw new Error('verification_required');
  await ensureBackendJwt();
  const r = await fetch(API_ACCESS_ROTATE_API, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ valid_days: 365 })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(String(j?.message || j?.error || 'api_key_rotation_failed'));
  return j;
}

function apiAccessSheetHtml(status = {}) {
  const last4 = String(status?.key_last4 || '').trim();
  const created = status?.key_created_at ? new Date(status.key_created_at).toLocaleString() : 'Not created';
  const expires = status?.key_expires_at ? new Date(status.key_expires_at).toLocaleString() : 'N/A';
  return `
    <div class="soRc__field">
      <label>API access</label>
      <div class="soRc__fieldValue">Enterprise API access is enabled for this account.</div>
    </div>
    <div class="soRc__field">
      <label>Current key</label>
      <div class="soRc__fieldValue">${last4 ? `••••${escapeHtml(last4)}` : 'No API key generated'}</div>
    </div>
    <div class="soRc__field">
      <label>Created</label>
      <div class="soRc__fieldValue">${escapeHtml(created)}</div>
    </div>
    <div class="soRc__field">
      <label>Expires</label>
      <div class="soRc__fieldValue">${escapeHtml(expires)}</div>
    </div>
    <div class="soRc__row" style="gap:8px;display:flex;flex-wrap:wrap;">
      <button class="soRc__eventCta" id="soSheetRotateApiKey" type="button">Generate new API key</button>
    </div>
    <div class="soRc__field" id="soApiKeyRevealWrap" hidden>
      <label>New API key (copy now)</label>
      <textarea id="soApiKeyReveal" class="soRc__input" rows="3" readonly></textarea>
    </div>
  `;
}

async function runPerformanceSync(syncType) {
  try {
    await ensureBackendJwt();
    const r = await fetch(PERFORMANCE_SYNC_API, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        provider: 'shopify',
        syncType,
        executeNow: true
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) {
      if (r.status === 402) {
        showToast(formatBillingGateMessage(j, 'Performance sync blocked by plan limits'), 'warn');
        return;
      }
      throw new Error(j?.error || 'performance_sync_failed');
    }

    showToast('Performance sync completed', 'ok');
    await loadPerformanceStatus();
  } catch {
    showToast('Performance sync failed', 'err');
  }
}

function normalizeProviderStatus(value) {
  const s = String(value || '').trim().toLowerCase();
  if (s === 'connected' || s === 'active' || s === 'ok' || s === 'ready') return 'connected';
  if (s === 'coming_soon' || s === 'coming soon' || s === 'unsupported' || s === 'unavailable') return 'coming_soon';
  if (!s || s === 'available' || s === 'not_connected' || s === 'disconnected' || s === 'pending') return 'not_connected';
  return s;
}

function resolvePerfShopDomain() {
  const key = `so_perf_shop_domain_${USER_SCOPE}`;
  const fromSaved = String(safeGet(key, '') || '').trim().toLowerCase();
  const p = state.performance.last || {};
  const fromCompany = String(p?.company?.shopDomain || '').trim().toLowerCase();
  const fromConnection = (Array.isArray(p?.connections) ? p.connections : [])
    .find(x => x?.provider === 'shopify' && x?.externalAccountId)
    ?.externalAccountId;
  return fromCompany || String(fromConnection || '').trim().toLowerCase() || fromSaved;
}

function persistPerfShopDomain(shopDomainRaw) {
  const key = `so_perf_shop_domain_${USER_SCOPE}`;
  const v = String(shopDomainRaw || '').trim().toLowerCase();
  if (!v) return;
  safeSet(key, v);
}

function askForShopDomainFallback() {
  const key = `so_perf_shop_domain_${USER_SCOPE}`;
  const prev = String(safeGet(key, '') || '').trim().toLowerCase();
  const typed = window.prompt('Enter your Shopify shop domain (example: yourshop.myshopify.com)', prev || '');
  if (!typed) return '';
  let v = String(typed).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!v.endsWith('.myshopify.com')) return '';
  persistPerfShopDomain(v);
  return v;
}

function inferAppHandleFromPath(pathname) {
  const m = String(pathname || '').match(/\/apps\/([^/?#]+)/i);
  return m ? decodeURIComponent(String(m[1] || '').trim()) : '';
}

function persistPerfAppHandle(v) {
  const next = String(v || '').trim();
  if (!next) return;
  safeSet(STORAGE.perfAppHandle, next);
}

function resolvePerfAppHandle() {
  const queryHandle = (() => {
    try {
      return String(new URLSearchParams(window.location.search).get('app_handle') || '').trim();
    } catch (_) {
      return '';
    }
  })();
  const globalHandle = String(window.__SO_RC_APP_HANDLE || window.SHOPIFY_APP_HANDLE || '').trim();
  const storedHandle = String(safeGet(STORAGE.perfAppHandle, '') || '').trim();
  const pathHandle = inferAppHandleFromPath(window.location.pathname);
  const handle = queryHandle || globalHandle || storedHandle || pathHandle || 'freight-pool-app-1';
  persistPerfAppHandle(handle);
  return handle;
}

function goToShopifyConnect() {
  const shopDomain = resolvePerfShopDomain() || askForShopDomainFallback();
  if (!shopDomain) {
    showToast('Missing or invalid Shopify domain', 'err');
    return;
  }
  persistPerfShopDomain(shopDomain);
  const storeHandle = shopDomain.replace(/\.myshopify\.com$/i, '');
  const appHandle = resolvePerfAppHandle();
  const returnTo = `${window.location.origin}/pages/retailer?tab=performance`;
  const actorEmail = String(CUSTOMER_EMAIL || '').trim().toLowerCase();
  const url = `https://admin.shopify.com/store/${encodeURIComponent(storeHandle)}/apps/${appHandle}/app/performance?intent=connect&provider=shopify&return_to=${encodeURIComponent(returnTo)}&actor_email=${encodeURIComponent(actorEmail)}`;
  const popup = window.open(url, '_blank', 'width=1120,height=820');
  if (!popup) {
    try { window.location.assign(url); } catch (_) {}
  }
}

async function waitForProviderConnected(provider, timeoutMs = 180000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise(r => setTimeout(r, 2500));
    try {
      await loadPerformanceStatus();
      const p = state.performance.last || {};
      const list = Array.isArray(p.connections) ? p.connections : [];
      const hit = list.find(x => String(x?.provider || '').toLowerCase() === String(provider || '').toLowerCase());
      if (normalizeProviderStatus(hit?.status) === 'connected') return true;
    } catch (_) {}
  }
  return false;
}

async function startPerformanceConnect(provider) {
  const targetProvider = String(provider || '').trim().toLowerCase();
  if (!['shopify', 'square', 'clover', 'lightspeed', 'moneris'].includes(targetProvider)) {
    showToast('Provider coming soon', 'warn');
    return;
  }

  const shopDomain = resolvePerfShopDomain() || askForShopDomainFallback();
  if (!shopDomain) {
    showToast('Connect failed: missing_shop_domain', 'err');
    return;
  }
  persistPerfShopDomain(shopDomain);

  const storeHandle = shopDomain.replace(/\.myshopify\.com$/i, '');
  const appHandle = resolvePerfAppHandle();
  const returnTo = `${window.location.origin}/pages/retailer?tab=performance`;
  const actorEmail = String(CUSTOMER_EMAIL || '').trim().toLowerCase();
  const connectUrl = `https://admin.shopify.com/store/${encodeURIComponent(storeHandle)}/apps/${appHandle}/app/performance?intent=connect&provider=${encodeURIComponent(targetProvider)}&return_to=${encodeURIComponent(returnTo)}&actor_email=${encodeURIComponent(actorEmail)}`;
  try {
    const popup = window.open(connectUrl, '_blank', 'width=1120,height=820');
    if (!popup) {
      window.location.assign(connectUrl);
      return;
    }

    showToast(
      targetProvider === 'moneris'
        ? 'Opening Moneris setup'
        : `Complete ${targetProvider === 'square' ? 'Square' : targetProvider === 'clover' ? 'Clover' : targetProvider === 'lightspeed' ? 'Lightspeed' : 'Shopify'} login in the opened tab`,
      'ok'
    );
    if (targetProvider === 'moneris') {
      await new Promise(r => setTimeout(r, 2000));
      await loadPerformanceStatus();
      const providerRow = (state.performance.last?.connections || []).find((x) => String(x?.provider || '').toLowerCase() === 'moneris');
      const status = normalizeProviderStatus(providerRow?.status);
      try { popup.close(); } catch (_) {}
      if (status === 'connected') {
        showToast('Moneris connected', 'ok');
      } else {
        showToast('Moneris saved as pending until config is added', 'warn');
      }
      return;
    }
    const connected = await waitForProviderConnected(targetProvider, 180000);
    if (connected) {
      try { popup.close(); } catch (_) {}
      const label = targetProvider === 'square'
        ? 'Square'
        : targetProvider === 'clover'
          ? 'Clover'
          : targetProvider === 'lightspeed'
            ? 'Lightspeed'
            : 'Shopify';
      showToast(`${label} connected`, 'ok');
      await loadPerformanceStatus();
    } else {
      showToast('Still waiting for connection...', 'warn');
    }
  } catch (err) {
    console.error('startPerformanceConnect navigation failed:', err);
    showToast('Connect failed: navigation_error', 'err');
  }
}

async function runPerformanceConnectionAction(provider, action) {
  try {
    await ensureBackendJwt();
    const r = await fetch(PERFORMANCE_CONNECTIONS_API, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ provider, action })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) {
      if (r.status === 402) {
        showToast(formatBillingGateMessage(j, 'Connection blocked by plan limits'), 'warn');
        return;
      }
      throw new Error(j?.error || 'performance_connection_action_failed');
    }
    showToast('Connection updated', 'ok');
    await loadPerformanceStatus();
  } catch {
    showToast('Could not update connection', 'err');
  }
}

        function parseBudget(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return null;

  const hasRevenueContext =
    /\b(yearly|annual|monthly|weekly)\s+(sales|revenue)\b/.test(t) ||
    /\b(sales|revenue|turnover|gmv)\b/.test(t);

  const explicit =
    t.match(/\b(?:budget(?:\s+is|\s+of|:)?|working budget(?:\s+is|\s+of|:)?|inventory budget(?:\s+is|\s+of|:)?|to spend|for spend)\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\b/) ||
    t.match(/\b(?:have|with)\s+\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\s+(?:budget|to spend)\b/);

  if (explicit?.[1]) {
    let amount = Number(String(explicit[1]).replace(/,/g, ''));
    if (explicit[2] && amount < 1000) amount *= 1000;
    return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
  }

  if (hasRevenueContext) return null;

  const softer = t.match(/\bbudget\b[^.\n]{0,24}?\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\b/);
  if (softer?.[1]) {
    let amount = Number(String(softer[1]).replace(/,/g, ''));
    if (softer[2] && amount < 1000) amount *= 1000;
    return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
  }

  return null;
}

function parseOtbAmountToken(numRaw, kRaw) {
  if (!numRaw) return null;
  let amount = Number(String(numRaw).replace(/,/g, ''));
  if (!Number.isFinite(amount)) return null;
  if (kRaw && amount < 1000) amount *= 1000;
  return Math.max(0, Math.round(amount));
}

function extractOpenToBuyUpdates(text) {
  const raw = String(text || '');
  const t = raw.toLowerCase();
  if (!t) return null;

  const hasIntentVerb = /\b(set|update|change|make|adjust|use|save|put)\b/.test(t);
  const hasOtbContext = /\b(open[-\s]?to[-\s]?buy|otb|budget|committed|commited|available)\b/.test(t);
  if (!hasOtbContext) return null;
  if (!hasIntentVerb && !/\b(is|at|to|=)\b/.test(t)) return null;

  const fieldPatterns = {
    budget: /\bbudget\b[^\d$-]{0,18}\$?\s*(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\b/i,
    committed: /\b(committed|commited)\b[^\d$-]{0,18}\$?\s*(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\b/i,
    available: /\b(available|open[-\s]?to[-\s]?buy|otb)\b[^\d$-]{0,18}\$?\s*(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(k)?\b/i
  };

  const updates = {};
  const budgetMatch = raw.match(fieldPatterns.budget);
  const committedMatch = raw.match(fieldPatterns.committed);
  const availableMatch = raw.match(fieldPatterns.available);

  const budget = parseOtbAmountToken(budgetMatch?.[1], budgetMatch?.[2]);
  const committed = parseOtbAmountToken(committedMatch?.[2], committedMatch?.[3]);
  const available = parseOtbAmountToken(availableMatch?.[2], availableMatch?.[3]);

  if (budget != null) updates.budget = budget;
  if (committed != null) updates.committed = committed;
  if (available != null) updates.available = available;

  if (!Object.keys(updates).length) return null;
  if (!Object.prototype.hasOwnProperty.call(updates, 'available')
    && Object.prototype.hasOwnProperty.call(updates, 'budget')
    && Object.prototype.hasOwnProperty.call(updates, 'committed')) {
    updates.available = Math.max(0, updates.budget - updates.committed);
  }
  return updates;
}

async function handleOpenToBuyUpdateFromChat(text) {
  const updates = extractOpenToBuyUpdates(text);
  if (!updates) return { handled: false };

  const budgetInput = policyNode('open_to_buy', 'budget');
  const committedInput = policyNode('open_to_buy', 'committed');
  const availableInput = policyNode('open_to_buy', 'available');
  if (!budgetInput || !committedInput || !availableInput) return { handled: false };

  if (Object.prototype.hasOwnProperty.call(updates, 'budget')) budgetInput.value = String(updates.budget);
  if (Object.prototype.hasOwnProperty.call(updates, 'committed')) committedInput.value = String(updates.committed);
  if (Object.prototype.hasOwnProperty.call(updates, 'available')) availableInput.value = String(updates.available);

  const saved = await savePolicyFeature('open_to_buy');
  if (!saved) {
    return { handled: true, ok: false, updates };
  }
  return { handled: true, ok: true, updates, saved };
}

        function updateProfileFromText(text) {
  const raw = String(text || '').trim();
  const t = raw.toLowerCase();
  if (!t) return;

  const storeTypeMatch =
    t.match(/\b(pet store|pet shop|grocery store|grocery|convenience store|convenience|specialty store|specialty|pharmacy|snack store|beverage store)\b/);
  if (storeTypeMatch?.[1]) {
    state.profile.store_type = storeTypeMatch[1];
  }

  const locationMatch =
    raw.match(/\b(?:in|located in|based in|from)\s+([A-Z][a-z]+(?:[\s-][A-Z][a-z]+){0,3})\b/) ||
    raw.match(/\b(Montreal|Toronto|Vancouver|Calgary|Ottawa|Edmonton|Quebec City|Winnipeg|Halifax)\b/i);
  if (locationMatch?.[1]) {
    state.profile.location = locationMatch[1].trim();
  }

  const lc = t.match(/\b(\d+)\s*(store|stores|location|locations)\b/);
  if (lc) {
    state.profile.locations_count = Number(lc[1]);
  }

  const priorityMatch =
    t.match(/\b(improve margins?|increase margins?|gross margin|net margin|stockouts?|inventory turns?|cash ?flow|stability|growth)\b/);
  if (priorityMatch?.[0]) {
    state.profile.priority = priorityMatch[0];
  }

  const constraintsMatch =
    raw.match(/\b(?:avoid|must|need to avoid|constraint|constraints|lead time|brand restrictions?|shelf space)\b[^.!\n]{0,120}/i);
  if (constraintsMatch?.[0]) {
    state.profile.constraints = constraintsMatch[0].trim();
  }

  const b = parseBudget(raw);
  if (b) {
    state.profile.budget = b;
    state.plan.budget = b;
  }

  queuePlanSave();
}

              function recomputeFlags(lastUserText) {
  const assumptions = [];
  const missing = [];
  const raw = String(lastUserText || '').trim();
  const t = raw.toLowerCase();

  const parsedBudget = parseBudget(raw);
  if (/\b(around|about|roughly|approx|maybe)\b/.test(t) && parsedBudget) {
    assumptions.push('Budget interpreted as approximate.');
  }

  const storeType = String(state.profile.store_type || '').trim();
  const location = String(state.profile.location || '').trim();
  const locationsCount = Number(state.profile.locations_count || 0);
  const priority = String(state.profile.priority || '').trim();
  const constraints = String(state.profile.constraints || '').trim();

  if (!storeType) missing.push('Store category not provided.');
  if (!location) missing.push('Sales region not provided.');
  if (!locationsCount) missing.push('Number of locations not provided.');
  if (!priority) missing.push('Primary objective not provided.');
  if (!constraints) missing.push('Operational constraints not provided.');

  state.plan.assumptions = assumptions;
  state.plan.missing = missing;
}
      
        function renderBadges() {
  const a = state.plan.assumptions.length;
  const m = state.plan.missing.length;
  const totalFlags = a + m;

  if (els.assumpBadge) {
    els.assumpBadge.hidden = a === 0;
    els.assumpBadge.textContent = String(a || 0);
  }

  if (els.missingBadge) {
    els.missingBadge.hidden = m === 0;
    els.missingBadge.textContent = String(m || 0);
  }

}

        function setRisk(r) {
          const risk = (r || 'unknown').toLowerCase();
          if (els.riskKpi) els.riskKpi.dataset.risk = risk;
          if (els.riskVal) els.riskVal.textContent = risk === 'low' ? 'Low' : risk === 'medium' ? 'Moderate' : risk === 'high' ? 'High' : '—';
        }

                function renderPlan() {
  renderBillingUsageSummary();
  if (els.budgetVal) els.budgetVal.textContent = money(state.plan.budget);
  if (els.marginVal) els.marginVal.textContent = state.plan.margin == null ? '—' : `${state.plan.margin}%`;
  setRisk(state.plan.risk);

  const liveItems = Array.isArray(state.liveCart?.items) ? state.liveCart.items : [];
  const recommended = Array.isArray(state.plan.recommended_lines) ? state.plan.recommended_lines : [];

  if (!liveItems.length) {
    if (els.cartBody) els.cartBody.innerHTML = `<tr><td colspan="3">Your cart is empty.</td></tr>`;
    if (els.cartTotal) els.cartTotal.textContent = money(0);
    if (els.proceedBtn) els.proceedBtn.disabled = true;
  } else {
    if (els.cartBody) {
      els.cartBody.innerHTML = liveItems.map((item, idx) => `
        <tr>
          <td>
            <div class="soRc__itemCell">
              ${
                item.image
                  ? `<img class="soRc__itemThumb" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" />`
                  : `<div class="soRc__itemThumbFallback">N/A</div>`
              }
              <div class="soRc__itemName">${esc(item.title)}</div>
            </div>
          </td>
          <td>
            <div class="soRc__qty">
              <button class="soRc__qtyBtn" type="button" data-qty-dec="${idx}">−</button>
              <div class="soRc__qtyVal">${item.quantity}</div>
              <button class="soRc__qtyBtn" type="button" data-qty-inc="${idx}">+</button>
            </div>
          </td>
          <td>${money(item.total)}</td>
        </tr>
      `).join('');
    }

    if (els.cartTotal) els.cartTotal.textContent = money(state.liveCart.total || 0);
    if (els.proceedBtn) els.proceedBtn.disabled = false;
  }

  if (!recommended.length) {
    if (els.recommendedBody) els.recommendedBody.innerHTML = `<tr><td colspan="3">No recommendations yet.</td></tr>`;
    if (els.recommendedTotal) els.recommendedTotal.textContent = money(0);
    if (els.planTotalSub) els.planTotalSub.textContent = `Recommended total ${money(0)}`;
  } else {
    if (els.recommendedBody) {
      els.recommendedBody.innerHTML = recommended.map((x) => `
        <tr>
          <td>
            <div class="soRc__itemCell">
              ${
                (() => {
                  const shopItem =
                    state.shop.find(s => String(s.id) === String(x.id)) ||
                    state.shop.find(s => (s.name || '').trim().toLowerCase() === (x.name || '').trim().toLowerCase());
                  return shopItem?.imageUrl
                    ? `<img class="soRc__itemThumb" src="${esc(shopItem.imageUrl)}" alt="${esc(x.name)}" loading="lazy" />`
                    : `<div class="soRc__itemThumbFallback">N/A</div>`;
                })()
              }
              <div class="soRc__itemName">${esc(x.name)}</div>
            </div>
          </td>
          <td>
            <div class="soRc__qty">
              <div class="soRc__qtyVal">${x.qty}</div>
            </div>
          </td>
          <td>${money(x.total)}</td>
        </tr>
      `).join('');
    }

    const recommendedTotal = recommended.reduce((a, x) => a + Number(x.total || 0), 0);
    if (els.recommendedTotal) els.recommendedTotal.textContent = money(recommendedTotal);
    if (els.planTotalSub) els.planTotalSub.textContent = `Recommended total ${money(recommendedTotal)}`;
  }

  if (els.assumptionsList) {
    els.assumptionsList.innerHTML = state.plan.assumptions.length
      ? state.plan.assumptions.map(t => `<div class="soRc__emptyState" style="margin:8px 0">${esc(t)}</div>`).join('')
      : `<div class="soRc__emptyState">No assumptions flagged.</div>`;
  }

  if (els.missingList) {
    els.missingList.innerHTML = state.plan.missing.length
      ? state.plan.missing.map(t => `<div class="soRc__emptyState" style="margin:8px 0">${esc(t)}</div>`).join('')
      : `<div class="soRc__emptyState">No missing data flagged.</div>`;
  }

  renderBadges();
}

        async function respond(overrideText = '') {
  const c = currentChat();
  if (!c) return;

  const attachmentSummary = (c.attachmentSummary || '').trim();
  const promptSeed = String(
    (overrideText && overrideText.trim())
      ? overrideText
      : (c.messages || []).filter((m) => m.role === 'user').slice(-1)[0]?.text || ''
  ).trim();
  let messages = toBackendMessages(c);
  if (overrideText && overrideText.trim()) {
    messages = [...messages, { role: 'user', content: overrideText.trim() }];
  }
  let liveCartContext = null;

  const postChat = async (messagesPayload) => {
    await ensureBackendJwt();
    const perfRaw = state.performance?.last || {};
    const perfDash = perfRaw.dashboard || perfRaw.snapshot || {};
    const perfConnections = Array.isArray(perfRaw.connections) ? perfRaw.connections : [];
    const topProducts = Array.isArray(perfDash.topProducts) ? perfDash.topProducts : [];
    const lowInventory = Array.isArray(perfDash.lowInventory) ? perfDash.lowInventory : [];
    const perfContext = {
      connected_providers: perfConnections
        .filter((x) => normalizeProviderStatus(x?.status) === 'connected')
        .map((x) => String(x?.provider || '').toLowerCase()),
      last_sync_at: perfDash.lastSyncAt || perfConnections.find((x) => x?.lastSyncAt)?.lastSyncAt || null,
      metrics: {
        today_sales: Number(perfDash.todaySales || 0),
        week_sales: Number(perfDash.weekSales || 0),
        today_orders: Number(perfDash.todayOrders || 0),
        week_orders: Number(perfDash.weekOrders || 0),
        gross_margin_pct: Number(perfDash.grossMargin || 0),
        low_inventory_alerts: Number(perfDash.lowInventoryAlerts || 0),
        top_products: topProducts.slice(0, 6).map((x) => ({
          sku: String(x?.sku || ''),
          title: String(x?.title || x?.name || ''),
          sales: Number(x?.sales || x?.revenue || x?.revenueCents || 0)
        })),
        low_inventory_items: lowInventory.slice(0, 10).map((x) => ({
          sku: String(x?.sku || ''),
          title: String(x?.title || x?.name || ''),
          on_hand: Number(x?.onHand || x?.on_hand || 0),
          days_left: Number(x?.daysLeft || x?.days_until_stockout || 0)
        }))
      }
    };
    const payload = {
      messages: messagesPayload,
      session_id: SESSION_ID,
      user_id: String(USER_ID || ''),
      client_name: els.companyName?.textContent || 'Retailer',
      client_profile: {
        store_type: state.profile.store_type || '',
        location: state.profile.location || '',
        budget: Number(state.plan.budget || 0),
        target_audience: state.profile.priority || ''
      },
      cart_context: liveCartContext,
      attachment_summary: attachmentSummary,
      performance_context: perfContext
    };
    const r = await fetchWithJwtRetry(CHAT_API, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    const j = await r.json().catch(() => ({}));
    const text = j?.choices?.[0]?.message?.content?.trim() || '';
    return { ok: r.ok, status: r.status, j, text };
  };

  // Streaming variant: calls /api/chat?stream=true and yields SSE chunks.
  // Returns { chunks: asyncIterator, j, text } where chunks yields chunk objects
  // and text is the assembled full response (from the "done" event).
  async function postChatStream(messagesPayload) {
    await ensureBackendJwt();
    const perfRaw = state.performance?.last || {};
    const perfDash = perfRaw.dashboard || perfRaw.snapshot || {};
    const perfConnections = Array.isArray(perfRaw.connections) ? perfRaw.connections : [];
    const topProducts = Array.isArray(perfDash.topProducts) ? perfDash.topProducts : [];
    const lowInventory = Array.isArray(perfDash.lowInventory) ? perfDash.lowInventory : [];
    const perfContext = {
      connected_providers: perfConnections
        .filter((x) => normalizeProviderStatus(x?.status) === 'connected')
        .map((x) => String(x?.provider || '').toLowerCase()),
      last_sync_at: perfDash.lastSyncAt || perfConnections.find((x) => x?.lastSyncAt)?.lastSyncAt || null,
      metrics: {
        today_sales: Number(perfDash.todaySales || 0),
        week_sales: Number(perfDash.weekSales || 0),
        today_orders: Number(perfDash.todayOrders || 0),
        week_orders: Number(perfDash.weekOrders || 0),
        gross_margin_pct: Number(perfDash.grossMargin || 0),
        low_inventory_alerts: Number(perfDash.lowInventoryAlerts || 0),
        top_products: topProducts.slice(0, 6).map((x) => ({
          sku: String(x?.sku || ''),
          title: String(x?.title || x?.name || ''),
          sales: Number(x?.sales || x?.revenue || x?.revenueCents || 0)
        })),
        low_inventory_items: lowInventory.slice(0, 10).map((x) => ({
          sku: String(x?.sku || ''),
          title: String(x?.title || x?.name || ''),
          on_hand: Number(x?.onHand || x?.on_hand || 0),
          days_left: Number(x?.daysLeft || x?.days_until_stockout || 0)
        }))
      }
    };
    const payload = {
      messages: messagesPayload,
      session_id: SESSION_ID,
      user_id: String(USER_ID || ''),
      client_name: els.companyName?.textContent || 'Retailer',
      client_profile: {
        store_type: state.profile.store_type || '',
        location: state.profile.location || '',
        budget: Number(state.plan.budget || 0),
        target_audience: state.profile.priority || ''
      },
      cart_context: liveCartContext,
      attachment_summary: attachmentSummary,
      performance_context: perfContext
    };
    const r = await fetchWithJwtRetry(CHAT_API + '?stream=true', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });

    if (r.headers.get('content-type')?.includes('text/event-stream')) {
      // SSE streaming path
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      // Async generator that yields chunk objects
      async function* chunkIterator() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const rawLine of lines) {
            const trimmed = rawLine.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6).trim();
            if (data === '[DONE]' || data === '') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'stream_ready') continue;
              if (parsed.type === 'content' && parsed.content) {
                fullText += parsed.content;
                yield parsed; // yield the chunk object {type, content}
              }
              if (parsed.type === 'done' && parsed.content) {
                fullText = parsed.content;
              }
            } catch {}
          }
        }
      }

      return { ok: true, chunks: chunkIterator(), j: {}, getText: () => fullText };
    } else {
      // Non-streaming fallback (shouldn't happen often)
      const j = await r.json().catch(() => ({}));
      const text = j?.choices?.[0]?.message?.content?.trim() || '';
      return { ok: r.ok, status: r.status, j, text };
    }
  }

  try {
    liveCartContext = await getLiveCartContext();
    const hasCart = Array.isArray(liveCartContext?.items) ? liveCartContext.items.length > 0 : false;
    const focusLines = buildThinkingFocus(promptSeed, {
      hasCart,
      hasAttachments: !!attachmentSummary
    });
    addThinking(focusLines);
    let chatResult;
    let isStreaming = false;
    let streamedAssistantRendered = false;

    try {
      // Try streaming first
      const streamResult = await postChatStream(messages);
      if (streamResult.chunks) {
        // Streaming path: stream chunks to UI, then fetch full JSON for post-processing
        isStreaming = true;
        chatResult = { ok: true, j: {}, text: '' };
        const assistantCountBefore = Array.isArray(c?.messages)
          ? c.messages.filter((m) => m?.role === 'assistant' && String(m?.text || '').trim()).length
          : 0;
        removeThinking();
        await streamAssistantMessage(streamResult.chunks, 6);
        const assistantCountAfter = Array.isArray(c?.messages)
          ? c.messages.filter((m) => m?.role === 'assistant' && String(m?.text || '').trim()).length
          : 0;
        streamedAssistantRendered = assistantCountAfter > assistantCountBefore;
        chatResult.text = (typeof streamResult.getText === 'function' ? streamResult.getText() : '') || '';
        if (!chatResult.text) {
          const lastAssistant = Array.isArray(c?.messages)
            ? [...c.messages].reverse().find((m) => m?.role === 'assistant' && String(m?.text || '').trim())
            : null;
          if (lastAssistant?.text) chatResult.text = String(lastAssistant.text).trim();
        }
        // Get full JSON for cart_action / plan_sync via a lightweight follow-up.
        // If this follow-up fails, do not show a false "connection issue" after a successful streamed answer.
        try {
          const jResult = await postChat(messages);
          chatResult.j = jResult.j || {};
          if (!chatResult.text) chatResult.text = jResult.text || '';
        } catch (followErr) {
          console.warn('post-stream follow-up failed; keeping streamed response', followErr);
        }
        // Some backends emit only a final "done" payload with full content and no incremental chunks.
        // In that case, stream UI receives nothing; render the finalized text once here.
        if (!streamedAssistantRendered && chatResult.text) {
          await streamAssistantMessage(chatResult.text, 6);
          streamedAssistantRendered = true;
        }
      } else {
        chatResult = streamResult;
      }
    } catch (streamErr) {
      console.warn('Stream attempt failed, falling back to non-streaming', streamErr);
      chatResult = await postChat(messages);
    }

    if ((!chatResult.ok || !chatResult.text) && overrideText && overrideText.trim()) {
      const retryMessages = toBackendMessages(c);
      chatResult = await postChat(retryMessages);
    }
    removeThinking();
    if (!chatResult.ok || !chatResult.text) {
      const errCode = String(chatResult?.j?.error || '').trim().toLowerCase();
      if (chatResult?.ok === false && (Number(chatResult?.status || 0) === 402 || errCode.includes('quota') || errCode.includes('limit_reached'))) {
        if (chatResult?.j?.billing && typeof chatResult.j.billing === 'object') {
          state.billing = { ...(state.billing || {}), ...chatResult.j.billing };
          applyBillingUiGates();
          renderBillingUsageSummary();
        }
        const msg = formatBillingGateMessage(chatResult?.j, 'You hit your current plan limit. Upgrade to unlock more.');
        await streamAssistantMessage(msg, 6);
        showToast(msg, 'warn');
        return;
      }
      if (chatResult?.ok === false && errCode === 'feature_locked') {
        if (chatResult?.j?.billing && typeof chatResult.j.billing === 'object') {
          state.billing = { ...(state.billing || {}), ...chatResult.j.billing };
          applyBillingUiGates();
          renderBillingUsageSummary();
        }
        const planName = String(state.billing?.plan_code || state.billing?.account?.plan_code || 'current').toUpperCase();
        const msg = chatResult?.j?.message
          || `This action is not available on your ${planName} plan.`;
        await streamAssistantMessage(msg, 6);
        showToast('Feature locked by plan', 'warn');
        return;
      }
      // If we already streamed a visible answer, do not surface a second generic error bubble.
      if (!(isStreaming && chatResult?.text)) {
        throw new Error(chatResult?.j?.error || chatResult?.j?.message || 'chat_failed');
      }
    }

    if (!isStreaming) {
      await streamAssistantMessage(chatResult.text, 6);
    }

    if (chatResult?.j?.plan_sync?.retailer_plan_updated_at) {
      try {
        await syncPlanNow();
      } catch (e) {
        console.error('plan sync refresh failed', e);
      }
    }

            const cartAction = chatResult?.j?.cart_action || chatResult?.j?.response_schema?.cart_action || null;
    if (cartAction?.execute_now) {
      try {
        await applyChatCartAction(cartAction);
        await getLiveCartContext();
        renderPlan();

        if (cartAction.type === 'clear_cart') {
          showToast('Cart cleared', 'ok');
        } else if (cartAction.type === 'apply_plan_to_cart') {
          showToast('Plan added to cart', 'ok');
        }
      } catch (e) {
        console.error('applyChatCartAction failed', e);
        showToast('Could not update cart', 'err');
      }
    }

  } catch (err) {
    removeThinking();
    console.error('respond failed', err);
    await streamAssistantMessage('I hit a connection issue. Please try again in a moment.', 6);
    showToast('AI connection failed', 'err');
  }
}

async function ensureRetailerRole() {
  const email = String(CUSTOMER_EMAIL || '').trim().toLowerCase();
  const customerId = String(CUSTOMER_ID || '').trim();
  if (!email) {
    if (customerId) return { ok: false, reason: 'retailer_missing_email' };
    return { ok: false, reason: 'missing_email' };
  }

  const qsUserId = USER_ID_STR ? `&user_id=${encodeURIComponent(USER_ID_STR)}` : '';
  const r = await fetch(
    `${ACCESS_API}?view=role_resolve&scope=retailer&email=${encodeURIComponent(email)}${qsUserId}`,
    {
      method: 'GET',
      headers: authHeaders({ 'x-user-email': email })
    }
  );
  const j = await r.json().catch(() => ({}));

  if (j?.backend_jwt) {
  setBackendJwt(j.backend_jwt, j.backend_jwt_expires_at);
}

  if (!r.ok || !j.ok) {
    return { ok: false, reason: 'retailer_role_resolve_failed' };
  }

  if (j.can_access_retailer === false) {
    return { ok: false, reason: 'retailer_forbidden' };
  }
  return { ok: true, reason: 'retailer_verified' };
}

async function loadMfaSecurityStatus() {
  try {
    await ensureBackendJwt();
    const r = await fetch(MFA_SECURITY_STATUS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) return { ok: false, error: j?.error || 'mfa_security_status_failed' };
    return { ok: true, data: j };
  } catch (_) {
    return { ok: false, error: 'mfa_security_status_failed' };
  }
}

function normalizeAccountProfileData(raw = {}) {
  return {
    business_name: String(raw?.business_name || '').trim(),
    contact_email: String(raw?.contact_email || '').trim().toLowerCase(),
    sign_in_email: String(raw?.sign_in_email || CUSTOMER_EMAIL || '').trim().toLowerCase()
  };
}

async function loadAccountProfileStatus() {
  try {
    await ensureBackendJwt();
    const r = await fetch(ACCOUNT_PROFILE_STATUS_API, {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store'
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) return { ok: false, error: j?.error || 'account_profile_status_failed' };
    const data = normalizeAccountProfileData(j);
    state.accountProfile = data;
    return { ok: true, data };
  } catch (_) {
    return { ok: false, error: 'account_profile_status_failed' };
  }
}

async function saveAccountProfile(payload = {}) {
  await ensureBackendJwt();
  const r = await fetch(ACCOUNT_PROFILE_UPDATE_API, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload || {})
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(String(j?.error || 'account_profile_update_failed'));
  const data = normalizeAccountProfileData(j);
  state.accountProfile = data;
  return data;
}

async function saveMfaSecuritySettings(payload = {}) {
  await ensureBackendJwt();
  const r = await fetch(MFA_SECURITY_UPDATE_API, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload || {})
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(String(j?.message || j?.error || 'mfa_security_update_failed'));
  return j;
}

function createMfaGateModal() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:#e9eff7;z-index:2147483647;display:grid;place-items:center;padding:18px;';
  const card = document.createElement('div');
  card.style.cssText = 'width:min(420px,94vw);border:1px solid rgba(162,181,207,.6);background:linear-gradient(180deg,#f9fbff,#edf3fb);border-radius:16px;padding:18px;box-shadow:0 24px 60px rgba(28,44,70,.22);';
  card.innerHTML = `
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f7597;margin-bottom:8px;">Security verification</div>
    <h3 style="margin:0 0 8px;font-size:24px;line-height:1.15;color:#10233d;">Enter your sign-in code</h3>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#516989;">We emailed a 6-digit code to <b style="color:#10233d;">${esc(CUSTOMER_EMAIL || '')}</b>.</p>
    <input id="soMfaCodeInput" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000"
      style="width:100%;height:48px;border-radius:12px;border:1px solid rgba(162,181,207,.62);background:#ffffff;color:#10233d;padding:0 14px;font-size:22px;letter-spacing:.26em;text-align:center;outline:none;">
    <div id="soMfaErr" style="display:none;margin-top:10px;color:#FCA5A5;font-size:13px;"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button id="soMfaVerifyBtn" type="button" style="flex:1 1 160px;height:44px;border:0;border-radius:12px;background:#2ED3B7;color:#edf3fb;font-weight:760;cursor:pointer;">Verify code</button>
      <button id="soMfaResendBtn" type="button" style="flex:1 1 120px;height:44px;border:1px solid rgba(162,181,207,.62);border-radius:12px;background:#ffffff;color:#29486f;font-weight:650;cursor:pointer;">Resend</button>
      <a href="/account/logout" style="flex:1 1 100%;display:inline-flex;align-items:center;justify-content:center;height:40px;border-radius:10px;border:1px solid rgba(162,181,207,.5);color:#496588;text-decoration:none;background:#f8fbff;">Sign out</a>
    </div>
  `;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  return { overlay, card };
}

async function ensureMfaVerified() {
  let statusResp = await apiMfaStatus().catch(() => ({ ok: false, status: 0, j: {} }));
  mfaStatusUnavailable = false;
  if (statusResp.ok && statusResp.j?.required !== true) return true;
  if (statusResp.ok && statusResp.j?.verified === true) {
    return true;
  }
  if (statusResp.ok && statusResp.j?.requires_phone) {
    if (!statusResp.j?.phone_configured) {
      showToast('Add a phone in account settings to continue with verification.', 'warn');
      return false;
    }
    return await ensurePhoneStepUp('login', statusResp.j);
  }

  if (!statusResp.ok) {
    const err = String(statusResp?.j?.error || '');
    if (statusResp.status >= 500 || err === 'mfa_store_unavailable' || err === 'missing_mfa_secret') {
      console.warn('MFA check unavailable; fail-closed.', statusResp);
      mfaStatusUnavailable = true;
      showToast('Verification is temporarily unavailable. Please sign in again in a moment.', 'err');
      return false;
    }
  }

  const modal = createMfaGateModal();
  const input = modal.overlay.querySelector('#soMfaCodeInput');
  const verifyBtn = modal.overlay.querySelector('#soMfaVerifyBtn');
  const resendBtn = modal.overlay.querySelector('#soMfaResendBtn');
  const errEl = modal.overlay.querySelector('#soMfaErr');
  let resendTimer = null;
  let resendLeft = 0;
  const showErr = (txt) => {
    if (!errEl) return;
    errEl.textContent = String(txt || 'Verification failed.');
    errEl.style.display = 'block';
  };
  const clearErr = () => {
    if (!errEl) return;
    errEl.style.display = 'none';
    errEl.textContent = '';
  };
  const clearResendTimer = () => {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
    resendLeft = 0;
  };
  const startResendCooldown = (seconds = 0) => {
    clearResendTimer();
    const total = Math.max(0, Number(seconds) || 0);
    if (!resendBtn || total <= 0) {
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend';
      }
      return;
    }
    resendLeft = total;
    resendBtn.disabled = true;
    resendBtn.textContent = `Resend (${resendLeft}s)`;
    resendTimer = setInterval(() => {
      resendLeft -= 1;
      if (!resendBtn) {
        clearResendTimer();
        return;
      }
      if (resendLeft <= 0) {
        clearResendTimer();
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend';
        return;
      }
      resendBtn.textContent = `Resend (${resendLeft}s)`;
    }, 1000);
  };

  const startResp = await apiMfaStart().catch(() => ({ ok: false, status: 0, j: {} }));
  if (!startResp.ok && startResp.status === 429) {
    startResendCooldown(Number(startResp.j?.retry_after_sec || startResp.j?.resend_after_sec || 30));
  } else if (!startResp.ok && startResp.status >= 500) {
    showErr('Verification is temporarily unavailable. Refresh and try again.');
  } else {
    startResendCooldown(Number(startResp.j?.resend_after_sec || 0));
  }

  return await new Promise((resolve) => {
    const loginReturnUrl = '/pages/login?return_to=%2Fpages%2Fretailer';
    const onBackDuringMfa = () => {
      cleanup();
      try { window.location.replace(loginReturnUrl); } catch (_) {}
      resolve(false);
    };
    try {
      history.pushState({ ...(history.state || {}), so_mfa_gate: 1 }, '', location.href);
      window.addEventListener('popstate', onBackDuringMfa);
    } catch (_) {}

    const cleanup = () => {
      clearResendTimer();
      try { window.removeEventListener('popstate', onBackDuringMfa); } catch (_) {}
      modal.overlay.remove();
    };

    verifyBtn?.addEventListener('click', async () => {
      clearErr();
      const code = String(input?.value || '').replace(/\D/g, '');
      if (!/^\d{6}$/.test(code)) {
        showErr('Enter the 6-digit code.');
        return;
      }
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying...';
      const out = await apiMfaVerify(code).catch(() => ({ ok: false, status: 0, j: {} }));
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify code';
      if (!out.ok) {
        const msg = out.j?.error === 'code_expired'
          ? 'Code expired. Click resend.'
          : out.j?.error === 'too_many_attempts'
          ? 'Too many attempts. Click resend for a new code.'
          : out.j?.error === 'invalid_code'
          ? `Invalid code. ${Number(out.j?.remaining_attempts ?? 0)} attempts left.`
          : 'Could not verify code. Try again.';
        showErr(msg);
        return;
      }
      if (out.j?.token) setMfaToken(out.j.token);
      cleanup();
      resolve(true);
    });

    resendBtn?.addEventListener('click', async () => {
      if (resendLeft > 0) return;
      clearErr();
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending...';
      const out = await apiMfaResend().catch(() => ({ ok: false, status: 0, j: {} }));
      if (!out.ok) {
        if (out.status === 429) {
          startResendCooldown(Number(out.j?.retry_after_sec || out.j?.resend_after_sec || 30));
        } else {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend';
          showErr('Could not resend code. Try again.');
        }
        return;
      }
      startResendCooldown(Number(out.j?.resend_after_sec || 0));
      showToast('Verification code sent', 'ok');
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyBtn?.click();
      }
    });

    setTimeout(() => input?.focus(), 20);
  });
}

        async function onSend() {
          if (stream.active) return;
          const text = (els.input?.value || '').trim();
          if (!text) return;

          if (!currentChat()) await createChat(text);
const c = currentChat();
if (!c) return;
          if (c.messages.length === 0) c.title = deriveChatTitle(text);

          addMessage('user', text);
          if (els.input) {
            els.input.value = '';
            setDraft('');
            autoGrow();
          }

          updateProfileFromText(text);
          renderPlan();
          recomputeFlags(text);
          const otbHandled = await handleOpenToBuyUpdateFromChat(text);
          if (otbHandled?.handled) {
            if (otbHandled.ok) {
              const data = otbHandled.saved || {};
              addMessage(
                'assistant',
                `Updated Open-to-Buy.\n\nBudget: ${policyMoney(data.budget ?? 0)}\nCommitted: ${policyMoney(data.committed ?? 0)}\nAvailable: ${policyMoney(data.available ?? 0)}\n\nWant me to also update supplier constraints or workflow rules?`
              );
              renderPoliciesAutomation();
              showToast('Open-to-Buy updated', 'ok');
            } else {
              addMessage('assistant', 'I could not save your Open-to-Buy update right now. Want me to try again?');
              showToast('Open-to-Buy save failed', 'err');
            }
            updateSendState();
            return;
          }
          const tableWrap = root.querySelector('.soRc__tableWrap');
tableWrap?.classList.add('is-loading');
try {
          await refreshPlanFromBackend();
} catch {
  renderPlan();
} finally {
  tableWrap?.classList.remove('is-loading');
}
          await respond();
          updateSendState();
        }

        async function sendActionPrompt(userText, backendPrompt) {
          if (stream.active) return;
          const visibleText = String(userText || '').trim();
          const aiText = String(backendPrompt || '').trim();
          const composedText = visibleText || aiText;
          if (!composedText) return;

          if (!currentChat()) await createChat(visibleText || composedText);
          const c = currentChat();
          if (!c) return;
          if (c.messages.length === 0) c.title = deriveChatTitle(visibleText || composedText);

          addMessage('user', composedText);
          if (els.input) {
            els.input.value = '';
            setDraft('');
            autoGrow();
          }

          updateProfileFromText(composedText);
          renderPlan();
          recomputeFlags(composedText);

          const tableWrap = root.querySelector('.soRc__tableWrap');
          tableWrap?.classList.add('is-loading');
          try {
            await refreshPlanFromBackend();
          } catch {
            renderPlan();
          } finally {
            tableWrap?.classList.remove('is-loading');
          }

          await respond(aiText || composedText);
          updateSendState();
        }

        function ensureShopFilters() {
  if (!uiPrefs.shopFilters) {
    uiPrefs.shopFilters = { vendor: 'all', category: 'all', price: 'all', sort: 'relevance' };
  }
}

function renderShopFilterControls() {
  ensureShopFilters();
  const vendors = [...new Set(state.shop.map(x => x.vendor).filter(Boolean))].sort();
  const cats = [...new Set(state.shop.map(x => x.category).filter(Boolean))].sort();

  if (els.filterVendor) {
    els.filterVendor.innerHTML = `<option value="all">All vendors</option>` + vendors.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
    els.filterVendor.value = uiPrefs.shopFilters.vendor || 'all';
  }
  if (els.filterCategory) {
    els.filterCategory.innerHTML = `<option value="all">All categories</option>` + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
    els.filterCategory.value = uiPrefs.shopFilters.category || 'all';
  }
  if (els.filterPrice) els.filterPrice.value = uiPrefs.shopFilters.price || 'all';
  if (els.filterSort) els.filterSort.value = uiPrefs.shopFilters.sort || 'relevance';
}

        function renderShop(q = '') {
  ensureShopFilters();
  const query = (q || '').toLowerCase();

  let items = state.shop.filter(x => {
    const textMatch = !query ||
      x.name.toLowerCase().includes(query) ||
      (x.vendor || '').toLowerCase().includes(query) ||
      (x.category || '').toLowerCase().includes(query);

    const vendorMatch = uiPrefs.shopFilters.vendor === 'all' || x.vendor === uiPrefs.shopFilters.vendor;
    const categoryMatch = uiPrefs.shopFilters.category === 'all' || x.category === uiPrefs.shopFilters.category;

    let priceMatch = true;
    const p = Number(x.price || 0);
    if (uiPrefs.shopFilters.price === '0-25') priceMatch = p >= 0 && p < 25;
    if (uiPrefs.shopFilters.price === '25-75') priceMatch = p >= 25 && p < 75;
    if (uiPrefs.shopFilters.price === '75-150') priceMatch = p >= 75 && p < 150;
    if (uiPrefs.shopFilters.price === '150+') priceMatch = p >= 150;

    return textMatch && vendorMatch && categoryMatch && priceMatch;
  });

  if (uiPrefs.shopFilters.sort === 'price_asc') items.sort((a,b) => a.price - b.price);
  if (uiPrefs.shopFilters.sort === 'price_desc') items.sort((a,b) => b.price - a.price);
  if (uiPrefs.shopFilters.sort === 'name_asc') items.sort((a,b) => a.name.localeCompare(b.name));

  renderShopFilterControls();

  if (!els.shopGrid) return;

    if (!items.length) {
    els.shopGrid.innerHTML = `
      <div class="soRc__emptyShop">
        <div class="soRc__emptyShopIcon">🔎</div>
        <div class="soRc__emptyShopText">No products found.</div>
        <button class="soRc__skuBtn" type="button" data-clear-shop-search="1">Clear search</button>
      </div>
    `;
    return;
  }

  els.shopGrid.innerHTML = items.map(x => `
    <div class="soRc__skuCard">
      <div class="soRc__skuMedia">
        ${x.imageUrl
          ? `<img class="soRc__skuImg" src="${esc(x.imageUrl)}" alt="${esc(x.name)}" loading="lazy" />`
          : `<div class="soRc__skuImgFallback">No image</div>`
        }
      </div>
      <div class="soRc__skuTitle">${esc(x.name)}</div>
      <div class="soRc__skuMeta">
  <span class="soRc__skuVendor">${esc(x.vendor || '')}</span>
  <span class="soRc__skuPrice">${money(x.price)}</span>
</div>
      <div class="soRc__shopQtyRow">
  <div class="soRc__qty">
    <button class="soRc__qtyBtn" type="button" data-shop-qty-dec="${esc(x.id)}">−</button>
    <div class="soRc__qtyVal">${getShopQty(x.id)}</div>
    <button class="soRc__qtyBtn" type="button" data-shop-qty-inc="${esc(x.id)}">+</button>
  </div>
</div>
<div class="soRc__skuActions">
  <button class="soRc__skuBtn" type="button" data-add="${esc(x.id)}" title="Add to cart">Add to cart</button>
  <button class="soRc__skuBtn--ask" type="button" data-ask-ai="${esc(x.id)}" title="Ask AI about this product">Ask AI</button>
</div>
    </div>
  `).join('');
}

        /* Attach menu */
const attachMenu = document.createElement('div');
attachMenu.className = 'soRc__attachMenu';
attachMenu.innerHTML = `<button class="soRc__attachMenuBtn" type="button" ${ATTACHMENT_ANALYSIS_ENABLED ? '' : 'disabled'}>${ATTACHMENT_ANALYSIS_ENABLED ? 'Attach photos & files' : 'Attachments coming soon'}</button>`;
root.appendChild(attachMenu); // IMPORTANT: was document.body.appendChild(...)

function openAttachMenu() {
  if (!els.attachBtn) return;
  const rect = els.attachBtn.getBoundingClientRect();
  const menuW = 220;

  let left = Math.max(12, Math.min(rect.left, window.innerWidth - menuW - 12));
  let top = rect.top - 52;
  if (top < 12) top = rect.bottom + 8;

  attachMenu.style.left = `${left}px`;
  attachMenu.style.top = `${top}px`;
  attachMenu.classList.add('is-open');
}

function closeAttachMenu() {
  attachMenu.classList.remove('is-open');
}

els.attachBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (attachMenu.classList.contains('is-open')) closeAttachMenu();
  else openAttachMenu();
});

attachMenu.addEventListener('click', (e) => {
  if (!e.target.closest('.soRc__attachMenuBtn')) return;
  closeAttachMenu();
  if (!ATTACHMENT_ANALYSIS_ENABLED) {
    showToast('Attachments are temporarily disabled.', 'warn');
    return;
  }
  els.files?.click();
});

document.addEventListener('click', (e) => {
  if (!attachMenu.contains(e.target) && !e.target.closest('#soAttachBtn')) closeAttachMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAttachMenu();
    closeMenu();
    closePerfConnectionsMenu();
    closeSheet();
  }

  if (!els.recentList?.contains(document.activeElement)) return;
  if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;

  const items = [...els.recentList.querySelectorAll('.soRc__recentItem[data-chat]')];
  if (!items.length) return;
  e.preventDefault();

  const current = document.activeElement.closest('.soRc__recentItem[data-chat]');
  const idx = items.indexOf(current);
  if (idx < 0) return;

  const next = e.key === 'ArrowDown'
    ? items[Math.min(items.length - 1, idx + 1)]
    : items[Math.max(0, idx - 1)];

  next?.focus();
});

        const overlay = document.createElement('div');
        overlay.className = 'soRc__overlay';
        const sheet = document.createElement('aside');
        sheet.className = 'soRc__sheet';
        sheet.innerHTML = `
          <div class="soRc__sheetHdr">
            <div class="soRc__sheetTitle" id="soSheetTitle">Account</div>
            <button class="soRc__sheetClose" type="button">Close</button>
          </div>
          <div id="soSheetBody"></div>
        `;
        root.appendChild(overlay);
root.appendChild(sheet);

        function openSheet(title, html) {
          sheet.querySelector('#soSheetTitle').textContent = title;
          sheet.querySelector('#soSheetBody').innerHTML = html;
          overlay.classList.add('is-open');
          sheet.classList.add('is-open');
        }
        function closeSheet() {
          overlay.classList.remove('is-open');
          sheet.classList.remove('is-open');
        }

        let lastFocusEl = null;
function trapFocusInSheet(e) {
  if (!sheet.classList.contains('is-open') || e.key !== 'Tab') return;
  const f = [...sheet.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', trapFocusInSheet);

const _openSheet = openSheet;
openSheet = (title, html) => {
  lastFocusEl = document.activeElement;
  _openSheet(title, html);
  sheet.querySelector('button, input, select, textarea')?.focus();
};

const _closeSheet = closeSheet;
closeSheet = () => {
  _closeSheet();
  if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
};

        overlay.addEventListener('click', closeSheet);
        sheet.querySelector('.soRc__sheetClose').addEventListener('click', closeSheet);

function accountHtml() {
  const profile = state.accountProfile || {};
  const company = profile.business_name || CUSTOMER_COMPANY || 'Your Company';
  const signInEmail = profile.sign_in_email || CUSTOMER_EMAIL || '';
  const contactEmail = profile.contact_email || CUSTOMER_EMAIL || '';
  const region = CUSTOMER_REGION || 'Unknown';
  const cadence = safeGet(STORAGE.cadence, 'Bi-weekly');
  const planCode = String(state.billing?.plan_code || state.billing?.account?.plan_code || 'free').toLowerCase();
  const aiUsage = billingAiUsageSummary();

  return `
    <div class="soRc__field">
      <label>Business name</label>
      <input id="soAccountBusinessName" type="text" maxlength="120" value="${esc(company)}" placeholder="Your business name" />
    </div>
    <div class="soRc__field">
      <label>Contact email</label>
      <input id="soAccountContactEmail" type="email" maxlength="320" value="${esc(contactEmail)}" placeholder="name@business.com" />
    </div>
    <div class="soRc__field">
      <label style="display:flex;align-items:center;gap:8px;">
        <span>Sign-in email</span>
        <span style="position:relative;display:inline-flex;align-items:center;">
          <button
            id="soSignInEmailInfoBtn"
            type="button"
            aria-label="Sign-in email information"
            aria-expanded="false"
            style="width:18px;height:18px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--muted);font-size:12px;font-weight:700;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;"
          >i</button>
          <div
            id="soSignInEmailInfoCard"
            role="tooltip"
            style="display:none;position:absolute;top:26px;left:0;z-index:40;width:min(280px,72vw);padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#0f1b2d;color:#e8f0fb;font-size:12px;line-height:1.45;box-shadow:0 10px 26px rgba(0,0,0,.35);opacity:1;"
          >Sign-in email is managed by Shopify login. You can edit your contact email in this Account panel.</div>
        </span>
      </label>
      <div class="soRc__fieldValue">${esc(signInEmail)}</div>
    </div>
    <div class="soRc__field">
      <label>Region</label>
      <div class="soRc__fieldValue">${esc(region)}</div>
    </div>
    <div class="soRc__field">
      <label>Order cadence</label>
      <select id="soAccountCadence">
        <option ${cadence === 'Weekly' ? 'selected' : ''}>Weekly</option>
        <option ${cadence === 'Bi-weekly' ? 'selected' : ''}>Bi-weekly</option>
        <option ${cadence === 'Monthly' ? 'selected' : ''}>Monthly</option>
      </select>
    </div>
    <div class="soRc__field">
      <label>Plan</label>
      <div class="soRc__fieldValue">${esc(planCode.toUpperCase())} - AI decisions ${esc(aiUsage)}</div>
    </div>
    <div class="soRc__row" style="gap:8px;display:flex;flex-wrap:wrap;">
      <button class="soRc__eventCta" id="soSheetUpgradePlan" type="button">Upgrade</button>
      <button class="soRc__eventCta" id="soSheetManageBilling" type="button">Manage billing</button>
      <button class="soRc__eventCta" id="soSheetExportPerformance" type="button" data-feature-required="exports">Export performance CSV</button>
    </div>
    <div class="soRc__field">
      <label>Team members</label>
      <div id="soTeamMembersWrap" class="soRc__fieldValue">Loading...</div>
    </div>
    <div class="soRc__row" style="justify-content:flex-end;display:flex;gap:8px;margin-top:10px;">
      <button class="soRc__eventCta" id="soSheetSaveAccount" type="button">Save account</button>
    </div>
  `;
}

        function settingsHtml() {
          const mode = root.getAttribute('data-theme') === 'light' ? 'Light' : 'Dark';
          return `
            <div class="soRc__field"><label>Theme</label><select id="soSheetTheme"><option ${mode === 'Dark' ? 'selected' : ''}>Dark</option><option ${mode === 'Light' ? 'selected' : ''}>Light</option></select></div>
            <div class="soRc__field"><label>AI response speed</label><select><option>Fast</option><option selected>Balanced</option><option>Thorough</option></select></div>
            <div class="soRc__field"><label>Notifications</label><select><option selected>Enabled</option><option>Disabled</option></select></div>
            <div class="soRc__fieldValue" style="font-size:12px;color:var(--muted2);">Email verification is enabled for sign-in security.</div>
          `;
        }

els.accountBtn?.addEventListener('click', async () => {
  closeMenu();
  closeSidebarOnMobile();
  await loadAccountProfileStatus();
  openSheet('Account', accountHtml());
  applyBillingUiGates();
  await loadTeamMembers();
  renderTeamMembersSheet();

  const cadenceSel = document.getElementById('soAccountCadence');
  cadenceSel?.addEventListener('change', () => {
    safeSet(STORAGE.cadence, cadenceSel.value);
    showToast('Order cadence saved', 'ok');
  });

  document.getElementById('soSheetSaveAccount')?.addEventListener('click', async () => {
    const nameInput = document.getElementById('soAccountBusinessName');
    const emailInput = document.getElementById('soAccountContactEmail');
    const businessName = String(nameInput?.value || '').trim();
    const contactEmail = String(emailInput?.value || '').trim().toLowerCase();
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      showToast('Please enter a valid contact email.', 'warn');
      return;
    }
    try {
      await saveAccountProfile({
        business_name: businessName,
        contact_email: contactEmail
      });
      showToast('Account details saved', 'ok');
    } catch (err) {
      const code = String(err?.message || '');
      if (code === 'invalid_contact_email') {
        showToast('Please enter a valid contact email.', 'warn');
      } else {
        showToast('Could not save account details right now.', 'warn');
      }
    }
  });

  const infoBtn = document.getElementById('soSignInEmailInfoBtn');
  const infoCard = document.getElementById('soSignInEmailInfoCard');
  let infoHideTimer = null;
  const openInfo = () => {
    if (!infoCard || !infoBtn) return;
    if (infoHideTimer) {
      clearTimeout(infoHideTimer);
      infoHideTimer = null;
    }
    infoCard.style.display = 'block';
    infoBtn.setAttribute('aria-expanded', 'true');
  };
  const closeInfo = () => {
    if (!infoCard || !infoBtn) return;
    infoCard.style.display = 'none';
    infoBtn.setAttribute('aria-expanded', 'false');
  };
  if (infoBtn && infoCard) {
    const syncInfoTheme = () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      infoCard.style.background = isLight ? '#ffffff' : '#0f1b2d';
      infoCard.style.color = isLight ? '#0f223f' : '#e8f0fb';
      infoCard.style.borderColor = isLight ? 'rgba(145,161,184,.42)' : 'rgba(164,180,201,.32)';
    };
    syncInfoTheme();
    infoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (infoCard.style.display === 'block') closeInfo();
      else openInfo();
    });
    infoBtn.addEventListener('mouseenter', openInfo);
    infoBtn.addEventListener('mouseleave', () => {
      infoHideTimer = setTimeout(closeInfo, 120);
    });
    infoCard.addEventListener('mouseenter', openInfo);
    infoCard.addEventListener('mouseleave', () => {
      infoHideTimer = setTimeout(closeInfo, 120);
    });
    infoBtn.addEventListener('blur', () => {
      infoHideTimer = setTimeout(closeInfo, 120);
    });
    document.addEventListener('click', (e) => {
      if (!infoCard.contains(e.target) && !infoBtn.contains(e.target)) closeInfo();
    }, { once: true });
  }

  document.getElementById('soSheetUpgradePlan')?.addEventListener('click', () => {
    closeSheet();
    void openPricingWithStepUp();
  });

  document.getElementById('soSheetManageBilling')?.addEventListener('click', async () => {
    closeSheet();
    await openBillingPortal();
  });
  document.getElementById('soSheetExportPerformance')?.addEventListener('click', async () => {
    await downloadPerformanceExport();
  });
});

els.billingBtn?.addEventListener('click', async () => {
  closeMenu();
  closeSidebarOnMobile();
  setActiveTab('plan');
});

        els.settingsBtn?.addEventListener('click', () => {
  closeMenu();
  closeSidebarOnMobile();
  openSheet('Settings', settingsHtml());
  const sel = document.getElementById('soSheetTheme');
  sel?.addEventListener('change', () => {
    const next = sel.value.toLowerCase() === 'light' ? 'light' : 'dark';
    persistThemePreference(next);
    showToast('Settings saved', 'ok');
    applyTheme(next);
  });
});

root.querySelector('a[href="/account/logout"]')?.addEventListener('click', closeSidebarOnMobile);


        function autoGrow() {
          if (!els.input) return;
          els.input.style.height = 'auto';
          els.input.style.height = `${Math.min(150, els.input.scrollHeight)}px`;
        }

        els.input?.addEventListener('input', () => {
  if (els.input.value.length > MAX_CHARS) {
    els.input.value = els.input.value.slice(0, MAX_CHARS);
  }
  autoGrow();
  setDraft(els.input.value);
  updateSendState();
});

        els.send?.addEventListener('click', onSend);
        els.billingUpgradeBtn?.addEventListener('click', async () => {
  await openPricingWithStepUp();
});
        els.billingManageBtn?.addEventListener('click', async () => {
  await openBillingPortal();
});
        els.exportPerformanceBtn?.addEventListener('click', async () => {
  await downloadPerformanceExport();
});
        els.exportDecisionsBtn?.addEventListener('click', async () => {
  await downloadDecisionsExport();
});
        els.reportWeeklyBtn?.addEventListener('click', async () => {
  await downloadSavedReport('weekly_summary');
});
        els.reportMonthlyBtn?.addEventListener('click', async () => {
  await downloadSavedReport('monthly_summary');
});
        els.reportOpportunitiesBtn?.addEventListener('click', async () => {
  await downloadSavedReport('top_opportunities');
});
        els.proceedBtn?.addEventListener('click', () => {
  window.location.href = '/checkout';
});
        els.input?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        });

        root.addEventListener('input', (e) => {
          const el = e.target;
          if (!(el instanceof HTMLElement)) return;
          if (el.matches('#soOpenToBuyBudget, #soOpenToBuyCommitted')) {
            syncOpenToBuyAvailableFromInputs();
          }
        });

        els.chat?.addEventListener('scroll', () => {
  autoFollow = isNearBottom();
  updateJumpButton();
});

jumpBtn.addEventListener('click', () => {
  els.chat?.scrollTo({ top: els.chat.scrollHeight, behavior: 'smooth' });
});

els.files?.addEventListener('change', async () => {
  try {
    if (!ATTACHMENT_ANALYSIS_ENABLED) {
      showToast('Attachments are temporarily disabled.', 'warn');
      if (els.files) els.files.value = '';
      return;
    }
    const files = [...(els.files.files || [])];
    if (!files.length) return;

    if (!currentChat()) await createChat('File upload');
    const c = currentChat();
    const names = files.map((f) => f.name).join(', ');
    if (c) c.attachmentSummary = `Attached files: ${names}`;

    addMessage('user', `Attached: ${names}`);

    const summaries = [];
    for (const file of files) {
      try {
        const analyzed = await analyzeAttachmentFile(file);
        const summaryText =
          String(analyzed?.summary || analyzed?.analysis || analyzed?.result || "").trim() ||
          `Processed ${file.name}`;
        summaries.push(`${file.name}: ${summaryText}`);
      } catch (err) {
        summaries.push(`${file.name}: Could not analyze this file.`);
      }
    }

    const combined = summaries.join('\n\n');
    if (combined) {
      addMessage('assistant', combined);
      await respond(`Use these attachment findings in planning:\n\n${combined}`);
    }

    showToast('Files analyzed', 'ok');
    els.files.value = '';
  } catch {
    showToast('Could not attach files', 'err');
  }
});

els.mobileMenuBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  root.classList.add('is-sidebar-open');
});

// Keep MFA phone enrollment helpers at top scope (used during boot auth gate).
function createPhoneStepUpModal(maskedPhone = '', opts = {}) {
  const needsPhoneInput = !!opts.needsPhoneInput;
  const defaultPhone = String(opts.defaultPhone || '');
  const trustDefaultChecked = opts.trustDefaultChecked !== false;
  const title = String(opts.title || 'Enter phone verification code');
  const subtitle = String(opts.subtitle || `We sent a 6-digit code to ${maskedPhone || 'your phone'}.`);
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,17,.62);z-index:1500;display:grid;place-items:center;padding:18px;';
  const card = document.createElement('div');
  card.style.cssText = 'width:min(420px,94vw);border:1px solid rgba(46,211,183,.28);background:linear-gradient(180deg,rgba(10,20,35,.98),rgba(12,26,44,.98));border-radius:16px;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.45);';
  card.innerHTML = `
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8ea2bd;margin-bottom:8px;">Step-up verification</div>
    <h3 style="margin:0 0 8px;font-size:24px;line-height:1.15;color:#F4F7FB;">${esc(title)}</h3>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#A9B8CE;">${esc(subtitle)}</p>
    <div id="soPhoneStepStagePhone" ${needsPhoneInput ? '' : 'style="display:none;"'}>
      <input id="soPhoneStepPhoneInput" inputmode="tel" maxlength="20" placeholder="Enter phone number" value="${esc(defaultPhone)}"
        style="width:100%;height:46px;border-radius:12px;border:1px solid rgba(164,180,201,.42);background:rgba(10,20,35,.55);color:#fff;padding:0 14px;font-size:15px;outline:none;">
    </div>
    <div id="soPhoneStepStageCode" ${needsPhoneInput ? 'style="display:none;"' : ''}>
      <input id="soPhoneStepCodeInput" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000"
        style="width:100%;height:48px;border-radius:12px;border:1px solid rgba(164,180,201,.42);background:rgba(10,20,35,.55);color:#fff;padding:0 14px;font-size:22px;letter-spacing:.26em;text-align:center;outline:none;">
    </div>
    <label style="display:flex;align-items:center;gap:8px;margin-top:10px;color:#A9B8CE;font-size:13px;">
      <input id="soPhoneStepTrustDevice" type="checkbox" ${trustDefaultChecked ? 'checked' : ''} style="accent-color:#2ED3B7;">
      Trust this device for phone verification
    </label>
    <div id="soPhoneStepErr" style="display:none;margin-top:10px;color:#FCA5A5;font-size:13px;"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button id="soPhoneStepVerifyBtn" type="button" style="flex:1 1 160px;height:44px;border:0;border-radius:12px;background:#2ED3B7;color:#063B35;font-weight:760;cursor:pointer;">${needsPhoneInput ? 'Send code' : 'Verify code'}</button>
      <button id="soPhoneStepResendBtn" type="button" style="flex:1 1 120px;height:44px;border:1px solid rgba(164,180,201,.42);border-radius:12px;background:rgba(13,25,44,.7);color:#d5e2f3;font-weight:650;cursor:pointer;">Resend</button>
      <button id="soPhoneStepCancelBtn" type="button" style="flex:1 1 100%;height:40px;border-radius:10px;border:1px solid rgba(164,180,201,.28);background:transparent;color:#A9B8CE;cursor:pointer;">Cancel</button>
    </div>
  `;
  overlay.appendChild(card);
  root.appendChild(overlay);
  return { overlay, card };
}

function mfaUiErrorMessage(err, fallback = 'Verification failed. Please try again.') {
  const code = String(err || '').trim().toLowerCase();
  if (!code) return fallback;
  if (code === 'log_failed' || code === 'mfa_store_unavailable' || code === 'missing_mfa_secret') {
    return 'Verification is temporarily unavailable. Please try again.';
  }
  if (code === 'mfa_email_send_failed') return 'Could not send verification code right now. Please try again.';
  if (code === 'mfa_challenge_create_failed') return 'Could not start verification right now. Please try again.';
  if (code === 'missing_phone_for_mfa') return 'Enter a valid phone number to continue.';
  if (code === 'mfa_code_invalid' || code === 'invalid_code') return 'The code is invalid. Please try again.';
  if (code === 'mfa_code_expired') return 'The code expired. Please resend and try again.';
  if (code === 'mfa_code_attempts_exceeded') return 'Too many incorrect attempts. Please resend a new code.';
  if (code === 'jwt_required' || code === 'unauthorized') return 'Your session expired. Please sign in again.';
  return fallback;
}

async function ensurePhoneStepUp(reason = 'billing_plan_change', statusData = null, opts = {}) {
  const masked = String(statusData?.phone_masked || '');
  const needsPhoneInput = !!opts.needsPhoneInput || !statusData?.phone_configured;
  const modal = createPhoneStepUpModal(masked, {
    ...opts,
    needsPhoneInput,
    defaultPhone: String(statusData?.phone_e164 || '')
  });
  const phoneInput = modal.overlay.querySelector('#soPhoneStepPhoneInput');
  const stagePhone = modal.overlay.querySelector('#soPhoneStepStagePhone');
  const stageCode = modal.overlay.querySelector('#soPhoneStepStageCode');
  const input = modal.overlay.querySelector('#soPhoneStepCodeInput');
  const verifyBtn = modal.overlay.querySelector('#soPhoneStepVerifyBtn');
  const resendBtn = modal.overlay.querySelector('#soPhoneStepResendBtn');
  const trustDeviceInput = modal.overlay.querySelector('#soPhoneStepTrustDevice');
  const cancelBtn = modal.overlay.querySelector('#soPhoneStepCancelBtn');
  const errEl = modal.overlay.querySelector('#soPhoneStepErr');
  const showErr = (txt) => {
    if (!errEl) return;
    errEl.textContent = String(txt || 'Verification failed.');
    errEl.style.display = 'block';
  };
  const clearErr = () => {
    if (!errEl) return;
    errEl.style.display = 'none';
    errEl.textContent = '';
  };
  let resendTimer = null;
  const clearResendTimer = () => {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  };
  const setResendCooldown = (seconds) => {
    const total = Math.max(0, Number(seconds || 0));
    if (!resendBtn || total <= 0) {
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend';
      }
      return;
    }
    clearResendTimer();
    let left = total;
    resendBtn.disabled = true;
    resendBtn.textContent = `Resend (${left}s)`;
    resendTimer = setInterval(() => {
      left -= 1;
      if (!resendBtn) {
        clearResendTimer();
        return;
      }
      if (left <= 0) {
        clearResendTimer();
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend';
        return;
      }
      resendBtn.textContent = `Resend (${left}s)`;
    }, 1000);
  };

  const maybeSavePhone = async () => {
    if (!needsPhoneInput) return true;
    if (!phoneInput) return true;
    const phone = String(phoneInput.value || '').trim();
    if (!phone) {
      showErr('Enter your phone number in international format.');
      return false;
    }
    try {
      await saveMfaSecuritySettings({ phone_e164: phone });
      return true;
    } catch (err) {
      showErr(mfaUiErrorMessage(err?.message, 'Could not save phone number.'));
      return false;
    }
  };

  const startCode = async () => apiMfaStart({ reason, channel: 'sms' }).catch(() => ({ ok: false, status: 0, j: {} }));
  let codeSent = false;
  if (!needsPhoneInput) {
    if (!(await maybeSavePhone())) return false;
    const startResp = await startCode();
    if (!startResp.ok) {
      showErr(startResp.status === 429
        ? `Please wait ${Number(startResp.j?.retry_after_sec || 30)}s, then retry.`
        : mfaUiErrorMessage(startResp.j?.error, 'Could not send phone code.'));
    } else {
      codeSent = true;
      setResendCooldown(Number(startResp.j?.resend_after_sec || 0));
    }
  }

  return await new Promise((resolve) => {
    const close = (ok) => {
      clearResendTimer();
      modal.overlay.remove();
      resolve(!!ok);
    };
    cancelBtn?.addEventListener('click', () => close(false));
    verifyBtn?.addEventListener('click', async () => {
      clearErr();
      if (needsPhoneInput && !codeSent) {
        if (!(await maybeSavePhone())) return;
        const startOut = await startCode();
        if (!startOut.ok) {
          if (startOut.status === 429) {
            const wait = Number(startOut.j?.retry_after_sec || 30);
            setResendCooldown(wait);
            showErr(`Please wait ${wait}s, then retry.`);
          } else {
            showErr(mfaUiErrorMessage(startOut.j?.error, 'Could not send phone code.'));
          }
          return;
        }
        codeSent = true;
        if (stagePhone) stagePhone.style.display = 'none';
        if (stageCode) stageCode.style.display = '';
        verifyBtn.textContent = 'Submit code';
        resendBtn.disabled = false;
        setResendCooldown(Number(startOut.j?.resend_after_sec || 0));
        showToast('Phone verification code sent', 'ok');
        setTimeout(() => input?.focus(), 20);
        return;
      }
      if (!codeSent) {
        const startOut = await startCode();
        if (!startOut.ok) {
          if (startOut.status === 429) {
            const wait = Number(startOut.j?.retry_after_sec || 30);
            setResendCooldown(wait);
            showErr(`Please wait ${wait}s, then retry.`);
          } else {
            showErr(mfaUiErrorMessage(startOut.j?.error, 'Could not send phone code.'));
          }
          return;
        }
        codeSent = true;
        setResendCooldown(Number(startOut.j?.resend_after_sec || 0));
      }
      const code = String(input?.value || '').replace(/\D/g, '');
      if (!/^\d{6}$/.test(code)) return showErr('Enter the 6-digit code.');
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verifying...';
      const out = await apiMfaVerify(code, { reason, channel: 'sms' }).catch(() => ({ ok: false, status: 0, j: {} }));
      verifyBtn.disabled = false;
      verifyBtn.textContent = needsPhoneInput ? 'Submit code' : 'Verify code';
      if (!out.ok) return showErr(mfaUiErrorMessage(out.j?.error, 'Could not verify phone code.'));
      if (out.j?.token) setMfaToken(out.j.token);
      if (trustDeviceInput?.checked) setTrustedDevice(24 * 30);
      else clearTrustedDevice();
      close(true);
    });
    resendBtn?.addEventListener('click', async () => {
      clearErr();
      if (!(await maybeSavePhone())) return;
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending...';
      const out = await apiMfaResend({ reason, channel: 'sms' }).catch(() => ({ ok: false, status: 0, j: {} }));
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend';
      if (!out.ok) {
        if (out.status === 429) {
          const wait = Number(out.j?.retry_after_sec || 30);
          setResendCooldown(wait);
          showErr(`Please wait ${wait}s before resend.`);
        } else {
          showErr(mfaUiErrorMessage(out.j?.error, 'Could not resend code.'));
        }
        return;
      }
      codeSent = true;
      setResendCooldown(Number(out.j?.resend_after_sec || 0));
      if (needsPhoneInput && stagePhone && stageCode) {
        stagePhone.style.display = 'none';
        stageCode.style.display = '';
        verifyBtn.textContent = 'Submit code';
      }
      showToast('Phone verification code sent', 'ok');
      setTimeout(() => input?.focus(), 20);
    });
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyBtn?.click();
      }
    });
    setTimeout(() => input?.focus(), 20);
  });
}

async function ensureStepUpFor(reason = 'billing_plan_change') {
  const out = await apiMfaStatus({ reason }).catch(() => ({ ok: false, status: 0, j: {} }));
  if (!out.ok) return false;
  if (out.j?.verified === true) return true;
  if (out.j?.requires_phone) {
    if (!out.j?.phone_configured) {
      showToast('Add a phone in account settings to use step-up verification.', 'warn');
      return false;
    }
    return await ensurePhoneStepUp(reason, out.j);
  }
  return await ensureMfaVerified();
}

async function ensurePhoneEnrollmentPostLogin() {
  if (mfaStatusUnavailable) return true;
  const status = await loadMfaSecurityStatus();
  if (!status?.ok || !status.data) {
    return await ensurePhoneStepUp('new_device', {
      phone_configured: false,
      phone_e164: '',
      phone_masked: ''
    }, {
      needsPhoneInput: true,
      title: 'Add and verify phone number',
      subtitle: 'Add your phone number, then enter the SMS code to secure your account.'
    });
  }

  const trusted = isTrustedDeviceActive();
  if (trusted && status.data.phone_verified_once) return true;
  if (status.data.phone_verified_once) return true;

  return await ensurePhoneStepUp('new_device', {
    phone_configured: !!status.data.phone_e164,
    phone_e164: status.data.phone_e164 || '',
    phone_masked: status.data.phone_masked || ''
  }, {
    needsPhoneInput: !status.data.phone_e164,
    title: status.data.phone_e164 ? 'Verify your phone number' : 'Add and verify phone number',
    subtitle: status.data.phone_e164
      ? `Confirm phone access for ${status.data.phone_masked || 'your number'} to secure your account.`
      : 'Add your phone number, then enter the SMS code to secure your account.'
  });
}

               root.addEventListener('click', async (e) => {
                const upgradeRequired = e.target.closest('[data-upgrade-required="1"]');
if (upgradeRequired) {
  e.preventDefault();
  e.stopPropagation();
  await openPricingWithStepUp();
  return;
}
                const openTab = e.target.closest('[data-open-tab]');
if (openTab) {
  e.preventDefault();
  const target = String(openTab.getAttribute('data-open-tab') || '').trim().toLowerCase();
  if (!target) return;
  setActiveTab(target);
  closeSidebarOnMobile();
  return;
}
                const policyAction = e.target.closest('[data-policy-action]');
if (policyAction) {
  e.preventDefault();
  const action = String(policyAction.getAttribute('data-policy-action') || '').trim().toLowerCase();
  const key = String(policyAction.getAttribute('data-policy-key') || '').trim();
  if (!key || !POLICY_API_CONFIG[key]) return;
  if (action === 'reload') {
    await loadPolicyFeature(key, { silent: false });
    return;
  }
  if (action === 'save') {
    await savePolicyFeature(key);
    return;
  }
}
                const quickPrompt = e.target.closest('[data-quick-prompt]');
if (quickPrompt) {
  const prompt = String(quickPrompt.getAttribute('data-quick-prompt') || '').trim();
  if (!prompt) return;
  if (els.input) {
    els.input.value = prompt;
    autoGrow();
  }
  await onSend();
  return;
}

                const smartAction = e.target.closest('[data-smart-action]');
if (smartAction) {
  const action = String(smartAction.getAttribute('data-smart-action') || '').trim().toLowerCase();
  const target = String(smartAction.getAttribute('data-smart-target') || '').trim();
  const context = String(smartAction.getAttribute('data-smart-context') || '').trim();
  let payload = null;
  try {
    const rawPayload = String(smartAction.getAttribute('data-smart-payload') || '').trim();
    if (rawPayload) payload = JSON.parse(decodeURIComponent(rawPayload));
  } catch (_) {
    payload = null;
  }
  if (action === 'connect_store') {
    setActiveTab('performance');
    await startPerformanceConnect(target || 'shopify');
    return;
  }
  const promptMap = {
    reorder: `Run a reorder recommendation for ${target}. Explain timing, quantity guidance, and risk tradeoffs.`,
    replace: `Run a replacement recommendation for ${target}. Suggest a stronger alternative and expected margin impact.`,
    remove: `Evaluate whether ${target} should be removed. Include reasoning and risk.`,
    promote: `Evaluate whether ${target} should be promoted now. Include expected upside and constraints.`,
    watch: `Analyze ${target} and define what to monitor plus the next decision trigger.`
  };
  const prompt = promptMap[action] || `Analyze ${target} and recommend the next product decision.`;
  const payloadLines = [];
  if (payload && typeof payload === 'object') {
    Object.entries(payload).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') return;
      payloadLines.push(`${String(k).replace(/_/g, ' ')}: ${v}`);
    });
  }
  const finalPrompt = [
    prompt,
    context ? `Context: ${context}.` : '',
    payloadLines.length ? `Data: ${payloadLines.join('; ')}.` : ''
  ].filter(Boolean).join('\n');
  const visibleMap = {
    reorder: `Review reorder for ${target}`,
    replace: `Review replacement for ${target}`,
    remove: `Review removal risk for ${target}`,
    promote: `Review promotion for ${target}`,
    watch: `Analyze ${target}`
  };
  const visibleText = visibleMap[action] || `Analyze ${target}`;
  setActiveTab('chat');
  await sendActionPrompt(visibleText, finalPrompt);
  return;
}

                const perfAiAction = e.target.closest('[data-perf-ai-action]');
if (perfAiAction) {
  const action = String(perfAiAction.getAttribute('data-perf-ai-action') || '').trim();
  const promptMap = {
    review_recommendation: 'Review the latest performance recommendation and explain expected impact.',
    apply_suggestion: 'Apply the latest recommendation to my plan and summarize the changes.',
    ask_why: 'Why is this recommendation the top priority right now?'
  };
  const prompt = promptMap[action];
  if (!prompt) return;
  setActiveTab('chat');
  if (els.input) {
    els.input.value = prompt;
    autoGrow();
  }
  await onSend();
  return;
}

                const perfExport = e.target.closest('[data-export-performance]');
if (perfExport) {
  await downloadPerformanceExport();
  return;
}

                const perfConnect = e.target.closest('[data-perf-connect]');
if (perfConnect) {
  const provider = perfConnect.getAttribute('data-perf-connect');
  if (!['shopify', 'square', 'clover', 'lightspeed', 'moneris'].includes(provider)) {
    showToast('Provider coming soon', 'warn');
    return;
  }
  await startPerformanceConnect(provider);
  return;
}

                const perfProviderAction = e.target.closest('[data-perf-provider-action]');
if (perfProviderAction) {
  const action = perfProviderAction.getAttribute('data-perf-provider-action');
  const provider = perfProviderAction.getAttribute('data-perf-provider');
  if (!action || !provider) return;

  if (action === 'sync_full') {
    await runPerformanceSync('FULL_SYNC');
    return;
  }
  if (action === 'disconnect' || action === 'set_primary') {
    await runPerformanceConnectionAction(provider, action);
    return;
  }
}

                const perfAction = e.target.closest('[data-perf-action]');
if (perfAction) {
  const action = perfAction.getAttribute('data-perf-action');
  if (action === 'sync_full') await runPerformanceSync('FULL_SYNC');
  if (action === 'sync_orders') await runPerformanceSync('ORDERS_INCREMENTAL');
  if (action === 'sync_products') await runPerformanceSync('PRODUCTS_INCREMENTAL');
  if (action === 'sync_inventory') await runPerformanceSync('INVENTORY_INCREMENTAL');
  return;
}

          const clearShop = e.target.closest('[data-clear-shop-search]');
if (clearShop) {
  if (els.shopSearch) els.shopSearch.value = '';
  uiPrefs.shopQuery = '';
  saveState();
  try {
    await loadShopCatalog('');
    renderShop('');
  } catch {
    showToast('Could not load catalog', 'err');
  }
  return;
}

const viewPlan = e.target.closest('[data-view-plan]');
if (viewPlan) {
  setActiveTab('plan');
  showToast('Opened Plan tab', 'ok');
  return;
}

const openDelModal = e.target.closest('[data-open-del-modal]');
if (openDelModal) {
  e.stopImmediatePropagation();
  const id = openDelModal.getAttribute('data-open-del-modal');
  pendingDeleteChatId = null;
  modalDeleteChatId = id;
  renderRecent();
  renderDeleteModal();
  return;
}

function createPhoneStepUpModal(maskedPhone = '', opts = {}) {
  const needsPhoneInput = !!opts.needsPhoneInput;
  const defaultPhone = String(opts.defaultPhone || '');
  const trustDefaultChecked = opts.trustDefaultChecked !== false;
  const title = String(opts.title || 'Enter phone verification code');
  const subtitle = String(opts.subtitle || `We sent a 6-digit code to ${maskedPhone || 'your phone'}.`);
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,17,.62);z-index:1500;display:grid;place-items:center;padding:18px;';
  const card = document.createElement('div');
  card.style.cssText = 'width:min(420px,94vw);border:1px solid rgba(46,211,183,.28);background:linear-gradient(180deg,rgba(10,20,35,.98),rgba(12,26,44,.98));border-radius:16px;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.45);';
  card.innerHTML = `
    <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8ea2bd;margin-bottom:8px;">Step-up verification</div>
    <h3 style="margin:0 0 8px;font-size:24px;line-height:1.15;color:#F4F7FB;">${esc(title)}</h3>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#A9B8CE;">${esc(subtitle)}</p>
    ${needsPhoneInput ? `
      <input id="soPhoneStepPhoneInput" inputmode="tel" maxlength="20" placeholder="Enter phone number" value="${esc(defaultPhone)}"
        style="width:100%;height:46px;border-radius:12px;border:1px solid rgba(164,180,201,.42);background:rgba(10,20,35,.55);color:#fff;padding:0 14px;font-size:15px;outline:none;margin-bottom:10px;">
    ` : ''}
    <input id="soPhoneStepCodeInput" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="000000"
      style="width:100%;height:48px;border-radius:12px;border:1px solid rgba(164,180,201,.42);background:rgba(10,20,35,.55);color:#fff;padding:0 14px;font-size:22px;letter-spacing:.26em;text-align:center;outline:none;">
    <label style="display:flex;align-items:center;gap:8px;margin-top:10px;color:#A9B8CE;font-size:13px;">
      <input id="soPhoneStepTrustDevice" type="checkbox" ${trustDefaultChecked ? 'checked' : ''} style="accent-color:#2ED3B7;">
      Trust this device for phone verification
    </label>
    <div id="soPhoneStepErr" style="display:none;margin-top:10px;color:#FCA5A5;font-size:13px;"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button id="soPhoneStepVerifyBtn" type="button" style="flex:1 1 160px;height:44px;border:0;border-radius:12px;background:#2ED3B7;color:#063B35;font-weight:760;cursor:pointer;">Verify code</button>
      <button id="soPhoneStepResendBtn" type="button" style="flex:1 1 120px;height:44px;border:1px solid rgba(164,180,201,.42);border-radius:12px;background:rgba(13,25,44,.7);color:#d5e2f3;font-weight:650;cursor:pointer;">Resend</button>
      <button id="soPhoneStepCancelBtn" type="button" style="flex:1 1 100%;height:40px;border-radius:10px;border:1px solid rgba(164,180,201,.28);background:transparent;color:#A9B8CE;cursor:pointer;">Cancel</button>
    </div>
  `;
  overlay.appendChild(card);
  root.appendChild(overlay);
  return { overlay, card };
}

const confirmDelModal = e.target.closest('[data-confirm-del-modal]');
if (confirmDelModal) {
  e.stopImmediatePropagation();
  const id = confirmDelModal.getAttribute('data-confirm-del-modal');
  pendingDeleteChatId = null;
  modalDeleteChatId = null;
  await deleteChat(id);
  renderDeleteModal();
  return;
}

const cancelDel = e.target.closest('[data-cancel-del]');
if (cancelDel) {
  e.stopImmediatePropagation();
  pendingDeleteChatId = null;
  renderRecent();
  return;
}

const closeDelModal = e.target.closest('[data-close-del-modal]');
if (closeDelModal) {
  e.stopImmediatePropagation();
  modalDeleteChatId = null;
  renderDeleteModal();
  return;
}

          const row = e.target.closest('[data-chat]');
if (row && !e.target.closest('[data-del-chat]') && !e.target.closest('.soRc__confirmCard')) {
  state.activeChatId = row.getAttribute('data-chat');
  saveState();
  try {
    await hydrateActiveChatMessages();
  } catch {
    showToast('Could not load chat messages', 'warn');
  }
  renderRecent();
  renderChat();
  setActiveTab('chat');
  closeSidebarOnMobile();
  return;
}

const del = e.target.closest('[data-del-chat]');
if (del) {
  e.stopImmediatePropagation();
  const id = del.getAttribute('data-del-chat');
  // Inline confirm card (desktop + mobile)
  modalDeleteChatId = null;
  pendingDeleteChatId = pendingDeleteChatId === id ? null : id;
  renderRecent();
  renderDeleteModal();
  return;
}

const sInc = e.target.closest('[data-shop-qty-inc]');
if (sInc) {
  const id = sInc.getAttribute('data-shop-qty-inc');
  setShopQty(id, getShopQty(id) + 1);
  renderShop(uiPrefs.shopQuery || '');
  return;
}

const sDec = e.target.closest('[data-shop-qty-dec]');
if (sDec) {
  const id = sDec.getAttribute('data-shop-qty-dec');
  setShopQty(id, Math.max(1, getShopQty(id) - 1));
  renderShop(uiPrefs.shopQuery || '');
  return;
}

                    const add = e.target.closest('[data-add]');
if (add) {
  const id = add.getAttribute('data-add');
  const item = state.shop.find(x => x.id === id);
  if (!item) return;

  const qtyToAdd = getShopQty(id);

  try {
    await addSingleVariantToShopifyCart(item.id, qtyToAdd);
    await getLiveCartContext();
    renderPlan();
    showToast('Added to cart', 'ok');
  } catch {
    showToast('Could not add to cart', 'err');
  }
  return;
}

          const ask = e.target.closest('[data-ask-ai]');
          if (ask) {
            const id = ask.getAttribute('data-ask-ai');
            const item = state.shop.find(x => x.id === id);
            if (!item) return;
            if (!currentChat()) await createChat(`Ask AI ${item.name}`);
            setActiveTab('chat');
            addMessage('user', `Should I add "${item.name}" for my current profile and budget?`);
            await respond();
            renderChat();
            return;
          }

          const inc = e.target.closest('[data-qty-inc]');
if (inc) {
  const i = Number(inc.getAttribute('data-qty-inc'));
  const liveItems = Array.isArray(state.liveCart?.items) ? state.liveCart.items : [];
  const liveLine = liveItems[i];
  if (!liveLine?.key) return;

  try {
    await changeShopifyCartLine(liveLine.key, Number(liveLine.quantity || 0) + 1);
    await getLiveCartContext();
    renderPlan();
    showToast('Cart updated', 'ok');
  } catch {
    showToast('Could not update cart', 'err');
  }
  return;
}

const dec = e.target.closest('[data-qty-dec]');
if (dec) {
  const i = Number(dec.getAttribute('data-qty-dec'));
  const liveItems = Array.isArray(state.liveCart?.items) ? state.liveCart.items : [];
  const liveLine = liveItems[i];
  if (!liveLine?.key) return;

  try {
    await changeShopifyCartLine(liveLine.key, Math.max(0, Number(liveLine.quantity || 0) - 1));
    await getLiveCartContext();
    renderPlan();
    showToast('Cart updated', 'ok');
  } catch {
    showToast('Could not update cart', 'err');
  }
  return;
}        
          if (
    pendingDeleteChatId &&
    !e.target.closest('[data-del-chat]') &&
    !e.target.closest('[data-confirm-del]') &&
    !e.target.closest('[data-cancel-del]')
  ) {
    pendingDeleteChatId = null;
    renderRecent();
  }
});

els.deleteModal?.addEventListener('click', (e) => {
  if (e.target === els.deleteModal) {
    modalDeleteChatId = null;
    renderDeleteModal();
  }
});

        els.shopSearch?.addEventListener('input', async () => {
  uiPrefs.shopQuery = els.shopSearch.value || '';
  saveState();
  try {
    await loadShopCatalog(uiPrefs.shopQuery);
    renderShop(uiPrefs.shopQuery);
  } catch {
    showToast('Could not load catalog', 'err');
  }
});

[els.filterVendor, els.filterCategory, els.filterPrice, els.filterSort].forEach(el => {
  el?.addEventListener('change', () => {
    ensureShopFilters();
    uiPrefs.shopFilters.vendor = els.filterVendor?.value || 'all';
    uiPrefs.shopFilters.category = els.filterCategory?.value || 'all';
    uiPrefs.shopFilters.price = els.filterPrice?.value || 'all';
    uiPrefs.shopFilters.sort = els.filterSort?.value || 'relevance';
    saveState();
    renderShop(uiPrefs.shopQuery || '');
  });
});

        function setCompany(name) {
          const n = name || 'Your Company';
          if (els.companyName) els.companyName.textContent = n;
          if (els.avatar) {
            const initials = n.split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || 'SO';
            els.avatar.textContent = initials;
          }
        }

        els.attachBtn?.setAttribute('title', 'Attach photos & files');
els.send?.setAttribute('title', 'Send message');

root.addEventListener('click', (e) => {
  if (window.innerWidth > 1100) return;
  if (
    e.target.closest('[data-del-chat]') ||
    e.target.closest('.soRc__confirmCard') ||
    e.target.closest('[data-open-del-modal]') ||
    e.target.closest('[data-cancel-del]') ||
    e.target.closest('[data-confirm-del-modal]') ||
    e.target.closest('[data-close-del-modal]')
  ) return;
  if (e.target.closest('.soRc__sidebar')) return;
  root.classList.remove('is-sidebar-open');
});

function installMobileExitGuard() {
  // Keep user inside app on mobile back-swipe/back-button.
  let allowExit = false;

  const armGuard = () => {
    if (window.innerWidth > 1100 || allowExit) return;
    const st = history.state || {};
    if (!st.so_lock) {
      history.replaceState({ ...st, so_lock_root: 1 }, '', location.href);
      history.pushState({ so_lock: 1 }, '', location.href);
    }
  };

  armGuard();

  window.addEventListener('pageshow', armGuard);
  window.addEventListener('resize', armGuard);

  window.addEventListener('popstate', () => {
    if (window.innerWidth > 1100 || allowExit) return;
    history.pushState({ so_lock: 1 }, '', location.href);
    root.classList.remove('is-sidebar-open');
  });

  root.querySelector('a[href="/account/logout"]')?.addEventListener('click', () => {
    allowExit = true;
  });
}

setCompany(CUSTOMER_COMPANY || 'Your Company');

installMobileExitGuard();
installMobileSwipeOpenSidebar();
root.style.visibility = 'hidden';

try {
  const access = await ensureRetailerRole();
  if (!access.ok) {
    window.location.replace('/login');
    return;
  }
  const mfaOk = await ensureMfaVerified();
  if (!mfaOk) {
    return;
  }
} catch (e) {
  console.warn('Retailer auth gate error; redirecting to login.', e);
  window.location.replace('/login');
  return;
}

root.classList.remove('soRc--booting');
root.style.visibility = '';

setInterval(() => {
  ensureRetailerRole().catch(() => {});
}, 8 * 60 * 1000);


loadState();
loadPoliciesAutomationCache();

renderRecent();
renderDeleteModal();
renderChat();
renderPlan();
renderPoliciesAutomation();
renderReportsHistory();
renderShopSkeleton();
const urlTab = new URLSearchParams(window.location.search).get('tab');
const urlConnected = new URLSearchParams(window.location.search).get('connected');
const urlConnectError = new URLSearchParams(window.location.search).get('connect_error');
const allowedTabs = ['chat', 'performance', 'reorders', 'forecasts', 'policies-automation', 'classification', 'locations', 'reports', 'plan'];
const initialTabCandidate = String(urlTab || uiPrefs.activeTab || 'chat').trim().toLowerCase();
const initialTab = allowedTabs.includes(initialTabCandidate) ? initialTabCandidate : 'chat';

uiPrefs.activeTab = initialTab;
saveState();
setActiveTab(initialTab);

setSub(uiPrefs.activeSubTab || 'cart');

if (els.shopSearch) els.shopSearch.value = uiPrefs.shopQuery || '';

if (urlConnectError) {
  showToast(`Connect error: ${urlConnectError}`, 'err');
}
if (['shopify', 'square', 'clover', 'lightspeed', 'moneris'].includes(String(urlConnected || '').toLowerCase())) {
  const provider = String(urlConnected || '').toLowerCase();
  const label = provider === 'shopify'
    ? 'Shopify'
    : provider === 'square'
      ? 'Square'
      : provider === 'clover'
        ? 'Clover'
        : provider === 'lightspeed'
          ? 'Lightspeed'
          : 'Moneris';
  showToast(`${label} connected`, 'ok');
  loadPerformanceStatus().catch(() => {});
}

autoGrow();
updateSendState();
updateJumpButton();

// Warm background data in parallel so nav/panels become interactive immediately.
hydrateChatsFromBackend()
  .then(() => hydrateActiveChatMessages())
  .then(() => {
    renderRecent();
    renderChat();
  })
  .catch(() => showToast('Could not load chat history', 'warn'));

syncPlanNow()
  .then(() => {
    renderPlan();
    renderPoliciesAutomation();
  })
  .catch(() => {});

getLiveCartContext().catch(() => {});

loadBillingEntitlements()
  .then(() => {
    renderPlan();
    renderPoliciesAutomation();
  })
  .catch(() => {});

loadSavedReportsList()
  .then((_savedReports) => {
    if (!_savedReports.length) return;
    const byCode = Object.fromEntries(_savedReports.map((r) => [String(r.code || ''), r]));
    if (els.reportWeeklyBtn && byCode.weekly_summary?.label) els.reportWeeklyBtn.textContent = byCode.weekly_summary.label;
    if (els.reportMonthlyBtn && byCode.monthly_summary?.label) els.reportMonthlyBtn.textContent = byCode.monthly_summary.label;
    if (els.reportOpportunitiesBtn && byCode.top_opportunities?.label) els.reportOpportunitiesBtn.textContent = byCode.top_opportunities.label;
  })
  .catch(() => {});

loadReportsHistory();
renderReportsHistory();

loadPerformanceStatus().catch(() => {});
loadPoliciesAutomation().catch(() => {});

loadShopCatalog(uiPrefs.shopQuery || '')
  .then(() => {
    renderShop(uiPrefs.shopQuery || '');
    renderPlan(); // refresh cart images once catalog is in memory
  })
  .catch(() => showToast('Could not load catalog', 'err'));

      })();
