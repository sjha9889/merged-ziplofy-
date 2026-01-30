import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import toast from 'react-hot-toast';
import { useSocket } from '../contexts/socket.context';
import { useUserContext } from '../contexts/user.context';
import { SocketEventType } from '../types/event.types';
import CustomizeDomainCard from './CustomizeDomainCard';
import DashboardContent from './DashboardContent';
import GettingStartedPage from './GettingStartedPage';
import GridBackgroundWrapper from './GridBackgroundWrapper';

export default function HomePage() {
  const [showCalendlyModal, setShowCalendlyModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'getting-started'>('dashboard');

  const { socket } = useSocket();
  const { loggedInUser } = useUserContext();

  const modalRef = useRef<HTMLDivElement>(null);

  const handleHireDeveloperClick = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('hireDeveloper');
    } else {
      toast.error('socket not connected');
    }
  }, [socket]);

  const handleEndMeetingClick = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit(SocketEventType.EndMeeting);
      toast.success('we have notified the developer to send requirements form, so that you can approve it');
    } else {
      toast.error('Socket not connected');
    }
    // @ts-ignore
  }, [socket, loggedInUser?.assignedSupportDeveloperId?.id]);

  const handleScheduleMeetingClick = useCallback(() => {
    setShowCalendlyModal(true);
  }, []);

  // Get the assigned developer's Calendly URL - memoized to prevent re-renders
  const getCalendlyUrl = useMemo((): string => {
    if (!loggedInUser?.assignedSupportDeveloperId) {
      console.log('No assigned developer found');
      return 'https://calendly.com/default/30min';
    }

    // Use the support developer's email to construct Calendly URL
    // @ts-ignore
    const developerEmail = loggedInUser.assignedSupportDeveloperId?.email;
    console.log('Developer email:', developerEmail);

    // Extract username from email (part before @)
    // const emailUsername = developerEmail.split("@")[0];
    const emailUsername = 'gibberish';
    console.log('Extracted username:', emailUsername);

    // Construct Calendly URL using the email username
    const calendlyUrl = `https://calendly.com/${emailUsername}/30min`;
    console.log('Generated Calendly URL:', calendlyUrl);

    return calendlyUrl;
  }, [loggedInUser?.assignedSupportDeveloperId]);

  const handleCloseCalendlyModal = useCallback(() => {
    setShowCalendlyModal(false);
  }, []);

  // Handle click outside modal
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseCalendlyModal();
      }
    },
    [handleCloseCalendlyModal]
  );

  // Handle Escape key press
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCalendlyModal) {
        handleCloseCalendlyModal();
      }
    },
    [showCalendlyModal, handleCloseCalendlyModal]
  );

  // Handle modal stop propagation
  const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  // Handle action button clicks
  const handleAskAIClick = useCallback(() => {
    // TODO: Implement Ask AI functionality
    console.log('Ask AI clicked');
  }, []);

  const handleGetTasksUpdatesClick = useCallback(() => {
    // TODO: Implement Get tasks updates functionality
    console.log('Get tasks updates clicked');
  }, []);

  const handleCreateWorkspaceClick = useCallback(() => {
    // TODO: Implement Create workspace functionality
    console.log('Create workspace clicked');
  }, []);

  const handleConnectAppsClick = useCallback(() => {
    // TODO: Implement Connect apps functionality
    console.log('Connect apps clicked');
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    if (showCalendlyModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showCalendlyModal, handleClickOutside]);

  // Close modal when pressing Escape
  useEffect(() => {
    if (showCalendlyModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showCalendlyModal, handleEscape])

  // Get user's first name for greeting
  const userName = loggedInUser?.name?.split(' ')[0] || 'User';

  return (
    <>
      
      {/* Scrollable Content Layer */}
      <GridBackgroundWrapper>
      <div className="relative pt-3 px-4 pb-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-[1400px] mx-auto flex flex-col gap-3">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 text-base px-1 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('getting-started')}
            className={`pb-2 px-1 text-base font-medium transition-colors ${
              activeTab === 'getting-started'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Getting Started
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-3">

          {/* Main Content */}
          {activeTab === 'dashboard' ? (
            <DashboardContent />
          ) : (
            <GettingStartedPage />
          )}

          {/* Legacy Developer Actions - Hidden by default, can be shown conditionally */}
          {activeTab === 'dashboard' && (
            <div>
              <CustomizeDomainCard />
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Calendly Modal */}
      {showCalendlyModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1400]"
            onClick={handleCloseCalendlyModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none">
            <div
              ref={modalRef}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto"
              onClick={handleModalClick}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseCalendlyModal}
                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white/90 rounded-lg transition-colors z-10"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="relative h-[80vh] min-h-[600px]">
                <InlineWidget
                  url={getCalendlyUrl}
                  styles={{
                    height: '100%',
                    width: '100%',
                  }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '4caf50',
                    textColor: '4d5055',
                  }}
                  prefill={{
                    name: loggedInUser?.name || '',
                    email: loggedInUser?.email || '',
                  }}
                  utm={{
                    utmCampaign: 'developer-meeting',
                    utmSource: 'ziplofy',
                    utmMedium: 'website',
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
      </GridBackgroundWrapper>
    </>
  );
}
