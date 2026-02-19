import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Store, BarChart3 } from "lucide-react";
import axios from "../../config/axios";
import "./ClientDetail.css";
import "./ClientList.css";

interface ClientStats {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string | null;
    assignedSupportDeveloper?: { username: string; email: string } | null;
  };
  stores: {
    _id: string;
    storeName: string;
    storeCode?: string;
    storeDescription?: string;
    createdAt?: string;
    updatedAt?: string;
  }[];
  totals: {
    storesCount: number;
    ordersCount: number;
    productsSold: number;
    totalRevenue: number;
  };
  ordersByMonth: { month: string; count: number }[];
  productsByStore: { storeId: string; storeName: string; productsSold: number }[];
  revenueByStore: { storeId: string; storeName: string; revenue: number; ordersCount: number }[];
}

const formatStoreDisplay = (s: { storeName: string; storeCode?: string; _id: string }) =>
  s.storeCode ? `${s.storeName} ${s.storeCode}/${s._id}` : s.storeName;

const ClientDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = location.pathname.match(/\/admin\/client\/([^/]+)/);
  const userId = match?.[1] ?? "";
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Invalid client ID");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        try {
          const res = await axios.get(`/client-user-stats/${userId}`);
          setStats(res.data?.data || null);
        } catch (statsErr: any) {
          if (statsErr.response?.status === 404 || statsErr.response?.status === 403) {
            const [userRes, storesRes] = await Promise.allSettled([
              axios.get(`/user/${userId}`),
              axios.get(`/stores/user/${userId}`),
            ]);
            const userData = userRes.status === "fulfilled" ? userRes.value?.data?.data : null;
            const storesData = storesRes.status === "fulfilled" ? storesRes.value?.data?.data || [] : [];
            if (userData) {
              const storesList = Array.isArray(storesData) ? storesData : [];
              setStats({
                user: {
                  _id: userData._id,
                  name: userData.name,
                  email: userData.email,
                  role: typeof userData.role === "object" ? userData.role?.name || "" : userData.role,
                  status: userData.status,
                  createdAt: userData.createdAt,
                  updatedAt: userData.updatedAt,
                  lastLogin: userData.lastLogin,
                  assignedSupportDeveloper: userData.assignedSupportDeveloper ?? null,
                },
                stores: storesList.map((s: any) => ({
                  _id: s._id,
                  storeName: s.storeName,
                  storeCode: s.storeCode,
                  storeDescription: s.storeDescription,
                  createdAt: s.createdAt,
                  updatedAt: s.updatedAt,
                })),
                totals: {
                  storesCount: storesList.length,
                  ordersCount: 0,
                  productsSold: 0,
                  totalRevenue: 0,
                },
                ordersByMonth: [],
                productsByStore: storesList.map((s: any) => ({
                  storeId: String(s._id),
                  storeName: s.storeCode ? `${s.storeName} ${s.storeCode}/${s._id}` : s.storeName,
                  productsSold: 0,
                })),
                revenueByStore: storesList.map((s: any) => ({
                  storeId: String(s._id),
                  storeName: s.storeCode ? `${s.storeName} ${s.storeCode}/${s._id}` : s.storeName,
                  revenue: 0,
                  ordersCount: 0,
                })),
              });
            } else {
              setError("Client not found");
            }
          } else {
            setError(statsErr.response?.data?.message || "Failed to load client");
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load client");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return <div className="client-list-page"><div className="loading">Loading...</div></div>;
  if (error || !stats) return <div className="client-list-page"><div className="error-alert">{error || "Client not found"}</div></div>;

  const u = stats.user;

  return (
    <div className="client-list-page">
      <div className="client-list-card">
        <div className="client-list-card-header" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            className="btn"
            onClick={() => {
              sessionStorage.setItem("activeMenu", "Client List");
              navigate("/admin/dashboard", { replace: true });
            }}
            style={{ padding: 8 }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="client-list-title">{u.name}</h2>
            <p className="client-list-subtitle">{u.email}</p>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Stores</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stats.stores.map((s) => (
              <div
                key={s._id}
                style={{
                  padding: 16,
                  border: "1px solid var(--z-border)",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{formatStoreDisplay(s)}</strong>
                  {s.storeDescription && <p style={{ margin: "8px 0 0", color: "var(--z-text-muted)", fontSize: 14 }}>{s.storeDescription}</p>}
                </div>
                <button
                  className="btn primary"
                  onClick={() => navigate(`/admin/client/${userId}/analytics?store=${s._id}`)}
                >
                  <BarChart3 size={16} /> Analytics
                </button>
              </div>
            ))}
            {stats.stores.length === 0 && <p style={{ color: "var(--z-text-muted)" }}>No stores</p>}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ padding: 16, background: "var(--z-surface)", borderRadius: 8, minWidth: 140 }}>
              <div style={{ fontSize: 12, color: "var(--z-text-muted)" }}>Total Orders</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totals.ordersCount}</div>
            </div>
            <div style={{ padding: 16, background: "var(--z-surface)", borderRadius: 8, minWidth: 140 }}>
              <div style={{ fontSize: 12, color: "var(--z-text-muted)" }}>Products Sold</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totals.productsSold}</div>
            </div>
            <div style={{ padding: 16, background: "var(--z-surface)", borderRadius: 8, minWidth: 140 }}>
              <div style={{ fontSize: 12, color: "var(--z-text-muted)" }}>Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>₹{stats.totals.totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              className="btn primary"
              onClick={() => navigate(`/admin/client/${userId}/analytics`)}
            >
              <BarChart3 size={16} /> View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
