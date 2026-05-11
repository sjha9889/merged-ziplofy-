"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme2NewArrivalsSection = Theme2NewArrivalsSection;
const react_router_dom_1 = require("react-router-dom");
const currency_1 = require("../../utils/currency");
function Theme2NewArrivalsSection({ products }) {
    if (!products.length)
        return null;
    return (<section className="border-t-4 border-black bg-black p-3 text-[#FFEB00]" aria-label="New arrivals section">
      <h2 className="text-[10px] font-bold uppercase tracking-widest">NEW ARRIVALS SECTION</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 6).map((p) => (<react_router_dom_1.Link key={p._id} to={`/products/${p._id}`} className="border-4 border-[#FFEB00] bg-[#FFEB00] p-2 text-black hover:bg-white">
            <p className="line-clamp-1 text-[11px] font-black uppercase">{p.title}</p>
            <p className="mt-2 text-xs font-black tabular-nums">{(0, currency_1.formatINR)(p.price)}</p>
          </react_router_dom_1.Link>))}
      </div>
    </section>);
}
