"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2AuthPage = Theme2AuthPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const store_context_1 = require("../../contexts/store.context");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const Theme2Header_1 = require("./Theme2Header");
const Theme2Footer_1 = require("./Theme2Footer");
function Theme2AuthPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { storeFrontMeta } = (0, store_context_1.useStorefront)();
    const { login, signup, user, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const [mode, setMode] = (0, react_1.useState)('login');
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [busy, setBusy] = (0, react_1.useState)(false);
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
    return (<div className="min-h-svh bg-[#FFEB00] font-mono text-black">
      <div className="border-b-4 border-black bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFEB00]">
        AUTH
      </div>
      <Theme2Header_1.Theme2Header userName={user ? `${user.firstName} ${user.lastName}`.trim() : undefined} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-4xl px-3 py-8">
        <div className="mx-auto max-w-xl border-4 border-black bg-white p-5">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode('login')} className={`border-2 border-black px-3 py-2 text-xs font-black uppercase ${mode === 'login' ? 'bg-black text-[#FFEB00]' : 'bg-white'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('signup')} className={`border-2 border-black px-3 py-2 text-xs font-black uppercase ${mode === 'signup' ? 'bg-black text-[#FFEB00]' : 'bg-white'}`}>
              Signup
            </button>
          </div>
          {mode === 'signup' ? (<div className="mb-3 grid grid-cols-2 gap-2">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="border-2 border-black px-3 py-2 text-sm"/>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="border-2 border-black px-3 py-2 text-sm"/>
            </div>) : null}
          <div className="space-y-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border-2 border-black px-3 py-2 text-sm"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border-2 border-black px-3 py-2 text-sm"/>
            <button type="button" onClick={() => void submit()} disabled={busy} className="w-full border-4 border-black bg-black px-4 py-2.5 text-sm font-black uppercase text-[#FFEB00] hover:bg-[#FFEB00] hover:text-black disabled:opacity-60">
              {busy ? 'PLEASE_WAIT' : mode === 'login' ? 'LOGIN' : 'CREATE_ACCOUNT'}
            </button>
            <react_router_dom_1.Link to="/" className="block text-center text-xs font-black uppercase underline">
              BACK_HOME
            </react_router_dom_1.Link>
          </div>
        </div>
      </main>
      <Theme2Footer_1.Theme2Footer />
    </div>);
}
