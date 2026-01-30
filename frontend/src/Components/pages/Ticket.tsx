import React, { useState } from "react";
import "./Ticket.css";

interface TicketData {
  id: number;
  ticketId: number;
  leadId: string;
  issueType: string;
  subject: string;
  status: string;
  createdOn: string;
  screenshot?: string | null;
}

const Ticket: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tickets: TicketData[] = [
    {
      id: 1,
      ticketId: 8,
      leadId: "ziplofy_1749806636673",
      issueType: "website",
      subject: "fdffdf",
      status: "Resolved",
      createdOn: "01 Aug 2025, 01:22 PM",
      screenshot: null,
    },
    {
      id: 2,
      ticketId: 7,
      leadId: "ziplofy_1749806636673",
      issueType: "domain",
      subject: "not connected",
      status: "Process",
      createdOn: "25 Jul 2025, 12:08 PM",
      screenshot: "View",
    },
  ];

  return (
    <div className="tickets-container">
      {/* Header */}
      <div className="tickets-header">
        <div className="header-left">
          <h1 className="tickets-title">Tickets</h1>
          <span className="tickets-count">{tickets.length}</span>
        </div>
        <div className="header-actions">
          <button className="icon-button">{/* Settings Icon SVG */}</button>
          <button className="icon-button">{/* Upload Icon SVG */}</button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Lead ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls-actions">
          <button className="control-button">Sort</button>
          <button className="control-button">Export</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>SN No.</th>
              <th>Ticket ID</th>
              <th>Lead ID</th>
              <th>Issue Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created On</th>
              <th>Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.ticketId}</td>
                <td>{ticket.leadId}</td>
                <td>{ticket.issueType}</td>
                <td>{ticket.subject}</td>
                <td>
                  <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.createdOn}</td>
                <td>
                  {ticket.screenshot ? (
                    <button className="screenshot-link">{ticket.screenshot}</button>
                  ) : (
                    <span className="no-screenshot">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <div className="entries-control">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="entries-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>

        <div className="pagination-controls">
          <button className="pagination-button">Prev</button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
