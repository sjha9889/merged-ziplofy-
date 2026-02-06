import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaWallet,
  FaUserCog,
  FaLifeRing,
  FaIdBadge,
  FaCode,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";
import { useAdminAuth } from "../contexts/admin-auth.context";
import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  activeItem?: string;
  onSelect?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeItem, onSelect }) => {
  const [openSection, setOpenSection] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAdminAuth();

  // Format role name for display (e.g., "support-admin" -> "Support Admin")
  const formatRoleName = (roleName: string | undefined): string => {
    if (!roleName) return "Admin";
    
    // Split by hyphen and capitalize each word
    return roleName
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayRoleName = formatRoleName(user?.roleName);

  const toggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? "" : section));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onSelect) {
      onSelect(path);
    }
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      style={{
        borderRadius: "14px",
        backgroundColor: "#f8fafc",
        marginTop: "10px",
      }}
    >
      <div className="sidebar-header">
        <FaUserShield className="sidebar-icon" />
        <span>{displayRoleName}</span>
      </div>

      <ul className="sidebar-menu">
        <p className="sidebar-section-title">Main Menu</p>

        <li
          className={location.pathname === "/client-list" ? "active" : ""}
          onClick={() => handleNavigation("/client-list")}
        >
          <FaUsers className="menu-icon" />
          <span>Client List</span>
        </li>

        <li
          className={location.pathname === "/payment" ? "active" : ""}
          onClick={() => handleNavigation("/payment")}
        >
          <FaWallet className="menu-icon" />
          <span>Payment</span>
        </li>
        <li
          className={location.pathname === "/invoice" ? "active" : ""}
          onClick={() => handleNavigation("/invoice")}
        >
          <FaWallet className="menu-icon" />
          <span>Invoice</span>
        </li>

        <p className="sidebar-section-title">User & Access</p>

        <li
          className={`has-sub ${openSection === "UserManagement" ? "open" : ""}`}
          onClick={() => toggle("UserManagement")}
        >
          <div className="menu-row">
            <FaUserCog className="menu-icon" />
            <span>User Management</span>
            <FaChevronDown className={`chev ${openSection === "UserManagement" ? "rotated" : ""}`} />
          </div>
        </li>
        {openSection === "UserManagement" && (
          <ul className="submenu">
            <li
              className={location.pathname === "/manage-user" ? "active" : ""}
              onClick={() => handleNavigation("/manage-user")}
            >
              <span className="dot">•</span>
              <span>Manage User</span>
            </li>
            <li
              className={location.pathname === "/roles-permission" ? "active" : ""}
              onClick={() => handleNavigation("/roles-permission")}
            >
              <span className="dot">•</span>
              <span>Roles and Permission</span>
            </li>
          </ul>
        )}

        <p className="sidebar-section-title">Membership</p>
        <li
          className={`has-sub ${openSection === "Membership" ? "open" : ""}`}
          onClick={() => toggle("Membership")}
        >
          <div className="menu-row">
            <FaIdBadge className="menu-icon" />
            <span>Membership</span>
            <FaChevronDown className="chev" />
          </div>
        </li>
        {openSection === "Membership" && (
          <ul className="submenu">
            <li
              className={location.pathname === "/membership-plan" ? "active" : ""}
              onClick={() => handleNavigation("/membership-plan")}
            >
              <span className="dot">•</span>
              <span>Membership Plan</span>
            </li>
          </ul>
        )}

        <p className="sidebar-section-title">Developer</p>
        <li
          className={`has-sub ${openSection === "Developer" ? "open" : ""}`}
          onClick={() => toggle("Developer")}
        >
          <div className="menu-row">
            <FaCode className="menu-icon" />
            <span>Developer</span>
            <FaChevronDown className="chev" />
          </div>
        </li>
        {openSection === "Developer" && (
          <ul className="submenu">
            <li
              className={location.pathname === "/dev-admin" ? "active" : ""}
              onClick={() => handleNavigation("/dev-admin")}
            >
              <span className="dot">•</span>
              <span>Dev Admin</span>
            </li>
            <li
              className={location.pathname === "/theme-developer" ? "active" : ""}
              onClick={() => handleNavigation("/theme-developer")}
            >
              <span className="dot">•</span>
              <span>Theme Developer</span>
            </li>
            <li
              className={location.pathname === "/theme-installation" ? "active" : ""}
              onClick={() => handleNavigation("/theme-installation")}
            >
              <span className="dot">•</span>
              <span>Theme Installation</span>
            </li>
            <li
              className={location.pathname === "/support-developer" ? "active" : ""}
              onClick={() => handleNavigation("/support-developer")}
            >
              <span className="dot">•</span>
              <span>Support Developer</span>
            </li>
            <li
              className={location.pathname === "/hire-developer-requests" ? "active" : ""}
              onClick={() => handleNavigation("/hire-developer-requests")}
            >
              <span className="dot">•</span>
              <span>Hire Developer Requests</span>
            </li>
          </ul>
        )}

        <p className="sidebar-section-title">Support</p>
        <li
          className={`has-sub ${openSection === "Support" ? "open" : ""}`}
          onClick={() => toggle("Support")}
        >
          <div className="menu-row">
            <FaLifeRing className="menu-icon" />
            <span>Support</span>
            <FaChevronDown className="chev" />
          </div>
        </li>
        {openSection === "Support" && (
          <ul className="submenu">
            <li
              className={location.pathname === "/domain" ? "active" : ""}
              onClick={() => handleNavigation("/domain")}
            >
              <span className="dot">•</span>
              <span>Domain</span>
            </li>
            <li
              className={location.pathname === "/ticket" ? "active" : ""}
              onClick={() => handleNavigation("/ticket")}
            >
              <span className="dot">•</span>
              <span>Ticket</span>
            </li>
            <li
              className={location.pathname === "/raise-task" ? "active" : ""}
              onClick={() => handleNavigation("/raise-task")}
            >
              <span className="dot">•</span>
              <span>Raise Task</span>
            </li>
            <li
              className={location.pathname === "/live-support" ? "active" : ""}
              onClick={() => handleNavigation("/live-support")}
            >
              <span className="dot">•</span>
              <span>Live Support</span>
            </li>
          </ul>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
