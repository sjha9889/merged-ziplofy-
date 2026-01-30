import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/notification.context';
import NotificationCard from '../NotificationCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBell, faUser, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import './DevRequests.css';

// TypeScript interface for Notification
interface Notification {
  id?: string;
  _id?: string;
  type?: string;
  notificationType?: string;
  createdAt?: string;
  timestamp?: string;
  userId?: { email?: string };
  data?: {
    userId?: { email?: string };
    requestedBy?: { email?: string };
  };
  [key: string]: any; // for any other properties
}

const DevRequests: React.FC = () => {
  const { notifications, fetchNotifications } = useNotifications();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filter only hire developer notifications
  const devRequests: Notification[] = notifications.filter(
    (notification: Notification) =>
      notification.type === 'hireDeveloper' ||
      notification.notificationType === 'hireDeveloper'
  );

  const handleNotificationClick = (notification: Notification) => {
    console.log('Dev request clicked:', notification);
    // Add additional logic if needed
  };

  return (
    <div className="dev-requests-container">
      {/* Header */}
      <div className="dev-requests-header">
        <div className="header-left">
          <FontAwesomeIcon icon={faCode} className="header-icon" />
          <div className="header-text">
            <h1>Hire Developer Requests</h1>
            <p>Manage and view developer hire requests</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <FontAwesomeIcon icon={faBell} />
            <span>{devRequests.length} Total Requests</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dev-requests-content">
        {devRequests.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCode} />
            <h3>No Developer Requests</h3>
            <p>There are currently no developer hire requests.</p>
            <p>New requests will appear here when clients request developer services.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {devRequests.map((request: Notification) => (
              <div key={request.id || request._id} className="request-card-wrapper">
                <NotificationCard
                  notification={request}
                  onClick={handleNotificationClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {devRequests.length > 0 && (
        <div className="summary-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faUser} />
            <div className="stat-info">
              <span className="stat-number">{devRequests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faClock} />
            <div className="stat-info">
              <span className="stat-number">
                {devRequests.filter((req: Notification) => {
                  const createdAt = new Date(req.createdAt || req.timestamp || '');
                  const now = new Date();
                  const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
                  return diffInHours < 24;
                }).length}
              </span>
              <span className="stat-label">Last 24 Hours</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faEnvelope} />
            <div className="stat-info">
              <span className="stat-number">
                {new Set(
                  devRequests.map((req: Notification) =>
                    req.userId?.email || req.data?.userId?.email || req.data?.requestedBy?.email
                  )
                ).size}
              </span>
              <span className="stat-label">Unique Clients</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevRequests;
