import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import toast from 'react-hot-toast';
import { useSocket } from '../contexts/socket.context';
import { useUserContext } from '../contexts/user.context';
import { SocketEventType } from '../types/event.types';
import CustomizeDomainCard from './CustomizeDomainCard';
import DashboardContent from './DashboardContent';
import GettingStartedPage from './GettingStartedPage';

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
      <div className="min-h-screen bg-page-background-color">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back{userName !== 'User' ? `, ${userName}` : ''}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your store today
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-8 p-1 bg-white rounded-lg border border-gray-200 w-fit">
            {(['dashboard', 'getting-started'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab ? '' : 'hover:text-gray-900 hover:bg-gray-100'
                } relative rounded-md px-4 py-2 text-sm font-medium text-gray-600 outline-sky-400 transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="bubble"
                    className="absolute inset-0 z-10 bg-blue-600"
                    style={{ borderRadius: 6 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                  {tab === 'dashboard' ? 'Dashboard' : 'Getting Started'}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'dashboard' ? (
            <div key="dashboard" className="flex flex-col gap-4 animate-tab-fade">
              <DashboardContent />
              <CustomizeDomainCard />
            </div>
          ) : (
            <div key="getting-started" className="animate-tab-fade">
              <GettingStartedPage />
            </div>
          )}
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
    </>
  );
}
