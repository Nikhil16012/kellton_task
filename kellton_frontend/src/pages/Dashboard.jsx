import React, { useState, useEffect } from 'react';
import  {useAuth}  from '../context/Authcontext';
import { taskService } from '../services/taskService';
import { format } from 'date-fns';
import { CheckCircle, Clock, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return taskDate === today && task.status === 'pending';
  });

  const upcomingTasks = tasks
    .filter(task => {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate > today && task.status === 'pending';
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">Dashboard</h1>
          <p className="text-secondary">Welcome back, {user?.fullName}!</p>
        </div>
        <Link to="/tasks" className="no-underline">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Pending Tasks</p>
              <p className="text-2xl font-semibold text-secondary-dark">{pendingTasks.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Completed Tasks</p>
              <p className="text-2xl font-semibold text-secondary-dark">{completedTasks.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Due Today</p>
              <p className="text-2xl font-semibold text-secondary-dark">{todayTasks.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary">Completion Rate</p>
              <p className="text-2xl font-semibold text-secondary-dark">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* Upcoming Tasks */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-dark">Upcoming Tasks</h2>
          <Link to="/tasks" className="text-primary hover:text-primary-dark text-sm">
            View all
          </Link>
        </div>
        {upcomingTasks.length === 0 ? (
          <p className="text-secondary text-center py-8">No upcoming tasks</p>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 bg-secondary-light rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-dark">{task.title}</h3>
                  <p className="text-sm text-secondary">
                    Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-dark">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-dark mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div key={task._id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-secondary-dark">{task.title}</p>
                <p className="text-xs text-secondary">
                  {task.status === 'completed' ? 'Completed' : 'Created'} on{' '}
                  {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard; 