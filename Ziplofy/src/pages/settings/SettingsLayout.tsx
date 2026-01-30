import React, { useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SettingsSidebar from '../../components/SettingsSidebar';

const NAVBAR_HEIGHT = 60;

const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname; // e.g. /settings/general

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
      <SettingsSidebar currentPath={currentPath} onNavigate={handleNavigate} onBack={handleBack} />
      <main
        className="overflow-y-auto w-full"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;


