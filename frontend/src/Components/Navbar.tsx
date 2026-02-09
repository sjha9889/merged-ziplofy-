import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaBell,
  FaChartPie,
  FaEnvelope,
  FaExpand,
  FaMoon,
  FaQuestionCircle,
  FaSearch,
  FaSun,
  FaThLarge,
} from "react-icons/fa";
import { useNotifications } from "../contexts/notification.context";
import { useAddEventListener } from "../hooks/useAddEventListener";
import "./Navbar.css";
import NotificationPopup from "./NotificationPopup";
import Sidebar from "./Sidebar"; // Import Sidebar
import { useAdminAuth } from "../contexts/admin-auth.context";
import ClientList from "./pages/ClientList";
import DevAdmin from "./pages/DevAdmin";
import DevRequests from "./pages/DevRequests";
import Domain from "./pages/Domain";
import Invoice from "./pages/Invoice";
import LiveSupport from "./pages/LiveSupport";
import ManageUser from "./pages/ManageUser";
import MembershipPlan from "./pages/MembershipPlan";
import Payment from "./pages/Payment";
import RaiseTask from "./pages/RaiseTask";
import RolesPermission from "./pages/RolesPermission";
import SupportDeveloper from "./pages/SupportDeveloper";
import ThemeDeveloper from "./pages/ThemeDeveloper";
import ThemeEditPage from "./pages/ThemeEditPage";
import Ticket from "./pages/Ticket";

// Optional: type for active menu items
type MenuItem =
  | "Client List"
  | "Payment"
  | "Invoice"
  | "Manage User"
  | "Roles & Permission"
  | "Domain"
  | "Ticket"
  | "Raise Task"
  | "Live Support"
  | "Membership Plan"
  | "Dev Admin"
  | "Theme Developer"
  | "Support Developer"
  | "Hire Developer Requests"
  | "Dashboard";

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("App mode (theme):", import.meta.env.MODE);
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);

  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  // Initialize activeMenu from sessionStorage if available, otherwise default to Dashboard
  const [activeMenu, setActiveMenu] = useState<MenuItem>(() => {
    const savedMenu = sessionStorage.getItem('activeMenu') as MenuItem;
    return savedMenu || "Dashboard";
  });
  const [notificationPopupOpen, setNotificationPopupOpen] = useState<boolean>(false);

  // Notifications context
  const { notifications, setNotifications, fetchNotifications } = useNotifications();

  // Ref for notification button
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for hireDeveloper event
  useAddEventListener("hireDeveloper", (data: any) => {
    console.log("Hire Developer Event Received in Navbar:", data);

    if (data && data.notifications && Array.isArray(data.notifications)) {
      setNotifications((prev) => [...data.notifications, ...prev]);
      console.log("Notifications added to context state successfully!");
    }
  });

  const { user, logout } = useAdminAuth();

  return (
    <>
      <header className={`navbar${theme === "dark" ? " dark" : ""}`}>
        {/* Left: Logo + Sidebar Toggle */}
        <div className="navbar-left">
          <img src="./LOGO.png" alt="Logo" className="navbar-logo" />
          <button
            className="icon-tile active plan-tile"
            aria-label="Plan"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="plan-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="7" height="7" rx="2" fill="#34d399" />
              <rect x="13" y="4" width="7" height="7" rx="2" fill="#60a5fa" />
              <rect x="4" y="13" width="7" height="7" rx="2" fill="#fbbf24" />
              <rect x="13" y="13" width="7" height="7" rx="2" fill="#a78bfa" />
            </svg>
          </button>
        </div>

        {/* Middle: Search */}
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        {/* Right: Actions + User */}
        <div className="navbar-actions">
          <button className="icon-tile tile-slate" aria-label="Fullscreen">
            <FaExpand />
          </button>
          <div className="theme-toggle" role="group" aria-label="Theme toggle">
            <button
              className={`icon-tile${theme === "light" ? " active" : ""}`}
              aria-label="Light mode"
              onClick={() => setTheme("light")}
            >
              <FaSun />
            </button>
            <button
              className={`icon-tile${theme === "dark" ? " active" : ""}`}
              aria-label="Dark mode"
              onClick={() => setTheme("dark")}
            >
              <FaMoon />
            </button>
          </div>
          <button className="icon-tile tile-indigo" aria-label="Grid">
            <FaThLarge />
          </button>
          <button className="icon-tile tile-purple" aria-label="Help">
            <FaQuestionCircle />
          </button>
          <button className="icon-tile tile-yellow" aria-label="Analytics">
            <FaChartPie />
          </button>
          {user && (
            <div className="user-info">
              <button className="logout-button" aria-label="Logout" onClick={logout}>
                Logout
              </button>
            </div>
          )}
          <button
            ref={notificationButtonRef}
            className="icon-tile tile-blue has-badge"
            aria-label="Notifications"
            onClick={() => setNotificationPopupOpen(!notificationPopupOpen)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="badge-count">{notifications.length}</span>
            )}
          </button>
          <button className="icon-tile has-badge" aria-label="Messages">
            <FaEnvelope />
            <span className="badge-count">13</span>
          </button>
          <div className="pill" aria-label="Timer">
            30:55
          </div>
          <span className="status-dot" aria-hidden="true"></span>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeMenu}
        onSelect={(item: string) => {
          const menuItem = item as MenuItem;
          setActiveMenu(menuItem);
          // Save to sessionStorage so it persists across navigation
          sessionStorage.setItem('activeMenu', menuItem);
        }}
      />

      {/* Main content */}
      <div
        className="main-content"
        style={{
          marginLeft: sidebarOpen ? 240 : 0,
          padding: 16,
          transition: "margin-left 0.3s ease",
        }}
      >
        {(() => {
          const isEditPage = location.pathname.startsWith('/admin/themes/edit/');
          console.log('📍 Navbar main-content render:', { pathname: location.pathname, isEditPage, activeMenu });
          
          if (isEditPage) {
            console.log('✅ Rendering ThemeEditPage');
            return <ThemeEditPage />;
          }
          
          return (
            <>
              {activeMenu === "Client List" && <ClientList />}
              {activeMenu === "Payment" && <Payment />}
              {activeMenu === "Invoice" && <Invoice />}
              {activeMenu === "Manage User" && <ManageUser />}
              {activeMenu === "Roles & Permission" && <RolesPermission />}
              {activeMenu === "Domain" && <Domain />}
              {activeMenu === "Ticket" && <Ticket />}
              {activeMenu === "Raise Task" && <RaiseTask />}
              {activeMenu === "Live Support" && <LiveSupport />}
              {activeMenu === "Membership Plan" && <MembershipPlan />}
              {activeMenu === "Dev Admin" && <DevAdmin />}
              {activeMenu === "Theme Developer" && <ThemeDeveloper />}
              {activeMenu === "Support Developer" && <SupportDeveloper />}
              {activeMenu === "Hire Developer Requests" && <DevRequests />}
            </>
          );
        })()}
      </div>

      {/* Notification Popup */}
      <NotificationPopup
        isOpen={notificationPopupOpen}
        onClose={() => setNotificationPopupOpen(false)}
        buttonRef={notificationButtonRef}
      />
    </>
  );
};

export default Navbar;
