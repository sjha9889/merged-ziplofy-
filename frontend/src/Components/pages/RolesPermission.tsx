import React, { useState } from "react";
import "./RolesPermission.css";

// Define a Role type
interface Role {
  id: number;
  name: string;
  description: string;
}

const RolesPermission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showEntries, setShowEntries] = useState<number>(10);

  const roles: Role[] = [
    { id: 1, name: "super-admin", description: "Full access to all features" },
    { id: 2, name: "admin", description: "Manage users and content" },
    { id: 3, name: "developer", description: "Code and technical tasks" },
    { id: 4, name: "support", description: "Customer support team" },
    { id: 5, name: "viewer", description: "Read-only access" },
  ];

  // Optional: filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <div className="roles-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 className="roles-title">Roles</h1>
          <div className="header-actions">
            <button className="btn-icon settings">
              <span className="icon">⚙️</span>
            </button>
            <button className="btn-icon add">
              <span className="icon plus">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "24px" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Top Controls */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ position: "relative" }}>
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Roles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: "40px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    width: "320px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <button
                className="btn-icon add"
                style={{ padding: "8px 16px", width: "auto", gap: "8px" }}
              >
                <span className="icon plus">+</span>
                Add New Roles
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111827",
                      width: "80px",
                    }}
                  >
                    S.No.
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Role Name
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, index) => (
                  <tr
                    key={role.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      textAlign: "left",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {role.id}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {role.name}
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      {role.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Controls */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#374151" }}>Show</span>
                <div style={{ position: "relative" }}>
                  <select
                    value={showEntries}
                    onChange={(e) => setShowEntries(Number(e.target.value))}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "4px 24px 4px 12px",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Pagination */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#6b7280",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ◀ Prev
                </button>
                <button
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    backgroundColor: "#fb923c",
                    color: "white",
                    borderRadius: "4px",
                    border: "none",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  1
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#6b7280",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermission;
