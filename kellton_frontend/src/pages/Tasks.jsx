
import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import api from '../services/api';
import { Plus, Edit, Trash2, CheckCircle, Calendar, Tag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      setShowForm(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      dueDate: task.dueDate.split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await taskService.markTaskComplete(taskId);
      toast.success('Task marked as completed');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to mark task as completed');
    }
  };

  const generateDescription = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required to generate description");
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post('/ai/description', { summary: formData.title });
      setFormData(prev => ({ ...prev, description: res.data.description }));
      toast.success("Generated task description");
    } catch (err) {
      toast.error("AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      dueDate: '',
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks.csv');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'tasks.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: 'Title', dataKey: 'title' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Due Date', dataKey: 'dueDate' },
      { header: 'Status', dataKey: 'status' },
    ];
    const rows = filteredTasks.map(task => ({
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
    }));
    autoTable(doc, { columns, body: rows });
    doc.save('tasks.pdf');
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
      <div className="flex gap-2 justify-end">
        <Button onClick={exportToCSV} variant="secondary">Download CSV</Button>
        <Button onClick={exportToExcel} variant="secondary">Download Excel</Button>
        <Button onClick={exportToPDF} variant="secondary">Download PDF</Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">Tasks</h1>
          <p className="text-secondary">Manage your tasks and stay organized</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-sm font-medium ${filter === 'all' ? 'bg-primary-light text-primary-dark' : 'bg-secondary-light text-secondary-dark hover:bg-secondary'}`}
        >
          All ({tasks.length})
        </Button>
        <Button
          type="button"
          onClick={() => setFilter('pending')}
          className={`text-sm font-medium ${filter === 'pending' ? 'bg-primary-light text-primary-dark' : 'bg-secondary-light text-secondary-dark hover:bg-secondary'}`}
        >
          Pending ({tasks.filter(t => t.status === 'pending').length})
        </Button>
        <Button
          type="button"
          onClick={() => setFilter('completed')}
          className={`text-sm font-medium ${filter === 'completed' ? 'bg-primary-light text-primary-dark' : 'bg-secondary-light text-secondary-dark hover:bg-secondary'}`}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-secondary-dark bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-secondary hover:text-primary-dark"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
                resetForm();
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-secondary-dark">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Title</label>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Button type="button" onClick={generateDescription} disabled={generating} variant="secondary">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Category</label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={generating}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-light">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className={`flex items-start justify-between ${task.status === 'completed' ? 'bg-secondary-light' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-secondary-light' : 'text-secondary-dark'}`}>{task.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary-dark">
                    {task.category}
                  </span>
                </div>

                {task.description && (
                  <p className={`mt-2 text-sm ${task.status === 'completed' ? 'text-secondary-light' : 'text-secondary'}`}>{task.description}</p>
                )}

                <div className="flex items-center space-x-4 mt-3 text-sm text-secondary-light">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {task.status === 'pending' && (
                  <Button
                    onClick={() => handleComplete(task._id)}
                    variant="success"
                    className="p-2 rounded-lg"
                    title="Mark as completed"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  onClick={() => handleEdit(task)}
                  variant="info"
                  className="p-2 rounded-lg"
                  title="Edit task"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleDelete(task._id)}
                  variant="danger"
                  className="p-2 rounded-lg"
                  title="Delete task"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default Tasks;