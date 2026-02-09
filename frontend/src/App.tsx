import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { AdminAuthProvider, useAdminAuth } from "./contexts/admin-auth.context";
import AdminLogin from "./Components/pages/AdminLogin";
import AdminDashboard from "./Components/pages/AdminDashboard";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import ThemeEditPage from "./Components/pages/ThemeEditPage";
import { AssignedDevelopersProvider } from "./contexts/assign-developer.context";
import { NotificationsProvider } from "./contexts/notification.context";
import { SocketProvider } from "./contexts/socket.context";
import { SupportDevelopersProvider } from "./contexts/supportdeveloper.context";

const App = () => {
  const AuthedApp = () => {
    const { user, token } = useAdminAuth();
    const isAuthed = Boolean(user && token);
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        {!isAuthed ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/themes/edit/:themeId"
                element={
                  <AdminProtectedRoute>
                    <div style={{ marginLeft: 240, padding: 0 }}>
                      {/* Route handled by Navbar */}
                    </div>
                  </AdminProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </>
        )}
      </>
    );
  };

  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <NotificationsProvider>
          <SocketProvider>
            <SupportDevelopersProvider>
              <AssignedDevelopersProvider>
                <AuthedApp />
              </AssignedDevelopersProvider>
            </SupportDevelopersProvider>
          </SocketProvider>
        </NotificationsProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
