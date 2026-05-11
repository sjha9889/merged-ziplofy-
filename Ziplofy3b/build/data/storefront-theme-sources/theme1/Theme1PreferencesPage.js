"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme1PreferencesPage = Theme1PreferencesPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const Theme1Header_1 = require("./Theme1Header");
const Theme1Footer_1 = require("./Theme1Footer");
function Theme1PreferencesPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { user, checkAuth, updateUser, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const [language, setLanguage] = (0, react_1.useState)('en');
    const [collectTax, setCollectTax] = (0, react_1.useState)('collect');
    const [agreedToMarketingEmails, setAgreedToMarketingEmails] = (0, react_1.useState)(false);
    const [agreedToSmsMarketing, setAgreedToSmsMarketing] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        checkAuth().catch(() => { });
    }, [checkAuth]);
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        setLanguage(user.language || 'en');
        setCollectTax(user.collectTax || 'collect');
        setAgreedToMarketingEmails(Boolean(user.agreedToMarketingEmails));
        setAgreedToSmsMarketing(Boolean(user.agreedToSmsMarketing));
    }, [user]);
    const save = async () => {
        if (!user?._id)
            return;
        await updateUser(user._id, {
            language,
            collectTax,
            agreedToMarketingEmails,
            agreedToSmsMarketing,
        });
    };
    if (!user) {
        return null;
    }
    return (<div className="min-h-svh bg-slate-50 text-slate-900">
      <Theme1Header_1.Theme1Header storeName={storeFrontMeta?.name ?? 'Store'} userName={`${user.firstName} ${user.lastName}`.trim()} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">User Preferences</h1>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Language</label>
              <input value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Tax preference</label>
              <select value={collectTax} onChange={(e) => setCollectTax(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="collect">Collect tax</option>
                <option value="dont_collect">Do not collect tax</option>
                <option value="collect_unless_exempt">Collect unless exempt</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={agreedToMarketingEmails} onChange={(e) => setAgreedToMarketingEmails(e.target.checked)}/>
              Email marketing updates
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={agreedToSmsMarketing} onChange={(e) => setAgreedToSmsMarketing(e.target.checked)}/>
              SMS marketing updates
            </label>
          </div>
          <button type="button" onClick={() => void save()} className="mt-5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
            Save preferences
          </button>
        </div>
      </main>
      <Theme1Footer_1.Theme1Footer storeName={storeFrontMeta?.name ?? 'Store'}/>
    </div>);
}
