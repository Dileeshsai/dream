
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
// Navbar is now in MainLayout
// import Navbar from '../common/Navbar';
import { 
  User, 
  Briefcase, 
  TrendingUp, 
  Bell, 
  Calendar,
  Award,
  Users,
  DollarSign,
  ArrowRight,
  Target,
  BookOpen
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Profile Views', value: '234', icon: User, color: 'blue' },
    { label: 'Job Applications', value: '12', icon: Briefcase, color: 'green' },
    { label: 'Network Connections', value: '89', icon: Users, color: 'purple' },
    { label: 'Skill Endorsements', value: '45', icon: Award, color: 'yellow' }
  ];

  const recentActivities = [
    { type: 'application', text: 'Applied for Senior Developer position at TechCorp', time: '2 hours ago' },
    { type: 'connection', text: 'Connected with Sarah Johnson', time: '1 day ago' },
    { type: 'skill', text: 'Received endorsement for React.js', time: '2 days ago' },
    { type: 'profile', text: 'Updated work experience', time: '3 days ago' }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'Remote',
      salary: '₹12-18 LPA',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'StartupXYZ',
      location: 'Bangalore',
      salary: '₹8-12 LPA',
      type: 'Full-time'
    }
  ];

  return (
    // The outer div and Navbar are removed
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 mb-4">Ready to take the next step in your career?</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm">Profile {user?.profileComplete}% complete</span>
                </div>
                <div className="w-48 bg-blue-500 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${user?.profileComplete}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src={user?.profileImage} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{activity.text}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
              <div className="space-y-3">
                <Link 
                  to="/profile" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Update Profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Add Skills</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Membership Status */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Premium Member</h3>
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm text-yellow-100 mb-4">
                Enjoy unlimited access to all features
              </p>
              <Link 
                to="/membership" 
                className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Manage Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
            <Link 
              to="/jobs" 
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <div 
                key={job.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{job.location}</span>
                  <span className="font-semibold text-green-600">{job.salary}</span>
                </div>
                <Link 
                  to={`/jobs/${job.id}`}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      // This div is now the root element
  );
};

export default Dashboard;
