import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBars,
  FaBell,
  FaClock,
  FaCompress,
  FaEnvelope,
  FaExpand,
  FaMoon,
  FaQuestionCircle,
  FaSearch,
  FaSignOutAlt,
  FaSun,
  FaThLarge,
} from "react-icons/fa";
import { useNotifications } from "../contexts/notification.context";
import { useAddEventListener } from "../hooks/useAddEventListener";
import "./Navbar.css";
import MessagesPopup from "./MessagesPopup";
import NotificationPopup from "./NotificationPopup";
import Sidebar from "./Sidebar";
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

const MENU_ITEMS: MenuItem[] = [
  "Client List",
  "Payment",
  "Invoice",
  "Manage User",
  "Roles & Permission",
  "Domain",
  "Ticket",
  "Raise Task",
  "Live Support",
  "Membership Plan",
  "Dev Admin",
  "Theme Developer",
  "Support Developer",
  "Hire Developer Requests",
];

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
  const [messagesPopupOpen, setMessagesPopupOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(30 * 60 + 55); // 30:55
  const messagesButtonRef = useRef<HTMLButtonElement>(null);

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

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 30 * 60 + 55));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Search: navigate to matching menu item on Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const match = MENU_ITEMS.find(
        (item) => item.toLowerCase().includes(query) || query.split(" ").every((w) => item.toLowerCase().includes(w))
      );
      if (match) {
        setActiveMenu(match);
        sessionStorage.setItem("activeMenu", match);
        setSidebarOpen(true);
        toast.success(`Navigated to ${match}`);
      } else {
        toast.error("No matching menu item found");
      }
    }
  };

  // Navigate to overview (Client List as default)
  const handleGridClick = () => {
    setActiveMenu("Client List");
    sessionStorage.setItem("activeMenu", "Client List");
    setSidebarOpen(true);
    toast.success("Viewing overview");
  };

  // Help
  const handleHelpClick = () => {
    toast.success("Help: Contact support or visit documentation for assistance.");
  };

  return (
    <>
      <header className={`navbar${theme === "dark" ? " dark" : ""}`}>
        {/* Left: Logo + Sidebar Toggle */}
        <div className="navbar-left">
          <img src="/LOGO.png" alt="Ziplofy Logo" className="navbar-logo" />
          <button
            className={`icon-tile plan-tile${sidebarOpen ? " active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        {/* Middle: Search */}
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search menu..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Right: Actions + User */}
        <div className="navbar-actions">
          <button
            className="icon-tile tile-slate"
            aria-label="Fullscreen"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
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
          <button
            className="icon-tile tile-indigo"
            aria-label="Grid"
            onClick={handleGridClick}
          >
            <FaThLarge />
          </button>
          <button
            className="icon-tile tile-purple"
            aria-label="Help"
            onClick={handleHelpClick}
          >
            <FaQuestionCircle />
          </button>
          {user && (
            <div className="user-info">
              <button className="logout-button" aria-label="Logout" onClick={logout}>
                <FaSignOutAlt />
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
          <button
            ref={messagesButtonRef}
            className="icon-tile tile-messages has-badge"
            aria-label="Messages"
            onClick={() => setMessagesPopupOpen(!messagesPopupOpen)}
          >
            <FaEnvelope />
            <span className="badge-count">13</span>
          </button>
          <div className="pill" aria-label="Session timer">
            <FaClock />
            {formatTimer(timerSeconds)}
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
          marginLeft: sidebarOpen ? 280 : 0,
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

      {/* Messages Popup */}
      <MessagesPopup
        isOpen={messagesPopupOpen}
        onClose={() => setMessagesPopupOpen(false)}
        buttonRef={messagesButtonRef}
      />
    </>
  );
};

export default Navbar;
