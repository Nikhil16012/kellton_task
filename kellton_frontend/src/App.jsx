import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/Authcontext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import AdminUsers from './pages/Adminusers';
import LoadingSpinner from './components/Loadingspinner';
import Tasks from './pages/Tasks';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user is not admin and tries to access admin-only routes, redirect to /tasks
  if (user.role !== 'admin' && [
    '/admin',
    '/admin/users',
  ].includes(location.pathname)) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <Layout>
      <Routes>
        {/* Admin routes */}
        {user.role === 'admin' && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </>
        )}
        {/* User routes */}
        {user.role === 'user' && (
          <>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
          </>
        )}
        <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin' : '/tasks'} replace />} />
      </Routes>
    </Layout>
  );
}

export default App; 