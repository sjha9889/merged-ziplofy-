"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2ProfilePage = Theme2ProfilePage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const storefront_auth_context_1 = require("../../contexts/storefront-auth.context");
const Theme2Header_1 = require("./Theme2Header");
const Theme2Footer_1 = require("./Theme2Footer");
function Theme2ProfilePage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { user, checkAuth, updateUser, logout } = (0, storefront_auth_context_1.useStorefrontAuth)();
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        checkAuth().catch(() => { });
    }, [checkAuth]);
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setPhoneNumber(user.phoneNumber || '');
    }, [user]);
    const save = async () => {
        if (!user?._id)
            return;
        await updateUser(user._id, { firstName, lastName, phoneNumber });
    };
    if (!user)
        return null;
    return (<div className="min-h-svh bg-[#FFEB00] font-mono text-black">
      <div className="border-b-4 border-black bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FFEB00]">PROFILE</div>
      <Theme2Header_1.Theme2Header userName={`${user.firstName} ${user.lastName}`.trim()} onCartOpen={() => { }} onLogout={() => {
            logout().catch(() => { });
            navigate('/');
        }}/>
      <main className="mx-auto max-w-4xl px-3 py-8">
        <div className="mx-auto max-w-xl border-4 border-black bg-white p-5">
          <h1 className="text-lg font-black uppercase">Profile</h1>
          <p className="mt-1 text-xs font-bold">{user.email}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="border-2 border-black px-3 py-2 text-sm"/>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="border-2 border-black px-3 py-2 text-sm"/>
          </div>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" className="mt-2 w-full border-2 border-black px-3 py-2 text-sm"/>
          <button type="button" onClick={() => void save()} className="mt-3 border-4 border-black bg-black px-4 py-2 text-xs font-black uppercase text-[#FFEB00] hover:bg-[#FFEB00] hover:text-black">
            Save
          </button>
        </div>
      </main>
      <Theme2Footer_1.Theme2Footer />
    </div>);
}
