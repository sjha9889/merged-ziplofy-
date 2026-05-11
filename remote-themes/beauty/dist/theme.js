import { jsxs as n, jsx as t, Fragment as $ } from "react/jsx-runtime";
import { useState as x, useEffect as v, useMemo as B } from "react";
import { Link as f, useNavigate as I, useParams as N } from "react-router-dom";
import { useStorefrontAuth as z, useStorefrontCart as C, formatINR as W, useStorefrontProducts as P, useStorefront as T, useStorefrontProductVariants as R, useStorefrontCollections as E, useStorefrontOrder as q } from "@render-store/sdk";
const e = {
  cream: "#faf8f6",
  blush: "#fdf4f6",
  rose: "#c77b86",
  roseDeep: "#a85d6a",
  roseLight: "#e8b4bc",
  gold: "#b8975c",
  goldSoft: "#d4c4a0",
  ink: "#1f1719",
  inkMuted: "#5c5154",
  white: "#ffffff",
  line: "rgba(199, 123, 134, 0.18)",
  shadow: "0 20px 50px rgba(31, 23, 25, 0.08)",
  shadowSm: "0 8px 24px rgba(31, 23, 25, 0.06)",
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Outfit', system-ui, -apple-system, sans-serif"
}, b = {
  fontFamily: e.sans,
  fontSize: 15,
  padding: "14px 16px",
  border: `1px solid ${e.line}`,
  borderRadius: e.radiusSm,
  background: e.white,
  color: e.ink,
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
}, k = () => /* @__PURE__ */ n(
  "footer",
  {
    style: {
      marginTop: 80,
      background: `linear-gradient(180deg, ${e.blush} 0%, ${e.cream} 45%, #f0ebe6 100%)`,
      borderTop: `1px solid ${e.line}`,
      padding: "56px 28px 40px",
      color: e.inkMuted,
      fontFamily: e.sans
    },
    children: [
      /* @__PURE__ */ n(
        "div",
        {
          style: {
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40
          },
          children: [
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ t(
                "p",
                {
                  style: {
                    fontFamily: e.serif,
                    fontSize: 26,
                    color: e.ink,
                    margin: "0 0 12px",
                    fontWeight: 600
                  },
                  children: "Lumière"
                }
              ),
              /* @__PURE__ */ t("p", { style: { margin: 0, lineHeight: 1.65, fontSize: 14 }, children: "Curated skincare, color, and fragrance — presented with the same care you give your ritual." })
            ] }),
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ t("p", { style: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: e.roseDeep, margin: "0 0 14px", fontWeight: 600 }, children: "Explore" }),
              /* @__PURE__ */ n("div", { style: { display: "grid", gap: 10 }, children: [
                /* @__PURE__ */ t(f, { to: "/", style: { color: e.ink, textDecoration: "none", fontSize: 14 }, children: "Boutique" }),
                /* @__PURE__ */ t(f, { to: "/my-orders", style: { color: e.ink, textDecoration: "none", fontSize: 14 }, children: "Orders" }),
                /* @__PURE__ */ t(f, { to: "/preferences", style: { color: e.ink, textDecoration: "none", fontSize: 14 }, children: "Preferences" })
              ] })
            ] }),
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ t("p", { style: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: e.roseDeep, margin: "0 0 14px", fontWeight: 600 }, children: "Care" }),
              /* @__PURE__ */ t("p", { style: { margin: 0, lineHeight: 1.65, fontSize: 14 }, children: "Complimentary samples on qualifying orders. Carbon-neutral shipping where available." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ t(
        "p",
        {
          style: {
            textAlign: "center",
            margin: "48px 0 0",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: e.inkMuted
          },
          children: "Beauty theme · powered by render-store"
        }
      )
    ]
  }
), w = () => {
  const { user: i, logout: r } = z(), { getAllItems: s } = C(), c = s().reduce((a, h) => a + h.quantity, 0), d = {
    color: e.ink,
    textDecoration: "none",
    fontFamily: e.sans,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.02em"
  };
  return /* @__PURE__ */ t(
    "header",
    {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(250, 248, 246, 0.88)",
        borderBottom: `1px solid ${e.line}`,
        padding: "16px 28px",
        boxShadow: e.shadowSm
      },
      children: /* @__PURE__ */ n(
        "div",
        {
          style: {
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24
          },
          children: [
            /* @__PURE__ */ n(f, { to: "/", style: { textDecoration: "none" }, children: [
              /* @__PURE__ */ t(
                "span",
                {
                  style: {
                    fontFamily: e.serif,
                    fontSize: 28,
                    fontWeight: 600,
                    color: e.ink,
                    letterSpacing: "0.04em"
                  },
                  children: "Lumière"
                }
              ),
              /* @__PURE__ */ t(
                "span",
                {
                  style: {
                    display: "block",
                    fontFamily: e.sans,
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: e.roseDeep,
                    marginTop: 2
                  },
                  children: "Beauty Atelier"
                }
              )
            ] }),
            /* @__PURE__ */ n("nav", { style: { display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "flex-end" }, children: [
              /* @__PURE__ */ t(f, { to: "/", style: d, children: "Home" }),
              /* @__PURE__ */ t(f, { to: "/my-orders", style: d, children: "Orders" }),
              /* @__PURE__ */ t(f, { to: "/profile", style: d, children: "Profile" }),
              /* @__PURE__ */ t(f, { to: "/preferences", style: d, children: "Preferences" }),
              /* @__PURE__ */ n(
                f,
                {
                  to: "/cart",
                  style: {
                    fontFamily: e.sans,
                    fontSize: 13,
                    color: e.inkMuted,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${e.line}`,
                    background: e.white,
                    textDecoration: "none"
                  },
                  children: [
                    "Bag · ",
                    /* @__PURE__ */ t("strong", { style: { color: e.roseDeep, fontWeight: 600 }, children: c })
                  ]
                }
              ),
              i ? /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    r();
                  },
                  style: {
                    fontFamily: e.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: `linear-gradient(135deg, ${e.rose} 0%, ${e.roseDeep} 100%)`,
                    color: e.white,
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: 999,
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(167, 93, 106, 0.35)"
                  },
                  children: "Sign out"
                }
              ) : /* @__PURE__ */ n($, { children: [
                /* @__PURE__ */ t(
                  f,
                  {
                    to: "/auth/login",
                    style: {
                      ...d,
                      color: e.roseDeep,
                      borderBottom: `2px solid ${e.roseLight}`,
                      paddingBottom: 2
                    },
                    children: "Sign in"
                  }
                ),
                /* @__PURE__ */ t(f, { to: "/auth/signup", style: { ...d, color: e.gold, fontWeight: 600 }, children: "Join" })
              ] })
            ] })
          ]
        }
      )
    }
  );
};
function M(i) {
  const r = i.productVariantId;
  return typeof r == "object" && r !== null && "_id" in r ? r : null;
}
const j = () => {
  const { user: i, checkAuth: r } = z(), { getAllItems: s, getCartByCustomerId: c, updateCartEntry: d, deleteCartEntry: a, loading: h } = C(), [u, m] = x({});
  v(() => {
    r();
  }, [r]), v(() => {
    i?._id && c(i._id);
  }, [c, i?._id]);
  const o = s(), S = B(() => {
    let p = 0;
    for (const l of o) {
      const g = M(l);
      g && (p += g.price * l.quantity);
    }
    return p;
  }, [o]);
  return v(() => {
    const p = {};
    for (const l of o)
      p[l._id] = String(l.quantity);
    m(p);
  }, [o]), /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ n("section", { style: { padding: "32px 28px 72px", maxWidth: 880, margin: "0 auto" }, children: [
      /* @__PURE__ */ t("h1", { style: { marginTop: 0, fontFamily: e.serif, fontSize: 36, fontWeight: 600 }, children: "Your bag" }),
      h && o.length === 0 && /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, color: e.inkMuted }, children: "Loading your bag…" }),
      !h && o.length === 0 && /* @__PURE__ */ n(
        "div",
        {
          style: {
            border: `1px solid ${e.line}`,
            padding: 36,
            background: e.white,
            borderRadius: e.radiusLg,
            boxShadow: e.shadowSm,
            textAlign: "center"
          },
          children: [
            /* @__PURE__ */ t("p", { style: { margin: "0 0 16px", fontFamily: e.sans, color: e.inkMuted }, children: "Your bag is empty — room for something lovely." }),
            /* @__PURE__ */ t(
              f,
              {
                to: "/",
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: e.roseDeep
                },
                children: "Continue shopping"
              }
            )
          ]
        }
      ),
      o.length > 0 && /* @__PURE__ */ n($, { children: [
        /* @__PURE__ */ t("div", { style: { display: "grid", gap: 16 }, children: o.map((p) => {
          const l = M(p), g = l?.optionValues ? Object.entries(l.optionValues) : [], D = u[p._id] ?? String(p.quantity);
          return /* @__PURE__ */ n(
            "article",
            {
              style: {
                border: `1px solid ${e.line}`,
                padding: 22,
                background: e.white,
                borderRadius: e.radiusMd,
                boxShadow: e.shadowSm,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "start"
              },
              children: [
                /* @__PURE__ */ t("div", { children: l ? /* @__PURE__ */ n($, { children: [
                  /* @__PURE__ */ n(
                    f,
                    {
                      to: `/products/${l.productId}`,
                      style: { fontFamily: e.serif, fontSize: 20, fontWeight: 600, color: e.ink, textDecoration: "none" },
                      children: [
                        "SKU ",
                        l.sku
                      ]
                    }
                  ),
                  /* @__PURE__ */ t("p", { style: { margin: "8px 0 0", fontFamily: e.sans, fontSize: 14, color: e.inkMuted }, children: g.length > 0 ? g.map(([y, F]) => `${y}: ${F}`).join(" · ") : "Default variant" }),
                  /* @__PURE__ */ n("p", { style: { margin: "10px 0 0", fontFamily: e.serif, fontSize: 17, color: e.gold }, children: [
                    W(l.price),
                    " each"
                  ] })
                ] }) : /* @__PURE__ */ t("p", { style: { margin: 0, fontFamily: e.sans }, children: "Line item" }) }),
                /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }, children: [
                  /* @__PURE__ */ n("label", { style: { display: "flex", alignItems: "center", gap: 10, fontFamily: e.sans, fontSize: 13, color: e.inkMuted }, children: [
                    "Qty",
                    /* @__PURE__ */ t(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        value: D,
                        onChange: (y) => m((F) => ({ ...F, [p._id]: y.target.value })),
                        onBlur: (y) => {
                          const F = Math.max(1, Math.floor(Number(y.target.value) || 1));
                          m((_) => ({ ..._, [p._id]: String(F) })), F !== p.quantity && d({ id: p._id, quantity: F });
                        },
                        style: { ...b, width: 72, padding: "8px 10px" }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ t("p", { style: { margin: 0, fontFamily: e.serif, fontSize: 22, color: e.roseDeep, fontWeight: 600 }, children: l ? W(l.price * p.quantity) : "—" }),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        a(p._id);
                      },
                      style: {
                        fontFamily: e.sans,
                        fontSize: 12,
                        background: "transparent",
                        border: `1px solid ${e.roseLight}`,
                        color: e.roseDeep,
                        padding: "8px 14px",
                        cursor: "pointer",
                        borderRadius: 999
                      },
                      children: "Remove"
                    }
                  )
                ] })
              ]
            },
            p._id
          );
        }) }),
        /* @__PURE__ */ n(
          "div",
          {
            style: {
              marginTop: 28,
              padding: "24px 28px",
              borderRadius: e.radiusLg,
              border: `1px solid ${e.line}`,
              background: e.white,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              boxShadow: e.shadowSm
            },
            children: [
              /* @__PURE__ */ t("span", { style: { fontFamily: e.serif, fontSize: 22, fontWeight: 600 }, children: "Subtotal" }),
              /* @__PURE__ */ t("span", { style: { fontFamily: e.serif, fontSize: 28, color: e.gold, fontWeight: 600 }, children: W(S) })
            ]
          }
        ),
        /* @__PURE__ */ t("p", { style: { marginTop: 18, fontFamily: e.sans, fontSize: 13, color: e.inkMuted }, children: "Checkout can connect to your payment flow when you are ready." })
      ] })
    ] }),
    /* @__PURE__ */ t(k, {})
  ] });
}, L = () => /* @__PURE__ */ n(
  "section",
  {
    style: {
      position: "relative",
      overflow: "hidden",
      minHeight: 420,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 28px",
      background: `
          radial-gradient(ellipse 80% 60% at 70% 20%, rgba(232, 180, 188, 0.45) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 15% 80%, rgba(184, 151, 92, 0.12) 0%, transparent 50%),
          linear-gradient(165deg, ${e.cream} 0%, ${e.blush} 50%, #f5ebe8 100%)
        `
    },
    children: [
      /* @__PURE__ */ t(
        "div",
        {
          style: {
            position: "absolute",
            inset: "8% 12% auto auto",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(199,123,134,0.08))",
            filter: "blur(1px)",
            pointerEvents: "none"
          }
        }
      ),
      /* @__PURE__ */ n("div", { style: { position: "relative", maxWidth: 720, textAlign: "center" }, children: [
        /* @__PURE__ */ t(
          "p",
          {
            style: {
              fontFamily: e.sans,
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: e.roseDeep,
              margin: "0 0 16px",
              fontWeight: 600
            },
            children: "New season · luminous skin"
          }
        ),
        /* @__PURE__ */ n(
          "h1",
          {
            style: {
              fontFamily: e.serif,
              fontWeight: 600,
              fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
              lineHeight: 1.12,
              color: e.ink,
              margin: "0 0 20px",
              letterSpacing: "-0.02em"
            },
            children: [
              "Rituals that feel like",
              " ",
              /* @__PURE__ */ t("span", { style: { fontStyle: "italic", color: e.roseDeep }, children: "self-portraits" })
            ]
          }
        ),
        /* @__PURE__ */ t(
          "p",
          {
            style: {
              fontFamily: e.sans,
              fontSize: 18,
              lineHeight: 1.7,
              color: e.inkMuted,
              margin: "0 auto 32px",
              maxWidth: 520,
              fontWeight: 400
            },
            children: "Editorial textures, soft light, and products your customers already love — wrapped in an atelier-grade storefront experience."
          }
        ),
        /* @__PURE__ */ n("div", { style: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ t(
            f,
            {
              to: "/auth/signup",
              style: {
                fontFamily: e.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: e.white,
                background: `linear-gradient(135deg, ${e.ink} 0%, #3d2f33 100%)`,
                padding: "16px 32px",
                borderRadius: 999,
                boxShadow: e.shadow
              },
              children: "Begin your ritual"
            }
          ),
          /* @__PURE__ */ t(
            f,
            {
              to: "/",
              style: {
                fontFamily: e.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: e.roseDeep,
                padding: "16px 28px",
                borderRadius: 999,
                border: `1px solid ${e.line}`,
                background: e.white
              },
              children: "Shop the edit"
            }
          )
        ] })
      ] })
    ]
  }
), A = () => {
  const { products: i } = P(), { storeFrontMeta: r } = T(), { fetchVariantsByProductId: s } = R(), { createCartEntry: c } = C(), d = async (a) => {
    if (!r?.storeId) return;
    const u = (await s(a))[0];
    u && await c({ storeId: r.storeId, productVariantId: u._id, quantity: 1 }, u);
  };
  return /* @__PURE__ */ t("section", { style: { padding: "72px 28px", background: e.white }, children: /* @__PURE__ */ n("div", { style: { maxWidth: 1100, margin: "0 auto" }, children: [
    /* @__PURE__ */ t("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 40 }, children: /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ t(
        "p",
        {
          style: {
            fontFamily: e.sans,
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: e.roseDeep,
            margin: "0 0 8px",
            fontWeight: 600
          },
          children: "Just arrived"
        }
      ),
      /* @__PURE__ */ t("h2", { style: { fontFamily: e.serif, fontSize: "clamp(1.75rem, 4vw, 2.35rem)", fontWeight: 600, color: e.ink, margin: 0 }, children: "The vanity edit" })
    ] }) }),
    /* @__PURE__ */ t("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 28 }, children: i.slice(0, 8).map((a) => /* @__PURE__ */ n(
      "article",
      {
        style: {
          borderRadius: e.radiusLg,
          overflow: "hidden",
          border: `1px solid ${e.line}`,
          background: e.cream,
          boxShadow: e.shadowSm,
          display: "flex",
          flexDirection: "column"
        },
        children: [
          /* @__PURE__ */ t(
            "div",
            {
              style: {
                aspectRatio: "4 / 5",
                background: `
                    linear-gradient(160deg, rgba(255,255,255,0.9) 0%, transparent 40%),
                    linear-gradient(135deg, ${e.blush} 0%, #e8d4d8 40%, ${e.goldSoft} 120%)
                  `,
                position: "relative"
              },
              children: /* @__PURE__ */ t(
                "span",
                {
                  style: {
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    fontFamily: e.sans,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: e.white,
                    background: "rgba(31,23,25,0.35)",
                    padding: "6px 10px",
                    borderRadius: 6,
                    backdropFilter: "blur(6px)"
                  },
                  children: "New"
                }
              )
            }
          ),
          /* @__PURE__ */ n("div", { style: { padding: "22px 20px 24px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }, children: [
            /* @__PURE__ */ t("h3", { style: { fontFamily: e.serif, fontSize: 22, fontWeight: 600, color: e.ink, margin: 0, lineHeight: 1.25 }, children: a.title }),
            /* @__PURE__ */ n("p", { style: { fontFamily: e.sans, fontSize: 14, color: e.inkMuted, margin: 0, lineHeight: 1.55, flex: 1 }, children: [
              (a.description ?? "").slice(0, 88),
              (a.description?.length ?? 0) > 88 ? "…" : ""
            ] }),
            /* @__PURE__ */ t("p", { style: { fontFamily: e.serif, fontSize: 22, color: e.gold, margin: "4px 0 0", fontWeight: 600 }, children: W(a.price) }),
            /* @__PURE__ */ n("div", { style: { display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ t(
                f,
                {
                  to: `/products/${a._id}`,
                  style: {
                    fontFamily: e.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: e.roseDeep,
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1px solid ${e.line}`,
                    background: e.white
                  },
                  children: "Details"
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    d(a._id);
                  },
                  style: {
                    ...b,
                    width: "auto",
                    cursor: "pointer",
                    fontFamily: e.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: `linear-gradient(135deg, ${e.rose} 0%, ${e.roseDeep} 100%)`,
                    color: e.white,
                    border: "none",
                    padding: "10px 18px",
                    boxShadow: "0 8px 20px rgba(167, 93, 106, 0.28)"
                  },
                  children: "Add to bag"
                }
              )
            ] })
          ] })
        ]
      },
      a._id
    )) })
  ] }) });
}, O = [
  { id: "t1", name: "Elena V.", role: "Editor", quote: "The cart flow feels effortless — like unboxing something precious." },
  { id: "t2", name: "Noor A.", role: "Stylist", quote: "Orders and profile stayed intuitive; the skin of the store finally matches the brand." },
  { id: "t3", name: "Sofia M.", role: "Founder", quote: "We swapped themes without touching our backend. That alone is worth the glow-up." }
], H = () => /* @__PURE__ */ t("section", { style: { padding: "72px 28px", background: e.cream }, children: /* @__PURE__ */ n("div", { style: { maxWidth: 1100, margin: "0 auto" }, children: [
  /* @__PURE__ */ t(
    "p",
    {
      style: {
        fontFamily: e.sans,
        fontSize: 11,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: e.gold,
        margin: "0 0 12px",
        fontWeight: 600,
        textAlign: "center"
      },
      children: "Voices"
    }
  ),
  /* @__PURE__ */ t(
    "h2",
    {
      style: {
        fontFamily: e.serif,
        fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
        fontWeight: 600,
        color: e.ink,
        textAlign: "center",
        margin: "0 0 48px"
      },
      children: "Loved in the mirror and in the inbox"
    }
  ),
  /* @__PURE__ */ t("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }, children: O.map((i) => /* @__PURE__ */ n(
    "article",
    {
      style: {
        background: e.white,
        borderRadius: e.radiusLg,
        padding: "32px 28px",
        border: `1px solid ${e.line}`,
        boxShadow: e.shadowSm,
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ t(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${e.roseLight}, ${e.goldSoft})`
            }
          }
        ),
        /* @__PURE__ */ n(
          "p",
          {
            style: {
              fontFamily: e.serif,
              fontSize: 20,
              fontStyle: "italic",
              lineHeight: 1.55,
              color: e.ink,
              margin: "8px 0 24px"
            },
            children: [
              "“",
              i.quote,
              "”"
            ]
          }
        ),
        /* @__PURE__ */ n("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
          /* @__PURE__ */ t(
            "div",
            {
              style: {
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(145deg, ${e.blush}, ${e.roseLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: e.serif,
                fontSize: 18,
                color: e.roseDeep,
                fontWeight: 600
              },
              children: i.name.charAt(0)
            }
          ),
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ t("p", { style: { margin: 0, fontFamily: e.sans, fontWeight: 600, color: e.ink, fontSize: 15 }, children: i.name }),
            /* @__PURE__ */ t("p", { style: { margin: "4px 0 0", fontFamily: e.sans, fontSize: 12, color: e.inkMuted, letterSpacing: "0.06em" }, children: i.role })
          ] })
        ] })
      ]
    },
    i.id
  )) })
] }) }), V = () => {
  const { storeFrontMeta: i } = T(), { fetchProductsByStoreId: r } = P(), { fetchCollectionsByStoreId: s } = E();
  return v(() => {
    i?.storeId && (r({ storeId: i.storeId, page: 1, limit: 12 }), s(i.storeId));
  }, [s, r, i?.storeId]), /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t(L, {}),
    /* @__PURE__ */ t(A, {}),
    /* @__PURE__ */ t(H, {}),
    /* @__PURE__ */ t(k, {})
  ] });
}, Y = () => {
  const { login: i, loading: r } = z(), { storeFrontMeta: s } = T(), c = I(), [d, a] = x(""), [h, u] = x(""), m = async (o) => {
    o.preventDefault(), s?.storeId && (await i({ storeId: s.storeId, email: d, password: h }), c("/"));
  };
  return /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t("section", { style: { padding: "48px 28px 80px" }, children: /* @__PURE__ */ n(
      "div",
      {
        style: {
          maxWidth: 440,
          margin: "0 auto",
          background: e.white,
          borderRadius: e.radiusLg,
          padding: "44px 40px",
          border: `1px solid ${e.line}`,
          boxShadow: e.shadow
        },
        children: [
          /* @__PURE__ */ t(
            "p",
            {
              style: {
                fontFamily: e.sans,
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: e.roseDeep,
                margin: "0 0 10px",
                fontWeight: 600
              },
              children: "Welcome back"
            }
          ),
          /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: 32, fontWeight: 600, margin: "0 0 28px" }, children: "Sign in" }),
          /* @__PURE__ */ n("form", { onSubmit: (o) => {
            m(o);
          }, style: { display: "grid", gap: 18 }, children: [
            /* @__PURE__ */ t("input", { value: d, onChange: (o) => a(o.target.value), placeholder: "Email", style: b }),
            /* @__PURE__ */ t("input", { value: h, onChange: (o) => u(o.target.value), type: "password", placeholder: "Password", style: b }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "submit",
                disabled: r,
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 8,
                  background: r ? "#c4bbb8" : `linear-gradient(135deg, ${e.rose} 0%, ${e.roseDeep} 100%)`,
                  color: e.white,
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: 999,
                  cursor: r ? "wait" : "pointer",
                  boxShadow: r ? "none" : "0 10px 28px rgba(167, 93, 106, 0.3)"
                },
                children: r ? "Please wait…" : "Continue"
              }
            )
          ] }),
          /* @__PURE__ */ n("p", { style: { fontFamily: e.sans, fontSize: 14, marginTop: 24, color: e.inkMuted }, children: [
            "New here?",
            " ",
            /* @__PURE__ */ t(f, { to: "/auth/signup", style: { color: e.roseDeep, fontWeight: 600 }, children: "Create an account" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ t(k, {})
  ] });
}, G = () => {
  const { user: i, checkAuth: r } = z(), { orders: s, getOrdersByCustomerId: c, loading: d } = q();
  return v(() => {
    r();
  }, [r]), v(() => {
    i?._id && c(i._id);
  }, [c, i?._id]), /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ n("section", { style: { padding: "48px 28px 80px", maxWidth: 720, margin: "0 auto" }, children: [
      /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: 36, fontWeight: 600, margin: "0 0 8px" }, children: "Your orders" }),
      /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, fontSize: 15, color: e.inkMuted, margin: "0 0 36px" }, children: "Track every delivery from one serene place." }),
      d && /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, color: e.inkMuted }, children: "Gathering your orders…" }),
      !d && s.length === 0 && /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, color: e.inkMuted, padding: "32px", textAlign: "center", border: `1px dashed ${e.line}`, borderRadius: e.radiusMd }, children: "No orders yet. Your first unboxing is just ahead." }),
      /* @__PURE__ */ t("div", { style: { display: "grid", gap: 20 }, children: s.map((a) => /* @__PURE__ */ n(
        "article",
        {
          style: {
            background: e.white,
            borderRadius: e.radiusMd,
            padding: "24px 28px",
            border: `1px solid ${e.line}`,
            boxShadow: e.shadowSm
          },
          children: [
            /* @__PURE__ */ n("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "baseline" }, children: [
              /* @__PURE__ */ t("p", { style: { margin: 0, fontFamily: e.sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: e.inkMuted }, children: "Order" }),
              /* @__PURE__ */ t("p", { style: { margin: 0, fontFamily: e.serif, fontSize: 18, color: e.gold, fontWeight: 600 }, children: W(a.total) })
            ] }),
            /* @__PURE__ */ t("p", { style: { margin: "8px 0 0", fontFamily: e.sans, fontSize: 14, color: e.ink, wordBreak: "break-all" }, children: a._id }),
            /* @__PURE__ */ n("p", { style: { margin: "12px 0 0", fontFamily: e.sans, fontSize: 14, color: e.roseDeep }, children: [
              "Status: ",
              /* @__PURE__ */ t("strong", { style: { color: e.ink }, children: a.status })
            ] })
          ]
        },
        a._id
      )) })
    ] }),
    /* @__PURE__ */ t(k, {})
  ] });
}, J = () => {
  const { user: i, checkAuth: r, updateUser: s, loading: c } = z(), [d, a] = x("en"), [h, u] = x(!1), [m, o] = x(!1), [S, p] = x("collect");
  v(() => {
    r();
  }, [r]), v(() => {
    i && (a(i.language || "en"), u(!!i.agreedToMarketingEmails), o(!!i.agreedToSmsMarketing), p(i.collectTax));
  }, [i]);
  const l = async (y) => {
    y.preventDefault(), i?._id && await s(i._id, { language: d, agreedToMarketingEmails: h, agreedToSmsMarketing: m, collectTax: S });
  }, g = { fontFamily: e.sans, fontSize: 14, color: e.ink, display: "grid", gap: 8 }, D = { ...b, cursor: "pointer" };
  return /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t("section", { style: { padding: "48px 28px 80px" }, children: /* @__PURE__ */ n(
      "div",
      {
        style: {
          maxWidth: 560,
          margin: "0 auto",
          background: e.white,
          borderRadius: e.radiusLg,
          padding: "40px 36px",
          border: `1px solid ${e.line}`,
          boxShadow: e.shadowSm
        },
        children: [
          /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: 32, fontWeight: 600, margin: "0 0 8px" }, children: "Preferences" }),
          /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, fontSize: 14, color: e.inkMuted, margin: "0 0 28px" }, children: "Fine-tune how we stay in touch and handle tax." }),
          /* @__PURE__ */ n("form", { onSubmit: (y) => {
            l(y);
          }, style: { display: "grid", gap: 22 }, children: [
            /* @__PURE__ */ n("label", { style: g, children: [
              "Language",
              /* @__PURE__ */ t("input", { value: d, onChange: (y) => a(y.target.value), style: b })
            ] }),
            /* @__PURE__ */ n("label", { style: { ...g, gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ t("input", { type: "checkbox", checked: h, onChange: (y) => u(y.target.checked), style: { width: 18, height: 18 } }),
              "Email editorial and offers"
            ] }),
            /* @__PURE__ */ n("label", { style: { ...g, gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 12 }, children: [
              /* @__PURE__ */ t("input", { type: "checkbox", checked: m, onChange: (y) => o(y.target.checked), style: { width: 18, height: 18 } }),
              "SMS reminders and launches"
            ] }),
            /* @__PURE__ */ n("label", { style: g, children: [
              "Tax preference",
              /* @__PURE__ */ n(
                "select",
                {
                  value: S,
                  onChange: (y) => p(y.target.value),
                  style: D,
                  children: [
                    /* @__PURE__ */ t("option", { value: "collect", children: "Collect" }),
                    /* @__PURE__ */ t("option", { value: "dont_collect", children: "Do not collect" }),
                    /* @__PURE__ */ t("option", { value: "collect_unless_exempt", children: "Collect unless exempt" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "submit",
                disabled: c,
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 8,
                  background: c ? "#c4bbb8" : `linear-gradient(135deg, ${e.ink} 0%, #3d2f33 100%)`,
                  color: e.white,
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: 999,
                  cursor: c ? "wait" : "pointer"
                },
                children: c ? "Saving…" : "Save preferences"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ t(k, {})
  ] });
}, U = () => {
  const { id: i } = N(), { storeFrontMeta: r } = T(), { productDetail: s, fetchProductById: c } = P(), { variants: d, fetchVariantsByProductId: a } = R(), { createCartEntry: h } = C(), [u, m] = x(!1);
  v(() => {
    i && (c(i), a(i));
  }, [c, a, i]);
  const o = B(() => d[0] ?? s?.variantDetails?.[0], [s?.variantDetails, d]), S = async () => {
    if (!(!r?.storeId || !o))
      try {
        m(!0), await h({ storeId: r.storeId, productVariantId: o._id, quantity: 1 }, o);
      } finally {
        m(!1);
      }
  };
  return i ? /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t("section", { style: { maxWidth: 1040, margin: "0 auto", padding: "48px 28px 80px" }, children: /* @__PURE__ */ n(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 48,
          alignItems: "start"
        },
        children: [
          /* @__PURE__ */ t(
            "div",
            {
              style: {
                borderRadius: e.radiusLg,
                overflow: "hidden",
                aspectRatio: "3 / 4",
                maxHeight: 520,
                background: `
                radial-gradient(circle at 30% 20%, rgba(255,255,255,0.85) 0%, transparent 45%),
                linear-gradient(145deg, ${e.blush} 0%, #dcc9ce 35%, ${e.goldSoft} 100%)
              `,
                boxShadow: e.shadow,
                border: `1px solid ${e.line}`
              }
            }
          ),
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ t(
              "p",
              {
                style: {
                  fontFamily: e.sans,
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: e.roseDeep,
                  margin: "0 0 12px",
                  fontWeight: 600
                },
                children: "Signature piece"
              }
            ),
            /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 600, margin: "0 0 20px", lineHeight: 1.15 }, children: s?.title || "Preparing your selection…" }),
            /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, fontSize: 16, lineHeight: 1.75, color: e.inkMuted, margin: "0 0 28px" }, children: s?.description }),
            /* @__PURE__ */ t("p", { style: { fontFamily: e.serif, fontSize: 32, color: e.gold, margin: "0 0 28px", fontWeight: 600 }, children: W(o?.price ?? s?.price ?? 0) }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                disabled: !o || u,
                onClick: () => {
                  S();
                },
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  background: o && !u ? `linear-gradient(135deg, ${e.ink} 0%, #3d2f33 100%)` : "#c4bbb8",
                  color: e.white,
                  border: "none",
                  padding: "18px 40px",
                  borderRadius: 999,
                  cursor: o && !u ? "pointer" : "not-allowed",
                  boxShadow: o && !u ? e.shadow : "none"
                },
                children: u ? "Adding…" : "Add to bag"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ t(k, {})
  ] }) : null;
}, K = () => {
  const { user: i, checkAuth: r, updateUser: s, loading: c } = z(), d = I(), [a, h] = x(""), [u, m] = x(""), [o, S] = x("");
  if (v(() => {
    r();
  }, [r]), v(() => {
    i && (h(i.firstName || ""), m(i.lastName || ""), S(i.phoneNumber || ""));
  }, [i]), !i)
    return /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
      /* @__PURE__ */ t(w, {}),
      /* @__PURE__ */ n("section", { style: { padding: "48px 28px", maxWidth: 480, margin: "0 auto", textAlign: "center" }, children: [
        /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, fontSize: 16, color: e.inkMuted }, children: "Please sign in to view your profile." }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => d("/auth/login"),
            style: {
              marginTop: 20,
              fontFamily: e.sans,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: `linear-gradient(135deg, ${e.rose} 0%, ${e.roseDeep} 100%)`,
              color: e.white,
              border: "none",
              padding: "14px 28px",
              borderRadius: 999,
              cursor: "pointer"
            },
            children: "Sign in"
          }
        )
      ] }),
      /* @__PURE__ */ t(k, {})
    ] });
  const p = async (l) => {
    l.preventDefault(), await s(i._id, { firstName: a, lastName: u, phoneNumber: o });
  };
  return /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t("section", { style: { padding: "48px 28px 80px" }, children: /* @__PURE__ */ n(
      "div",
      {
        style: {
          maxWidth: 520,
          margin: "0 auto",
          background: e.white,
          borderRadius: e.radiusLg,
          padding: "40px 36px",
          border: `1px solid ${e.line}`,
          boxShadow: e.shadowSm
        },
        children: [
          /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: 32, fontWeight: 600, margin: "0 0 8px" }, children: "Profile" }),
          /* @__PURE__ */ t("p", { style: { fontFamily: e.sans, fontSize: 14, color: e.inkMuted, margin: "0 0 28px" }, children: "Keep your details current for a seamless checkout." }),
          /* @__PURE__ */ n("form", { onSubmit: (l) => {
            p(l);
          }, style: { display: "grid", gap: 18 }, children: [
            /* @__PURE__ */ t("input", { value: a, onChange: (l) => h(l.target.value), placeholder: "First name", style: b }),
            /* @__PURE__ */ t("input", { value: u, onChange: (l) => m(l.target.value), placeholder: "Last name", style: b }),
            /* @__PURE__ */ t("input", { value: o, onChange: (l) => S(l.target.value), placeholder: "Phone number", style: b }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "submit",
                disabled: c,
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 8,
                  background: c ? "#c4bbb8" : `linear-gradient(135deg, ${e.rose} 0%, ${e.roseDeep} 100%)`,
                  color: e.white,
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: 999,
                  cursor: c ? "wait" : "pointer"
                },
                children: c ? "Saving…" : "Save changes"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ t(k, {})
  ] });
}, Q = () => {
  const { signup: i, loading: r } = z(), { storeFrontMeta: s } = T(), c = I(), [d, a] = x(""), [h, u] = x(""), [m, o] = x(""), [S, p] = x(""), l = async (g) => {
    g.preventDefault(), s?.storeId && (await i({ storeId: s.storeId, firstName: d, lastName: h, email: m, password: S }), c("/"));
  };
  return /* @__PURE__ */ n("main", { style: { minHeight: "100vh", background: e.cream, color: e.ink }, children: [
    /* @__PURE__ */ t(w, {}),
    /* @__PURE__ */ t("section", { style: { padding: "48px 28px 80px" }, children: /* @__PURE__ */ n(
      "div",
      {
        style: {
          maxWidth: 440,
          margin: "0 auto",
          background: e.white,
          borderRadius: e.radiusLg,
          padding: "44px 40px",
          border: `1px solid ${e.line}`,
          boxShadow: e.shadow
        },
        children: [
          /* @__PURE__ */ t(
            "p",
            {
              style: {
                fontFamily: e.sans,
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: e.roseDeep,
                margin: "0 0 10px",
                fontWeight: 600
              },
              children: "Join the atelier"
            }
          ),
          /* @__PURE__ */ t("h1", { style: { fontFamily: e.serif, fontSize: 32, fontWeight: 600, margin: "0 0 28px" }, children: "Create account" }),
          /* @__PURE__ */ n("form", { onSubmit: (g) => {
            l(g);
          }, style: { display: "grid", gap: 18 }, children: [
            /* @__PURE__ */ t("input", { value: d, onChange: (g) => a(g.target.value), placeholder: "First name", style: b }),
            /* @__PURE__ */ t("input", { value: h, onChange: (g) => u(g.target.value), placeholder: "Last name", style: b }),
            /* @__PURE__ */ t("input", { value: m, onChange: (g) => o(g.target.value), placeholder: "Email", style: b }),
            /* @__PURE__ */ t("input", { value: S, onChange: (g) => p(g.target.value), type: "password", placeholder: "Password", style: b }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "submit",
                disabled: r,
                style: {
                  fontFamily: e.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 8,
                  background: r ? "#c4bbb8" : `linear-gradient(135deg, ${e.ink} 0%, #3d2f33 100%)`,
                  color: e.white,
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: 999,
                  cursor: r ? "wait" : "pointer",
                  boxShadow: r ? "none" : e.shadow
                },
                children: r ? "Please wait…" : "Create account"
              }
            )
          ] }),
          /* @__PURE__ */ n("p", { style: { fontFamily: e.sans, fontSize: 14, marginTop: 24, color: e.inkMuted }, children: [
            "Already a member?",
            " ",
            /* @__PURE__ */ t(f, { to: "/auth/login", style: { color: e.roseDeep, fontWeight: 600 }, children: "Sign in" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ t(k, {})
  ] });
}, ne = {
  id: "beauty",
  Header: w,
  Footer: k,
  HeroSection: L,
  TestimonialsSection: H,
  NewArrivalsSection: A,
  HomePage: V,
  ProductPage: U,
  LoginPage: Y,
  SignupPage: Q,
  ProfilePage: K,
  OrdersPage: G,
  PreferencesPage: J,
  CartPage: j
};
export {
  ne as beautyThemeContract,
  ne as default
};
//# sourceMappingURL=theme.js.map
