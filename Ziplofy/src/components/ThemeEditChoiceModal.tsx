import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeId: string;
}

const ThemeEditChoiceModal: React.FC<Props> = ({ isOpen, onClose, themeId }) => {
  if (!isOpen) return null;

  const handleEditLayout = () => {
    // Get access token from localStorage to pass to builder
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const storeId = localStorage.getItem('storeId') || sessionStorage.getItem('storeId');
    
    // Add type=installed to indicate this is an installed theme (not custom)
    // This prevents the 404 error from trying custom theme endpoint first
    let builderUrl = `/themes/builder?id=${encodeURIComponent(themeId)}&type=installed`;
    if (accessToken) {
      builderUrl += `&accessToken=${encodeURIComponent(accessToken)}`;
    }
    if (storeId) {
      builderUrl += `&storeId=${encodeURIComponent(storeId)}`;
    }
    
    window.open(builderUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleEditCode = () => {
    window.open(`/themes/code/${themeId}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleEditBasicElementor = () => {
    // Get access token from localStorage to pass to builder
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const storeId = localStorage.getItem('storeId') || sessionStorage.getItem('storeId');
    
    let builderUrl = `/themes/basic-elementor?id=${encodeURIComponent(themeId)}&type=installed`;
    if (accessToken) {
      builderUrl += `&accessToken=${encodeURIComponent(accessToken)}`;
    }
    if (storeId) {
      builderUrl += `&storeId=${encodeURIComponent(storeId)}`;
    }
    
    window.open(builderUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', color: '#000', width: 420, borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>Edit Theme</div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={handleEditLayout} style={{
            padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5da', background: '#fff',
            cursor: 'pointer', textAlign: 'left', fontWeight: 600
          }}>
            Edit Layout (Visual)
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 400 }}>Open Elementor-style visual builder to modify layout and components</div>
          </button>
          <button onClick={handleEditBasicElementor} style={{
            padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5da', background: '#fff',
            cursor: 'pointer', textAlign: 'left', fontWeight: 600
          }}>
            Edit with Basic Elementor
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 400 }}>Open basic Elementor editor</div>
          </button>
          <button onClick={handleEditCode} style={{
            padding: '12px 14px', borderRadius: 8, border: '1px solid #d1d5da', background: '#fff',
            cursor: 'pointer', textAlign: 'left', fontWeight: 600
          }}>
            Edit Code (Advanced)
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 400 }}>Open code editor (Monaco) to edit HTML/CSS/JS</div>
          </button>
        </div>
        <div style={{ padding: 12, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5da', background: '#fff', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditChoiceModal;


