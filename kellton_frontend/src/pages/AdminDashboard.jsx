import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { Users, UserCheck, UserX, BarChart3 } from 'lucide-react';
import Card from '../components/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        <h1 className="text-2xl font-bold text-secondary-dark">Admin Dashboard</h1>
        <p className="text-secondary">Overview of system statistics and user management</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Total Users</p>
              <p className="text-2xl font-semibold text-secondary-dark">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Active Users</p>
              <p className="text-2xl font-semibold text-secondary-dark">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserX className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Deactivated Users</p>
              <p className="text-2xl font-semibold text-secondary-dark">{stats?.deactivatedUsers || 0}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Active Rate</p>
              <p className="text-2xl font-semibold text-secondary-dark">
                {stats && stats.totalUsers > 0 
                  ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-secondary-light rounded-xl">
            <h3 className="font-medium text-secondary-dark mb-2">User Management</h3>
            <p className="text-sm text-secondary mb-3">
              View and manage all registered users, activate or deactivate accounts.
            </p>
            <a
              href="/admin/users"
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              Manage Users →
            </a>
          </div>
          <div className="p-4 border border-secondary-light rounded-xl">
            <h3 className="font-medium text-secondary-dark mb-2">System Overview</h3>
            <p className="text-sm text-secondary mb-3">
              Monitor system performance and user activity patterns.
            </p>
            <span className="text-secondary-light text-sm font-medium">
              Coming Soon
            </span>
          </div>
        </div>
      </Card>
      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-dark mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800">System is running normally</span>
            </div>
            <span className="text-xs text-green-600">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary-light rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-primary-dark">Database connection active</span>
            </div>
            <span className="text-xs text-primary">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">API endpoints responding</span>
            </div>
            <span className="text-xs text-yellow-600">Healthy</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard; 