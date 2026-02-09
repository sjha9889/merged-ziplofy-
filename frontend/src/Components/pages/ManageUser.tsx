import React, { useState, useEffect } from "react";
import "./ManageUser.css";
import { PermissionGate } from "../PermissionGate";

// Define a User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "manager" | "admin";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

interface Filters {
  role: "all" | "user" | "manager" | "admin";
  status: "all" | "active" | "inactive" | "suspended";
}

const ManageUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    role: "all",
    status: "all",
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const queryParams = new URLSearchParams({
        search: searchTerm,
        role: filters.role,
        status: filters.status,
      }).toString();

      const response = await fetch(`/api/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchUsers(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">
          Manage Users <span className="count-badge">{users.length}</span>
        </h2>
        <div className="header-actions">
          <button className="btn ghost">
            <span className="icon">⚙</span> Export
          </button>
          <PermissionGate action="upload" section="User Management" subsection="Manage User">
            <button className="btn primary">Add User</button>
          </PermissionGate>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
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
            className="search-input"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) =>
            setFilters({ ...filters, role: e.target.value as Filters["role"] })
          }
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
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

      <div className="card">
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
                  <div className="empty">
                    <div className="empty-icon">📄</div>
                    <div className="empty-text">No users found</div>
                  </div>
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
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
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
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <PermissionGate action="edit" section="User Management" subsection="Manage User">
                        <button className="btn small ghost">Edit</button>
                      </PermissionGate>
                      <PermissionGate action="edit" section="User Management" subsection="Manage User">
                        <button
                          className="btn small danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
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
    </div>
  );
};

export default ManageUser;
