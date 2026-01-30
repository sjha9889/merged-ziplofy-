import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AdminAuthProvider } from "./contexts/admin-auth.context";
import AuthProvider  from "./contexts/auth.context";
import { AssignedDevelopersProvider } from "./contexts/assign-developer.context";
import { NotificationsProvider } from "./contexts/notification.context";
import { SocketProvider } from "./contexts/socket.context";
import { SupportDevelopersProvider } from "./contexts/supportdeveloper.context";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import AdminLogin from "./Components/pages/AdminLogin";
import AdminDashboard from "./Components/pages/AdminDashboard";
import Navbar from "./Components/Navbar";
import ClientThemeInstallation from "./Components/pages/ClientThemeInstallation";
import ClientThemeCustomize from "./Components/pages/ClientThemeCustomize";
import ClientThemeEditor from "./Components/pages/ClientThemeEditor";

const App = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <NotificationsProvider>
          <SocketProvider>
            <SupportDevelopersProvider>
              <AssignedDevelopersProvider>
                <Router>
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
                  <Routes>
                    {/* Public routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Client theme routes */}
                    <Route path="/themes" element={<ClientThemeInstallation />} />
                    <Route path="/themes/customize/:installationId" element={<ClientThemeCustomize />} />
                    <Route path="/themes/editor/:installationId" element={<ClientThemeEditor />} />

                    {/* Protected admin routes */}
                    <Route path="/admin/*" element={
                      <AdminProtectedRoute>
                        <Routes>
                          <Route path="/dashboard" element={<AdminDashboard />} />
                          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="/*" element={<Navbar />} />
                        </Routes>
                      </AdminProtectedRoute>
                    } />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/themes" replace />} />
                    <Route path="*" element={<Navigate to="/themes" replace />} />
                  </Routes>
                </Router>
              </AssignedDevelopersProvider>
            </SupportDevelopersProvider>
          </SocketProvider>
        </NotificationsProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;
