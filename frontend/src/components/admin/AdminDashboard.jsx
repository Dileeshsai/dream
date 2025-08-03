import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  Shield,
  Building,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import {
  UserRegistrationTrend,
  UserRoleDistribution,
  UserVerificationStatus,
  JobStatusDistribution,
  JobTypeDistribution,
  TopJobsByApplications
} from './AdminCharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [jobAnalytics, setJobAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        usersResponse,
        jobsResponse,
        userAnalyticsResponse,
        jobAnalyticsResponse
      ] = await Promise.all([
        adminDashboardService.getDashboardStats(),
        adminDashboardService.getRecentUsers(5),
        adminDashboardService.getRecentJobs(5),
        adminDashboardService.getUserAnalytics(),
        adminDashboardService.getJobAnalytics()
      ]);

      setStats(statsResponse.stats);
      setRecentUsers(usersResponse.users);
      setRecentJobs(jobsResponse.jobs);
      setUserAnalytics(userAnalyticsResponse);
      setJobAnalytics(jobAnalyticsResponse);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Users': Users,
      'Briefcase': Briefcase,
      'BarChart3': BarChart3,
      'Building': Building
    };
    return iconMap[iconName] || Users;
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        {stats.map((stat, index) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className={`text-sm font-medium ${getChangeColor(stat.change)}`}>
                    {stat.change} vs last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/50`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      {userAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserRegistrationTrend data={userAnalytics.registrationTrend} />
          <UserRoleDistribution data={userAnalytics.roleDistribution} />
        </div>
      )}

      {userAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserVerificationStatus data={userAnalytics.verificationStatus} />
          {jobAnalytics && <JobStatusDistribution data={jobAnalytics.jobStatusDistribution} />}
        </div>
      )}

      {jobAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JobTypeDistribution data={jobAnalytics.jobTypeDistribution} />
          <TopJobsByApplications data={jobAnalytics.topJobsByApplications} />
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
            <button
              onClick={() => fetchDashboardData()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {user.role} • Joined {user.joinDate}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent users found</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Jobs</h3>
            <button
              onClick={() => fetchDashboardData()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{job.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.company} • {job.applicants} applicants
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent jobs found</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">View and edit user accounts</p>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Briefcase className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Job Management</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review and approve jobs</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 