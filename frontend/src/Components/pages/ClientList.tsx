import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./ClientList.css";

// ---------------------- Types ----------------------
interface Client {
  _id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
  totalPurchases: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ClientModalProps {
  client?: Client | null;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  mode?: "add" | "edit";
}

interface ClientFormData {
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
}

// ---------------------- Client Service ----------------------
const clientService = {
  getClients: async (token: string, params: Record<string, any> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/clients?${queryString}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  },

  getClient: async (token: string, id: string) => {
    const response = await fetch(`/api/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch client");
    return response.json();
  },

  createClient: async (token: string, clientData: ClientFormData) => {
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create client");
    }

    return response.json();
  },

  updateClient: async (
    token: string,
    id: string,
    clientData: ClientFormData
  ) => {
    const response = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update client");
    }

    return response.json();
  },

  deleteClient: async (token: string, id: string) => {
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete client");
    }

    return response.json();
  },
};

// ---------------------- Client Modal ----------------------
const ClientModal: React.FC<ClientModalProps> = ({
  client,
  onClose,
  onSubmit,
  mode = "add",
}) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: client?.name || "",
    email: client?.email || "",
    status: client?.status || "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{mode === "add" ? "Add New Client" : "Edit Client"}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Client Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {errors.submit && <div className="error">{errors.submit}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn primary">
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                ? "Add Client"
                : "Update Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------- Client List ----------------------
const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const getAuthToken = () => localStorage.getItem("authToken") || "";

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) throw new Error("Authentication required");

      const params: Record<string, any> = {
        page,
        limit: pagination.limit,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "All") params.status = statusFilter;

      const response = await clientService.getClients(token, params);

      setClients(response.data);
      setPagination({
        page: response.currentPage,
        limit: pagination.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchClients(1), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const handleAddClient = async (clientData: ClientFormData) => {
    const token = getAuthToken();
    await clientService.createClient(token, clientData);
    fetchClients(pagination.page);
  };

  const handleEditClient = async (clientData: ClientFormData) => {
    if (!editingClient) return;
    const token = getAuthToken();
    await clientService.updateClient(token, editingClient._id, clientData);
    setEditingClient(null);
    fetchClients(pagination.page);
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const token = getAuthToken();
      await clientService.deleteClient(token, id);
      fetchClients(pagination.page);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) fetchClients(newPage);
  };

  return (
    <div className="main-content">
      <div className="page">
        <div className="page-header">
          <h2>Client List</h2>
          <div className="header-actions">
            <input
              type="search"
              placeholder="Search clients..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <button className="btn primary" onClick={() => setShowModal(true)}>
              Add New Client
            </button>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="table-card">
          {loading ? (
            <div className="loading">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="no-data">
              {searchTerm || statusFilter !== "All"
                ? "No clients match your search criteria"
                : "No clients found. Add your first client!"}
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Client Name</th>
                    <th style={{ textAlign: "left" }}>Email</th>
                    <th style={{ textAlign: "left" }}>Total Purchases</th>
                    <th style={{ textAlign: "left" }}>Status</th>
                    <th style={{ textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td style={{ textAlign: "left" }}>{client.name}</td>
                      <td style={{ textAlign: "left" }}>{client.email}</td>
                      <td style={{ textAlign: "left" }}>
                        ${client.totalPurchases.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <span
                          className={`status-badge ${client.status.toLowerCase()}`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <button
                          className="btn view"
                          style={{ marginRight: "6px" }}
                          onClick={() => openEditModal(client)}
                        >
                          View
                        </button>
                        <button
                          className="btn edit"
                          onClick={() => openEditModal(client)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn delete"
                          onClick={() => handleDeleteClient(client._id)}
                          style={{ marginLeft: "6px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {showModal && (
          <ClientModal
            client={editingClient}
            onClose={closeModal}
            onSubmit={editingClient ? handleEditClient : handleAddClient}
            mode={editingClient ? "edit" : "add"}
          />
        )}
      </div>
    </div>
  );
};

export default ClientList;
