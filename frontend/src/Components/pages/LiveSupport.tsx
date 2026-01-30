import React, { useState } from "react";
import "./HelpCenter.css";

// Define a Chat type
interface Chat {
  id: number;
  name: string;
  email: string;
  category: string;
  status: string;
  created: string;
}

const LiveSupport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showEntries, setShowEntries] = useState<number>(10);

  const chats: Chat[] = [
    {
      id: 1,
      name: "shishir",
      email: "info@techwyzo.in",
      category: "Domain",
      status: "Resolved",
      created: "21 Jul 2025 05:00 PM",
    },
    {
      id: 2,
      name: "shishir",
      email: "info@techwyzo.in",
      category: "Domain",
      status: "Resolved",
      created: "19 Jul 2025 02:04 PM",
    },
  ];

  const totalNewChats = chats.length;

  // Optional: filter chats based on search term
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="help-center-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="title">Help Center</h1>
            <span className="chat-count">Total New Chat: {totalNewChats}</span>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
              </svg>
            </button>
            <button className="icon-btn">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search */}
        <div className="search-section">
          <div className="search-container">
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
              placeholder="Search Leads"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-number">#</th>
                <th className="col-name">Name</th>
                <th className="col-email">Email</th>
                <th className="col-category">Category</th>
                <th className="col-status">Status</th>
                <th className="col-created">Created</th>
                <th className="col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredChats.map((chat) => (
                <tr key={chat.id}>
                  <td className="col-number">{chat.id}</td>
                  <td className="col-name">{chat.name}</td>
                  <td className="col-email">{chat.email}</td>
                  <td className="col-category">{chat.category}</td>
                  <td className="col-status">
                    <span className={`status-badge ${chat.status.toLowerCase()}`}>
                      {chat.status}
                    </span>
                  </td>
                  <td className="col-created">{chat.created}</td>
                  <td className="col-action">
                    <button className="action-btn">Open Chat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Controls */}
        <div className="bottom-controls">
          <div className="entries-control">
            <span className="show-label">Show</span>
            <div className="select-container">
              <select
                value={showEntries}
                onChange={(e) => setShowEntries(Number(e.target.value))}
                className="entries-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <svg
                className="select-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <span className="entries-label">entries</span>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="page-btn prev-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>
            <button className="page-btn current-page">1</button>
            <button className="page-btn next-btn">
              Next
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
