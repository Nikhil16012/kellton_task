import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Eye, UserCheck, UserX, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await adminService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminService.activateUser(userId);
      toast.success('User activated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await adminService.deactivateUser(userId);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  const handleViewUserDetails = async (user) => {
    try {
      const tasks = await adminService.getUserTasks(user._id);
      setUserTasks(tasks);
      setSelectedUser(user);
      setShowUserDetails(true);
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-dark">User Management</h1>
        <p className="text-secondary">Manage all registered users in the system</p>
      </div>
      {/* Users List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-light">
            <thead className="bg-secondary-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-light">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-dark">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-secondary">
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-dark">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleViewUserDetails(user)}
                        variant="info"
                        className="p-2 rounded-lg"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.isActive ? (
                        <Button
                          onClick={() => handleDeactivateUser(user._id)}
                          variant="danger"
                          className="p-2 rounded-lg"
                          title="Deactivate user"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivateUser(user._id)}
                          variant="success"
                          className="p-2 rounded-lg"
                          title="Activate user"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-secondary-dark bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <Card className="max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-secondary hover:text-primary-dark"
              onClick={() => setShowUserDetails(false)}
            >
              &times;
            </button>
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-secondary-dark">
                  User Details
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary">Name</label>
                  <p className="mt-1 text-sm text-secondary-dark">{selectedUser.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary">Email</label>
                  <p className="mt-1 text-sm text-secondary-dark">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary">Role</label>
                  <p className="mt-1 text-sm text-secondary-dark capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary">Joined</label>
                  <p className="mt-1 text-sm text-secondary-dark">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary">Tasks</label>
                  <ul className="list-disc ml-5 text-secondary-dark">
                    {userTasks.length === 0 ? (
                      <li>No tasks found</li>
                    ) : (
                      userTasks.map((task) => (
                        <li key={task._id}>{task.title}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 