import React from 'react';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12%', color: 'blue' },
    { label: 'Active Jobs', value: '2,847', change: '+8%', color: 'green' },
    { label: 'Applications', value: '45,623', change: '+15%', color: 'purple' },
    { label: 'Companies', value: '156', change: '+5%', color: 'yellow' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', joinDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Employer', joinDate: '2024-01-14', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', joinDate: '2024-01-13', status: 'Pending' },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior React Developer', company: 'TechCorp', applicants: 45, status: 'Active' },
    { id: 2, title: 'UI/UX Designer', company: 'DesignCo', applicants: 23, status: 'Active' },
    { id: 3, title: 'Data Scientist', company: 'DataLabs', applicants: 67, status: 'Closed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            <p className="text-blue-100">Welcome to the Dream Society control center.</p>
          </div>
          <Shield className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.change} vs last month</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/50`}>
                  {stat.label === 'Total Users' && <Users className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.label === 'Active Jobs' && <Briefcase className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.label === 'Applications' && <BarChart3 className={`w-6 h-6 text-${stat.color}-600`} />}
                  {stat.label === 'Companies' && <Briefcase className={`w-6 h-6 text-${stat.color}-600`} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{job.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} • {job.applicants} applicants</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 