import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/auth.context';
import './ClientThemeEditor.css';

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  lastModified?: string;
  children?: FileItem[];
}

interface FileContent {
  filePath: string;
  content: string;
  fileExtension: string;
  size: number;
  lastModified: string;
}

const ClientThemeEditor: React.FC = () => {
  const { installationId } = useParams<{ installationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [fileStructure, setFileStructure] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (installationId) {
      fetchFileStructure();
    }
  }, [installationId]);

  const fetchFileStructure = async () => {
    try {
      const response = await axios.get(`/api/client/theme-files/installation/${installationId}/structure`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      setFileStructure(response.data.data.fileStructure);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch file structure');
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await axios.get(`/api/client/theme-files/installation/${installationId}/file/${filePath}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      setFileContent(response.data.data);
      setSelectedFile(filePath);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch file content');
    }
  };

  const saveFileContent = async () => {
    if (!fileContent || !selectedFile) return;

    setSaving(true);
    try {
      await axios.put(`/api/client/theme-files/installation/${installationId}/file/${selectedFile}`, {
        content: fileContent.content
      }, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      alert('File saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const createNewFile = async (filePath: string, content: string = '') => {
    try {
      await axios.post(`/api/client/theme-files/installation/${installationId}/file`, {
        filePath,
        content
      }, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      // Refresh file structure
      await fetchFileStructure();
      alert('File created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create file');
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await axios.delete(`/api/client/theme-files/installation/${installationId}/file/${filePath}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`
        }
      });
      
      // Refresh file structure
      await fetchFileStructure();
      if (selectedFile === filePath) {
        setSelectedFile('');
        setFileContent(null);
      }
      alert('File deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'directory') return '📁';
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'js': return '📜';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg': return '🖼️';
      default: return '📄';
    }
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.path} style={{ marginLeft: level * 20 }}>
        <div 
          className={`file-item ${item.type === 'directory' ? 'folder' : 'file'} ${selectedFile === item.path ? 'selected' : ''}`}
          onClick={() => {
            if (item.type === 'directory') {
              toggleFolder(item.path);
            } else {
              fetchFileContent(item.path);
            }
          }}
        >
          <span className="file-icon">
            {getFileIcon(item.name, item.type)}
          </span>
          <span className="file-name">{item.name}</span>
          {item.type === 'file' && (
            <span className="file-size">
              {item.size ? `${(item.size / 1024).toFixed(1)}KB` : ''}
            </span>
          )}
        </div>
        
        {item.type === 'directory' && expandedFolders.has(item.path) && item.children && (
          <div className="folder-children">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading theme files...</div>;
  }

  return (
    <div className="client-theme-editor">
      <div className="editor-header">
        <div className="header-info">
          <h1>Theme Code Editor</h1>
          <p>Edit your theme files directly in the browser</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn secondary"
            onClick={() => navigate('/themes')}
          >
            Back to Themes
          </button>
          {selectedFile && (
            <button 
              className="btn primary"
              onClick={saveFileContent}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save File'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="editor-content">
        <div className="file-explorer">
          <div className="explorer-header">
            <h3>Theme Files</h3>
            <button 
              className="btn small"
              onClick={() => {
                const fileName = prompt('Enter file name:');
                if (fileName) {
                  createNewFile(fileName, '');
                }
              }}
            >
              + New File
            </button>
          </div>
          <div className="file-tree">
            {renderFileTree(fileStructure)}
          </div>
        </div>

        <div className="code-editor">
          {fileContent ? (
            <div className="editor-container">
              <div className="editor-header">
                <span className="file-name">{fileContent.filePath}</span>
                <span className="file-info">
                  {fileContent.fileExtension} • {fileContent.size} bytes
                </span>
              </div>
              <textarea
                className="code-textarea"
                value={fileContent.content}
                onChange={(e) => setFileContent({ ...fileContent, content: e.target.value })}
                placeholder="Enter file content..."
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="no-file-selected">
              <h3>Select a file to edit</h3>
              <p>Choose a file from the file explorer to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientThemeEditor;
