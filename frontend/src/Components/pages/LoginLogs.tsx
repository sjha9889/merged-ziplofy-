import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import "./LoginLogs.css";

interface LoginLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    status: string;
  };
  email: string;
  name: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  loginMethod: 'email' | 'google';
  success: boolean;
  failureReason?: string;
}

interface LoginStats {
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
}

const LoginLogs: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [stats, setStats] = useState<LoginStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successFilter, setSuccessFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const fetchLoginLogs = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      if (searchTerm) params.append('search', searchTerm);
      if (successFilter !== 'all') params.append('success', successFilter);
      if (dateFilter.startDate) params.append('startDate', dateFilter.startDate);
      if (dateFilter.endDate) params.append('endDate', dateFilter.endDate);

      const response = await axios.get(`/api/login-logs?${params}`);
      setLogs(response.data.data.logs);
      setPagination(response.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch login logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (dateFilter.startDate) params.append('startDate', dateFilter.startDate);
      if (dateFilter.endDate) params.append('endDate', dateFilter.endDate);

      const response = await axios.get(`/api/login-logs/stats?${params}`);
      setStats(response.data.data);
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchLoginLogs();
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLoginLogs(1);
      fetchStats();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, successFilter, dateFilter.startDate, dateFilter.endDate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSInfo = (userAgent: string) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  return (
    <div className="login-logs-container">
      <div className="page-header">
        <h2>User Login Activity</h2>
        <p>Monitor all user login activities from port 3000</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Logins</h3>
            <p className="stat-number">{stats.totalLogins}</p>
          </div>
          <div className="stat-card success">
            <h3>Successful</h3>
            <p className="stat-number">{stats.successfulLogins}</p>
          </div>
          <div className="stat-card error">
            <h3>Failed</h3>
            <p className="stat-number">{stats.failedLogins}</p>
          </div>
          <div className="stat-card">
            <h3>Unique Users</h3>
            <p className="stat-number">{stats.uniqueUsers}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={successFilter}
            onChange={(e) => setSuccessFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Logins</option>
            <option value="true">Successful Only</option>
            <option value="false">Failed Only</option>
          </select>
        </div>
        <div className="filter-group">
          <input
            type="date"
            placeholder="Start Date"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            className="date-input"
          />
        </div>
        <div className="filter-group">
          <input
            type="date"
            placeholder="End Date"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
            className="date-input"
          />
        </div>
      </div>

      {/* Login Logs Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading login logs...</div>
        ) : logs.length === 0 ? (
          <div className="no-data">No login logs found</div>
        ) : (
          <table className="login-logs-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Method</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Failure Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className={log.success ? 'success-row' : 'error-row'}>
                  <td>
                    <div className="user-info">
                      <strong>{log.name}</strong>
                    </div>
                  </td>
                  <td>{log.email}</td>
                  <td>{formatDate(log.loginTime)}</td>
                  <td>
                    <span className={`method-badge ${log.loginMethod}`}>
                      {log.loginMethod === 'google' ? 'Google' : 'Email'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${log.success ? 'success' : 'error'}`}>
                      {log.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td>{log.ipAddress}</td>
                  <td>{getBrowserInfo(log.userAgent)}</td>
                  <td>{getOSInfo(log.userAgent)}</td>
                  <td>{log.failureReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => fetchLoginLogs(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchLoginLogs(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}
    </div>
  );
};

export default LoginLogs;
