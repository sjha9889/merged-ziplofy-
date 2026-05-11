"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme1NewArrivalsSection = Theme1NewArrivalsSection;
const react_router_dom_1 = require("react-router-dom");
const currency_1 = require("../../utils/currency");
function Theme1NewArrivalsSection({ products, loading, }) {
    return (<section aria-label="New arrivals section">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">New arrivals section</h2>
      {loading && products.length === 0 ? (<p className="text-sm text-slate-500">Loading products…</p>) : (<div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (<react_router_dom_1.Link key={p._id} to={`/products/${p._id}`} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-300 hover:shadow-md">
              <div className="aspect-[4/3] bg-slate-100">
                {p.imageUrls?.[0] ? (<img src={p.imageUrls[0]} alt="" className="h-full w-full object-cover"/>) : (<div className="flex h-full items-center justify-center text-xs text-slate-400">—</div>)}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-sm font-semibold text-slate-900">{p.title}</p>
                <p className="mt-auto pt-2 text-sm font-bold tabular-nums text-teal-800">{(0, currency_1.formatINR)(p.price)}</p>
              </div>
            </react_router_dom_1.Link>))}
        </div>)}
      {!loading && products.length === 0 ? <p className="text-sm text-slate-500">No products published yet.</p> : null}
    </section>);
}
