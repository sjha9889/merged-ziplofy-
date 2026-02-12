import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Mail, Shield, Hash, Layers } from "lucide-react";
import axios from "../../config/axios";
import { useAdminAuth } from "../../contexts/admin-auth.context";
import "./Profile.css";

interface UserDetails {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  roleName?: string;
  roleId?: string;
  roleLevel?: number;
  superAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  [key: string]: unknown;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAdminAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/auth/me");
        const data = res.data?.data || res.data || {};
        setUserDetails(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
        setUserDetails(authUser ? {
          name: authUser.name,
          email: authUser.email,
          roleName: authUser.roleName,
          roleId: authUser.roleId,
          roleLevel: authUser.roleLevel,
        } : null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") {
      if (value && typeof value === "object" && "name" in value) return String((value as { name?: string }).name ?? JSON.stringify(value));
      return JSON.stringify(value);
    }
    const str = String(value);
    const date = new Date(str);
    if (!isNaN(date.getTime())) return date.toLocaleString();
    return str;
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/_/g, " ")
      .trim();
  };

  const excludedKeys = ["password", "editOtp", "__v"];


  const accountFields = [
    { key: "name", label: "Name", icon: User },
    { key: "email", label: "Email", icon: Mail },
    { key: "role", label: "Role", icon: Shield },
    { key: "roleName", label: "Role Name", icon: Shield },
    { key: "roleId", label: "Role ID", icon: Hash },
    { key: "roleLevel", label: "Role Level", icon: Layers },
    { key: "superAdmin", label: "Super Admin", icon: Shield },
    { key: "createdAt", label: "Created At", icon: User },
    { key: "updatedAt", label: "Updated At", icon: User },
  ];

  const getDisplayValue = (key: string) => {
    const val = userDetails[key as keyof UserDetails];
    if (key === "role" && !val) return userDetails.roleName;
    if (key === "roleName" && !val) return userDetails.role;
    if (val !== undefined && val !== null) return val;
    return null;
  };

  const allDetailEntries = Object.entries(userDetails || {}).filter(
    ([key]) => !excludedKeys.includes(key)
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate("/admin/dashboard")}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1 className="profile-title">Profile</h1>
        <nav className="profile-breadcrumbs">Dashboard &gt; Profile</nav>
      </div>

      {loading ? (
        <div className="profile-loading">Loading profile...</div>
      ) : error && !userDetails ? (
        <div className="profile-error">{error}</div>
      ) : userDetails ? (
        <div className="profile-content">
          <div className="profile-card profile-card-main">
            <div className="profile-avatar-large">
              {(userDetails.name || "U").charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-display-name">
              {userDetails.name || "—"}
            </h2>
            <p className="profile-display-email">
              {userDetails.email || "—"}
            </p>
          </div>

          <div className="profile-card">
            <h3 className="profile-section-title">Account Details</h3>
            <div className="profile-details-grid">
              {accountFields.map(({ key, label, icon: Icon }) => {
                const displayValue = getDisplayValue(key);
                if (displayValue === null) return null;
                return (
                  <div key={key} className="profile-detail-item">
                    <div className="profile-detail-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <label>{label}</label>
                      <p>{formatValue(displayValue)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {allDetailEntries.length > 0 && (
            <div className="profile-card">
              <h3 className="profile-section-title">All Details</h3>
              <div className="profile-details-list">
                {allDetailEntries.map(([key, value]) => (
                  <div key={key} className="profile-detail-row">
                    <span className="profile-detail-label">
                      {formatLabel(key)}
                    </span>
                    <span className="profile-detail-value">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
