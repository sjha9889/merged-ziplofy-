import React, { useState, useEffect } from "react";
import "./Domain.css";
import { Edit3, Trash2, RefreshCw, Maximize2, Globe, Search } from "lucide-react";

// Define Domain type
interface DomainType {
  id: number;
  leadId: string;
  domain: string;
  selection: string;
  status: string;
  created: string;
}

const Domain: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("09/04/2025 - 09/10/2025");
  const [sortBy, setSortBy] = useState<string>("Sort");
  const [selectedDomains, setSelectedDomains] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [domains, setDomains] = useState<DomainType[]>([
    {
      id: 1,
      leadId: "ziplofy_17498066636673",
      domain: "xyx.com",
      selection: "",
      status: "Pending",
      created: "19 Jul 2025, 06:49 AM",
    },
    {
      id: 2,
      leadId: "lead_1015",
      domain: "delta15.app",
      selection: "",
      status: "Pending",
      created: "15 Jul 2025, 04:20 AM",
    },
    // ... rest of your domains
  ]);

  const filteredDomains = domains.filter(
    (domain) =>
      domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.leadId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedDomains(filteredDomains.map((domain) => domain.id));
    } else {
      setSelectedDomains([]);
    }
  };

  const handleSelectDomain = (id: number) => {
    const updatedSelection = selectedDomains.includes(id)
      ? selectedDomains.filter((domainId) => domainId !== id)
      : [...selectedDomains, id];

    setSelectedDomains(updatedSelection);
    setSelectAll(updatedSelection.length === filteredDomains.length);
  };

  useEffect(() => {
    if (filteredDomains.length > 0) {
      setSelectAll(
        selectedDomains.length === filteredDomains.length &&
          filteredDomains.every((domain) => selectedDomains.includes(domain.id))
      );
    }
  }, [selectedDomains, filteredDomains]);

  const handleEdit = (id: number) => {
    console.log("Edit domain:", id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this domain request?")) {
      setDomains(domains.filter((domain) => domain.id !== id));
      setSelectedDomains(selectedDomains.filter((domainId) => domainId !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setDomains(
      domains.map((domain) =>
        domain.id === id ? { ...domain, status: newStatus } : domain
      )
    );
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="domain-container">
      <div className="domain-header">
        <div className="header-left">
          <h1>Domain Request</h1>
          <span className="count-badge">{domains.length}</span>
        </div>
        <div className="header-right">
          <button className="refresh-btn">
            <RefreshCw size={18} />
          </button>
          <button className="expand-btn">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="domain-controls">
        <div className="controls-left">
          <div className="sort-dropdown">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Sort">⚏ Sort</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="date-picker">
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </div>
        <div className="controls-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Domain Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="search-icon" />
          </div>
        </div>
      </div>

      <div className="domain-table-container">
        <table className="domain-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="checkbox-input"
                />
              </th>
              <th></th>
              <th>Lead ID</th>
              <th>Domain</th>
              <th>Selection</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDomains.map((domain) => (
              <tr
                key={domain.id}
                className={selectedDomains.includes(domain.id) ? "selected-row" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(domain.id)}
                    onChange={() => handleSelectDomain(domain.id)}
                    className="checkbox-input"
                  />
                </td>
                <td>
                  <Globe size={16} className="globe-icon" />
                </td>
                <td>{domain.leadId}</td>
                <td>{domain.domain}</td>
                <td>{domain.selection}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(domain.status)}`}>
                    {domain.status}
                  </span>
                </td>
                <td>{domain.created}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(domain.id)}
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(domain.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Domain;
