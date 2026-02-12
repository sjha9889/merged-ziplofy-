import React, { useEffect, useState } from 'react';
import { useSupportDevelopers } from '../../contexts/supportdeveloper.context';
import { useAssignedDevelopers } from '../../contexts/assign-developer.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faEnvelope, 
  faUser, 
  faCalendar, 
  faSpinner, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { Users, Calendar, Mail } from 'lucide-react';
import AssignDeveloperModal from '../AssignDeveloperModal';
import './SupportDeveloper.css';

// Define TypeScript type for a developer
interface Developer {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

const SupportDeveloper: React.FC = () => {
  const { 
    supportDevelopers, 
    loading, 
    error, 
    fetchSupportDevelopers 
  } = useSupportDevelopers();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  // Fetch support developers on component mount
  useEffect(() => {
    fetchSupportDevelopers();
  }, [fetchSupportDevelopers]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="support-developer-container">
        <div className="loading-state">
          <FontAwesomeIcon icon={faSpinner} className="spinner" />
          <p>Loading support developers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="support-developer-container">
        <div className="error-state">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <h3>Error Loading Support Developers</h3>
          <p>{error}</p>
          <button 
            onClick={fetchSupportDevelopers}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleAssignDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeveloper(null);
  };

  return (
    <div className="support-developer-container">
      <div className="support-developer-card">
        <div className="support-developer-card-header">
          <div className="support-developer-title-block">
            <div className="support-developer-title-accent" />
            <div>
              <h1 className="support-developer-title">Support Developers</h1>
              <p className="support-developer-subtitle">Manage and view support developer team members</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="header-stat-kpi">
              <span className="header-stat-value">{supportDevelopers.length}</span>
              <span className="header-stat-label">Total Developers</span>
            </div>
          </div>
        </div>

        {/* Content */}
      <div className="support-developer-content">
        {supportDevelopers.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faUsers} />
            <h3>No Support Developers</h3>
            <p>There are currently no support developers in the system.</p>
            <p>Add new support developers from the Dev Admin panel.</p>
          </div>
        ) : (
          <div className="developers-grid">
            {supportDevelopers.map((developer: Developer) => (
              <div key={developer._id} className="developer-card">
                <div className="developer-card-header">
                  <div className="developer-avatar">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="developer-info">
                    <h3 className="developer-name">{developer.username}</h3>
                    <p className="developer-email">
                      <FontAwesomeIcon icon={faEnvelope} />
                      {developer.email}
                    </p>
                  </div>
                </div>
                
                <div className="developer-card-body">
                  <div className="developer-meta">
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Joined: {formatDate(developer.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="developer-id">ID: {developer._id}</span>
                    </div>
                  </div>
                </div>

                <div className="developer-card-footer">
                  <div className="developer-status">
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="developer-actions">
                    <button className="btn btn-sm btn-secondary">
                      View Details
                    </button>
                    <button className="btn btn-sm btn-primary">
                      Contact
                    </button>
                    <button onClick={() => handleAssignDeveloper(developer)} className="btn btn-sm btn-success">
                      Assign Developer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats - Analytics style */}
      {supportDevelopers.length > 0 && (
        <div className="summary-stats kpi-grid">
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-content">
                <div className="kpi-label">Total Developers</div>
                <div className="kpi-value">{supportDevelopers.length}</div>
              </div>
              <div className="kpi-icon-wrap primary">
                <Users size={24} strokeWidth={2} />
              </div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-content">
                <div className="kpi-label">Added This Week</div>
                <div className="kpi-value">
                  {supportDevelopers.filter(dev => {
                    const createdAt = new Date(dev.createdAt);
                    const now = new Date();
                    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
                    return diffInDays < 7;
                  }).length}
                </div>
              </div>
              <div className="kpi-icon-wrap success">
                <Calendar size={24} strokeWidth={2} />
              </div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-content">
                <div className="kpi-label">Unique Domains</div>
                <div className="kpi-value">
                  {new Set(supportDevelopers
                    .filter(dev => dev.email && typeof dev.email === 'string')
                    .map(dev => dev.email.split('@')[1])
                  ).size}
                </div>
              </div>
              <div className="kpi-icon-wrap accent">
                <Mail size={24} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Assign Developer Modal */}
      </div>
      <AssignDeveloperModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        developer={selectedDeveloper}
      />
    </div>
  );
};

export default SupportDeveloper;
