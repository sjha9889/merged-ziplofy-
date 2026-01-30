import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import ThemeInstallation from "./pages/ThemeInstallation";
import ThemeCustomize from "./pages/ThemeCustomize";
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

  useEffect(() => {
    console.log("App mode (theme):", import.meta.env.MODE);
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);

  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Dashboard");
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

        {/* Right: Actions */}
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
        <Routes>
          <Route path="/client-list" element={<ClientList />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/manage-user" element={<ManageUser />} />
          <Route path="/roles-permission" element={<RolesPermission />} />
          <Route path="/domain" element={<Domain />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/raise-task" element={<RaiseTask />} />
          <Route path="/live-support" element={<LiveSupport />} />
          <Route path="/membership-plan" element={<MembershipPlan />} />
          <Route path="/dev-admin" element={<DevAdmin />} />
          <Route path="/theme-developer" element={<ThemeDeveloper />} />
          <Route path="/theme-installation" element={<ThemeInstallation storeId="default-store-id" />} />
          <Route path="/theme-customize/:installationId" element={<ThemeCustomize />} />
          <Route path="/support-developer" element={<SupportDeveloper />} />
          <Route path="/hire-developer-requests" element={<DevRequests />} />
          <Route path="/dashboard" element={
            <div className="dashboard">
              <h1>Dashboard</h1>
              <p>Welcome to the admin dashboard!</p>
            </div>
          } />
          <Route path="/" element={
            <div className="dashboard">
              <h1>Dashboard</h1>
              <p>Welcome to the admin dashboard!</p>
            </div>
          } />
        </Routes>
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
