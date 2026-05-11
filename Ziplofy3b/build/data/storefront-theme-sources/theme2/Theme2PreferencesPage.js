"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2PreferencesPage = Theme2PreferencesPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const Theme2Header_1 = require("./Theme2Header");
const Theme2Footer_1 = require("./Theme2Footer");
function Theme2PreferencesPage() {
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
    if (!user)
        return null;
    return (<div className="min-h-svh bg-[#FFEB00] font-mono text-black">
      <div className="border-b-4 border-black bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFEB00]">
        PREFERENCES // {(storeFrontMeta?.name ?? 'STORE').toUpperCase()}
      </div>
      <Theme2Header_1.Theme2Header userName={`${user.firstName} ${user.lastName}`.trim()} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-5xl px-3 py-8">
        <div className="mx-auto max-w-xl border-4 border-black bg-white p-5">
          <h1 className="text-lg font-black uppercase">User Preferences</h1>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase">Language</label>
              <input value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border-2 border-black px-3 py-2 text-sm"/>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase">Tax preference</label>
              <select value={collectTax} onChange={(e) => setCollectTax(e.target.value)} className="w-full border-2 border-black px-3 py-2 text-sm">
                <option value="collect">Collect tax</option>
                <option value="dont_collect">Do not collect tax</option>
                <option value="collect_unless_exempt">Collect unless exempt</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs font-black uppercase">
              <input type="checkbox" checked={agreedToMarketingEmails} onChange={(e) => setAgreedToMarketingEmails(e.target.checked)}/>
              Email marketing updates
            </label>
            <label className="flex items-center gap-2 text-xs font-black uppercase">
              <input type="checkbox" checked={agreedToSmsMarketing} onChange={(e) => setAgreedToSmsMarketing(e.target.checked)}/>
              SMS marketing updates
            </label>
          </div>
          <button type="button" onClick={() => void save()} className="mt-4 border-4 border-black bg-black px-4 py-2 text-xs font-black uppercase text-[#FFEB00] hover:bg-[#FFEB00] hover:text-black">
            Save preferences
          </button>
        </div>
      </main>
      <Theme2Footer_1.Theme2Footer />
    </div>);
}
