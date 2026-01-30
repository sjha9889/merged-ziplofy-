import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/auth.context';
import './ClientThemeCustomize.css';

interface CustomizationData {
  section: string;
  property: string;
  value: string;
  type: 'color' | 'text' | 'image' | 'number';
}

const ClientThemeCustomize: React.FC = () => {
  const { installationId } = useParams<{ installationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [installation, setInstallation] = useState<any>(null);
  const [customizations, setCustomizations] = useState<CustomizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (installationId) {
      fetchInstallationDetails();
    }
  }, [installationId]);

  const fetchInstallationDetails = async () => {
    try {
      const response = await axios.get(`/api/client/installation/${installationId}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      setInstallation(response.data.data);
      setCustomizations(response.data.data.customizations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch theme details');
    } finally {
      setLoading(false);
    }
  };

  const addCustomization = () => {
    setCustomizations([...customizations, {
      section: '',
      property: '',
      value: '',
      type: 'text'
    }]);
  };

  const updateCustomization = (index: number, field: keyof CustomizationData, value: string) => {
    const updated = [...customizations];
    updated[index] = { ...updated[index], [field]: value };
    setCustomizations(updated);
  };

  const removeCustomization = (index: number) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  const saveCustomizations = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/client/installation/${installationId}/customize`, {
        customizations,
        updatedAt: new Date().toISOString()
      }, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      alert('Customizations saved successfully! Your theme has been updated.');
      navigate('/themes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save customizations');
    } finally {
      setSaving(false);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (loading) {
    return <div className="loading">Loading theme details...</div>;
  }

  if (!installation) {
    return <div className="error">Theme installation not found</div>;
  }

  return (
    <div className="client-theme-customize">
      <div className="customize-header">
        <div className="header-info">
          <h1>Customize Theme: {installation.themeId?.name}</h1>
          <p>Make this theme your own by customizing colors, text, and layout</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn preview"
            onClick={togglePreview}
          >
            {previewMode ? 'Exit Preview' : 'Preview Changes'}
          </button>
          <button 
            className="btn save"
            onClick={saveCustomizations}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="customize-content">
        <div className="customizations-section">
          <div className="section-header">
            <h2>Theme Customizations</h2>
            <button className="btn add" onClick={addCustomization}>
              + Add Customization
            </button>
          </div>

          {customizations.length === 0 ? (
            <div className="no-customizations">
              <p>No customizations yet. Click "Add Customization" to start customizing your theme.</p>
            </div>
          ) : (
            <div className="customizations-list">
              {customizations.map((customization, index) => (
                <div key={index} className="customization-item">
                  <div className="customization-fields">
                    <div className="field-group">
                      <label>Section</label>
                      <input
                        type="text"
                        value={customization.section}
                        onChange={(e) => updateCustomization(index, 'section', e.target.value)}
                        placeholder="e.g., Header, Footer, Sidebar"
                      />
                    </div>
                    
                    <div className="field-group">
                      <label>Property</label>
                      <input
                        type="text"
                        value={customization.property}
                        onChange={(e) => updateCustomization(index, 'property', e.target.value)}
                        placeholder="e.g., background-color, font-size"
                      />
                    </div>
                    
                    <div className="field-group">
                      <label>Value</label>
                      <input
                        type="text"
                        value={customization.value}
                        onChange={(e) => updateCustomization(index, 'value', e.target.value)}
                        placeholder="e.g., #ffffff, 16px, Hello World"
                      />
                    </div>
                    
                    <div className="field-group">
                      <label>Type</label>
                      <select
                        value={customization.type}
                        onChange={(e) => updateCustomization(index, 'type', e.target.value as any)}
                      >
                        <option value="text">Text</option>
                        <option value="color">Color</option>
                        <option value="image">Image</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    className="btn remove"
                    onClick={() => removeCustomization(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {previewMode && (
          <div className="preview-section">
            <h3>Live Preview</h3>
            <div className="preview-frame">
              <iframe
                src={`/store-preview/${installation.storeId}`}
                title="Theme Preview"
                width="100%"
                height="600px"
                frameBorder="0"
              />
            </div>
          </div>
        )}
      </div>

      <div className="customize-footer">
        <button 
          className="btn secondary"
          onClick={() => navigate('/themes')}
        >
          Back to Themes
        </button>
        <button 
          className="btn primary"
          onClick={saveCustomizations}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save & Apply Changes'}
        </button>
      </div>
    </div>
  );
};

export default ClientThemeCustomize;
