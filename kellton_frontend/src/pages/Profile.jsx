import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-dark">Profile</h1>
        <p className="text-secondary">Manage your account information</p>
      </div>
      <Card className="max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-secondary-dark">Personal Information</h2>
          {!isEditing && (
            <Button type="button" onClick={() => setIsEditing(true)} variant="secondary">
              Edit Profile
            </Button>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Email
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user?.fullName || '',
                    email: user?.email || '',
                  });
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary">Full Name</label>
              <p className="mt-1 text-sm text-secondary-dark">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary">Email</label>
              <p className="mt-1 text-sm text-secondary-dark">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary">Role</label>
              <p className="mt-1 text-sm text-secondary-dark capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary">Account Status</label>
              <p className="mt-1 text-sm text-secondary-dark">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary">Member Since</label>
              <p className="mt-1 text-sm text-secondary-dark">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile; 