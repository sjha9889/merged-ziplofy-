import React, { useState, useRef, useEffect, RefObject } from "react";
import "./ThemeDeveloper.css";
import {
  Search,
  Plus,
  Calendar,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// ---------------------- Types ----------------------
interface Theme {
  id: number;
  name: string;
  category: string;
  uploadDate: string;
  uploadBy: string;
  plan: string;
}

interface DateRangeItem {
  startDate: Date;
  endDate: Date;
  key: string;
}

// ---------------------- Component ----------------------
const ThemeDeveloper: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeActionDropdown, setActiveActionDropdown] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRangeItem[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  const themes: Theme[] = [
    { id: 1, name: "Cultura", category: "Travel", uploadDate: "14 Jul 2025", uploadBy: "Piyush", plan: "Basic" },
    { id: 2, name: "ThrillQuest", category: "Travel", uploadDate: "14 Jul 2025", uploadBy: "Piyush", plan: "Basic" },
    { id: 3, name: "Tripora", category: "Travel", uploadDate: "14 Jul 2025", uploadBy: "Piyush", plan: "Basic" },
    { id: 4, name: "Wander Edge", category: "Travel", uploadDate: "14 Jul 2025", uploadBy: "Piyush", plan: "Basic" },
  ];

  return (
    <div className="theme-table-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1 className="title">Total Theme</h1>
          <span className="theme-count">123</span>
        </div>
        <div className="header-right">
          <span className="settings-icon">⚙</span>
          <span className="profile-icon">👤</span>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Theme"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
        <button className="add-theme-btn" onClick={() => setIsUploadOpen(true)}>
          <Plus size={20} />
          Add New Theme
        </button>
      </div>

      {/* Date Range and Filter */}
      <div className="filters">
        <div className="date-range" onClick={() => setShowDatePicker(!showDatePicker)}>
          <Calendar size={16} />
          <span>
            {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
          </span>
        </div>
        <button className="filter-btn">
          <Filter size={16} />
          Filter
        </button>

        {showDatePicker && (
          <div className="date-range-picker" ref={datePickerRef}>
            <DateRange
              editableDateInputs={true}
              onChange={(item: { selection: Range }) => setDateRange([{ ...item.selection, key: "selection" }])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="theme-table">
          <thead>
            <tr>
              <th>Theme Name</th>
              <th>Category</th>
              <th>Upload Date</th>
              <th>Upload By</th>
              <th>Plan</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "left" }}>
            {themes.map((theme) => (
              <tr key={theme.id}>
                <td className="theme-name">{theme.name}</td>
                <td>
                  <span className="category-badge">{theme.category}</span>
                </td>
                <td className="upload-date">{theme.uploadDate}</td>
                <td className="upload-by">{theme.uploadBy}</td>
                <td>
                  <span className="plan-badge">{theme.plan}</span>
                </td>
                <td>
                  <div className="action-container">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setActiveActionDropdown(activeActionDropdown === theme.id ? null : theme.id)
                      }
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {activeActionDropdown === theme.id && (
                      <div className="action-dropdown">
                        <div className="action-item">
                          <Eye size={16} className="action-icon view-icon" />
                          <span>View</span>
                        </div>
                        <div className="action-item">
                          <Edit size={16} className="action-icon edit-icon" />
                          <span>Edit</span>
                        </div>
                        <div className="action-item">
                          <Trash2 size={16} className="action-icon delete-icon" />
                          <span>Delete</span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" disabled>
          <ChevronLeft size={16} /> Prev
        </button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Upload Sidebar */}
      {isUploadOpen && (
        <div className="themeUpload-overlay">
          <div className="themeUpload-sidebar">
            <div className="themeUpload-header">
              <h2>Upload Theme</h2>
              <button className="themeUpload-close" onClick={() => setIsUploadOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="themeUpload-body">
              <label>Theme Name</label>
              <input type="text" placeholder="Enter theme name" />

              <label>Category</label>
              <select>
                <option>Select</option>
                <option>Travel</option>
                <option>Business</option>
                <option>Fashion</option>
              </select>

              <label>Plan</label>
              <select>
                <option>Select</option>
                <option>Basic</option>
                <option>Advanced</option>
                <option>Professional</option>
              </select>

              <label>Upload ZIP</label>
              <input type="file" accept=".zip" />

              <label>Thumbnail (JPG/PNG)</label>
              <input type="file" accept=".jpg,.jpeg,.png" />
              <div className="themeUpload-footer">
                <button className="themeUpload-submit">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeDeveloper;
