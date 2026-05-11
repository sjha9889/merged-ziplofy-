"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme1AuthPage = Theme1AuthPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const Theme1Header_1 = require("./Theme1Header");
const Theme1Footer_1 = require("./Theme1Footer");
function Theme1AuthPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { login, signup, user, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const [mode, setMode] = (0, react_1.useState)('login');
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [busy, setBusy] = (0, react_1.useState)(false);
    const name = storeFrontMeta?.name ?? 'Store';
    const submit = async () => {
        if (!storeFrontMeta?.storeId || !email || !password)
            return;
        setBusy(true);
        try {
            if (mode === 'login') {
                await login({ storeId: storeFrontMeta.storeId, email, password });
            }
            else {
                await signup({ storeId: storeFrontMeta.storeId, firstName, lastName, email, password });
            }
            navigate('/');
        }
        catch {
            /* context handles toasts */
        }
        finally {
            setBusy(false);
        }
    };
    return (<div className="min-h-svh bg-slate-50 text-slate-900">
      <Theme1Header_1.Theme1Header storeName={name} userName={user ? `${user.firstName} ${user.lastName}`.trim() : undefined} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <button type="button" onClick={() => setMode('login')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === 'login' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('signup')} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === 'signup' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
              Sign up
            </button>
          </div>

          {mode === 'signup' ? (<div className="mb-3 grid grid-cols-2 gap-3">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm"/>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm"/>
            </div>) : null}
          <div className="space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"/>
            <button type="button" onClick={() => void submit()} disabled={busy} className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
              {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
            <react_router_dom_1.Link to="/" className="block text-center text-xs font-medium text-teal-700 hover:underline">
              Back to home
            </react_router_dom_1.Link>
          </div>
        </div>
      </main>
      <Theme1Footer_1.Theme1Footer storeName={name}/>
    </div>);
}
