import React, { useState, useEffect } from "react";
import { Search, Download, Plus, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../../config/axios";
import "./ManageUser.css";
import { PermissionGate } from "../PermissionGate";
import { EditVerificationModal } from "../EditVerificationModal";
import { usePermissions } from "../../hooks/usePermissions";

// Define a User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

interface Role {
  _id: string;
  name: string;
  description?: string;
}

interface Filters {
  role: string;
  status: "all" | "active" | "inactive" | "suspended";
}

const ManageUser: React.FC = () => {
  const { hasEditPermission } = usePermissions();
  const canEditManageUser = hasEditPermission("User Management", "Manage User");
  const isSuperAdmin =
    localStorage.getItem("isSuperAdmin") === "true" ||
    localStorage.getItem("userRole") === "super-admin";

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    role: "all",
    status: "all",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", status: "active" as const });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<{ userId: string; data: Record<string, unknown> } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ userId: string; newStatus: string } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: "", email: "", password: "", role: "" });
  const [addUserSubmitting, setAddUserSubmitting] = useState(false);
  const [addUserError, setAddUserError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/roles");
      const rolesData = response.data?.data || response.data || [];
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      const params: Record<string, string> = {
        search: searchTerm,
        role: filters.role,
        status: filters.status,
        limit: "100",
      };
      const response = await axios.get("/user", { params });
      const data = response.data?.data || [];
      // Normalize role: backend returns populated { _id, name } or ObjectId
      const normalized = (Array.isArray(data) ? data : []).map((u: any) => ({
        ...u,
        role:
          typeof u.role === "object" && u.role?.name
            ? u.role.name
            : typeof u.role === "string"
            ? u.role
            : "",
      }));
      setUsers(normalized);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const executeStatusChangeWithOtp = async (userId: string, newStatus: string, otp: string) => {
    try {
      await axios.put(`/user/${userId}`, { status: newStatus, editOtp: otp });
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setPendingStatusChange({ userId, newStatus });
    setShowOtpModal(true);
  };

  const executeDeleteWithOtp = async (userId: string, otp: string) => {
    try {
      await axios.delete(`/user/${userId}`, {
        data: { editOtp: otp },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setPendingDeleteId(userId);
    setShowOtpModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditError("");
  };

  const submitEditWithOtp = async (otp: string) => {
    if (!pendingEditData) return;
    setEditSubmitting(true);
    setEditError("");
    try {
      await axios.put(`/user/${pendingEditData.userId}`, {
        ...pendingEditData.data,
        editOtp: otp || undefined,
      });
      setPendingEditData(null);
      closeEditModal();
      fetchUsers();
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update user");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const payload = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      status: editForm.status,
    };
    setPendingEditData({ userId: editingUser._id, data: payload });
    setShowOtpModal(true);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserSubmitting(true);
    setAddUserError("");
    try {
      await axios.post("/user", {
        name: addUserForm.name,
        email: addUserForm.email,
        password: addUserForm.password,
        role: addUserForm.role,
      });
      setShowAddUserModal(false);
      setAddUserForm({ name: "", email: "", password: "", role: "" });
      fetchUsers();
      toast.success("User added successfully");
    } catch (err: any) {
      setAddUserError(err.response?.data?.message || "Failed to add user");
    } finally {
      setAddUserSubmitting(false);
    }
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setAddUserForm({ name: "", email: "", password: "", role: "" });
    setAddUserError("");
  };

  const handleOtpVerified = (otp: string) => {
    setShowOtpModal(false);
    if (pendingEditData) {
      submitEditWithOtp(otp);
    } else if (pendingDeleteId) {
      executeDeleteWithOtp(pendingDeleteId, otp);
      setPendingDeleteId(null);
    } else if (pendingStatusChange) {
      executeStatusChangeWithOtp(pendingStatusChange.userId, pendingStatusChange.newStatus, otp);
      setPendingStatusChange(null);
    }
  };

  const handleExport = () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }
    const headers = ["Name", "Email", "Role", "Status", "Created Date"];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.role?.replace(/-/g, " ") || "",
      u.status,
      new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported successfully");
  };

  if (loading) {
    return (
      <div className="manage-user-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="manage-user-page">
      <div className="page-header">
        <h2>
          Manage Users <span className="count-badge">{users.length}</span>
        </h2>
        <div className="header-actions">
          <button type="button" className="btn ghost" onClick={handleExport}>
            <Download size={16} />
            Export
          </button>
          {isSuperAdmin && (
            <button className="btn primary" onClick={() => setShowAddUserModal(true)}>
              <Plus size={16} />
              Add User
            </button>
          )}
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            className="search-input"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
        </select>

        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value as Filters["status"],
            })
          }
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={7}>
                  <div className="no-data">No users found</div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`role-badge role-${user.role?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "default"}`}
                    >
                      {user.role?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || user.role}
                    </span>
                  </td>
                  <td>
                    {canEditManageUser ? (
                      <select
                        className={`status-select status-${user.status}`}
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                      </span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <PermissionGate action="edit" section="User Management" subsection="Manage User">
                        <button
                          className="btn edit"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                      </PermissionGate>
                      <PermissionGate action="edit" section="User Management" subsection="Manage User">
                        <button
                          className="btn delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="close-btn" onClick={closeEditModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleEditUser}>
              {editError && (
                <div className="form-error">{editError}</div>
              )}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  required
                >
                  {roles
                    .filter((r) => !r.name.toLowerCase().includes("super-admin"))
                    .map((role) => (
                      <option key={role._id} value={role.name}>
                        {role.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value as "active" | "inactive" | "suspended" })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn cancel" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={editSubmitting}>
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal - Super-admin only */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={closeAddUserModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add User</h3>
              <button className="close-btn" onClick={closeAddUserModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleAddUser}>
              {addUserError && (
                <div className="form-error">{addUserError}</div>
              )}
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                  required
                >
                  <option value="">Select role</option>
                  <option value="support-admin">Support Admin</option>
                  <option value="developer-admin">Developer Admin</option>
                  <option value="client-admin">Client Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn cancel" onClick={closeAddUserModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={addUserSubmitting}>
                  {addUserSubmitting ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EditVerificationModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setPendingEditData(null);
          setPendingDeleteId(null);
          setPendingStatusChange(null);
        }}
        onVerified={handleOtpVerified}
        requireVerification={true}
      />
    </div>
  );
};

export default ManageUser;
