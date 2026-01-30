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
      {/* Header */}
      <div className="support-developer-header">
        <div className="header-content">
          <FontAwesomeIcon icon={faUsers} className="header-icon" />
          <div className="header-text">
            <h1>Support Developers</h1>
            <p>Manage and view support developer team members</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <FontAwesomeIcon icon={faUsers} />
            <span>{supportDevelopers.length} Total Developers</span>
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

      {/* Summary Stats */}
      {supportDevelopers.length > 0 && (
        <div className="summary-stats">
          <div className="stat-card">
            <FontAwesomeIcon icon={faUsers} />
            <div className="stat-info">
              <span className="stat-number">{supportDevelopers.length}</span>
              <span className="stat-label">Total Developers</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faCalendar} />
            <div className="stat-info">
              <span className="stat-number">
                {supportDevelopers.filter(dev => {
                  const createdAt = new Date(dev.createdAt);
                  const now = new Date();
                  const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
                  return diffInDays < 7;
                }).length}
              </span>
              <span className="stat-label">Added This Week</span>
            </div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faEnvelope} />
            <div className="stat-info">
              <span className="stat-number">
                {new Set(supportDevelopers
                  .filter(dev => dev.email && typeof dev.email === 'string')
                  .map(dev => dev.email.split('@')[1])
                ).size}
              </span>
              <span className="stat-label">Unique Domains</span>
            </div>
          </div>
        </div>
      )}

      {/* Assign Developer Modal */}
      <AssignDeveloperModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        developer={selectedDeveloper}
      />
    </div>
  );
};

export default SupportDeveloper;
