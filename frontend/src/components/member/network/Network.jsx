import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, GraduationCap, Building, Eye, UserPlus, Filter, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '../../../services/apiService';
import MemberProfileModal from './MemberProfileModal';

const Network = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchMembers = async (page = 1, search = '', sort = 'recent') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy: sort
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/users/members?${params}`);
      setMembers(response.data.members);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = () => {
    fetchMembers(1, searchTerm, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchMembers(1, searchTerm, value);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchMembers(pagination.page + 1, searchTerm, sortBy);
    }
  };

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Network</h3>
              <p className="text-gray-500 dark:text-gray-400">Discovering amazing professionals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Network
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with talented professionals and expand your network within our community
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(pagination.total * 0.3)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Industries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search by name, profession, or company..." 
                  className="pl-12 h-12 text-lg border-0 bg-gray-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full lg:w-[180px] h-12 border-0 bg-gray-50 dark:bg-slate-700">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" 
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {members.map((member) => (
            <Card 
              key={member.id} 
              className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => handleViewProfile(member)}
            >
              <CardContent className="p-4">
                {/* Profile Header */}
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <Avatar className="w-14 h-14 border-2 border-blue-200 dark:border-blue-800">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">{member.name}</h3>
                  
                  {member.title && member.title !== 'Professional' && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-1 truncate">{member.title}</p>
                  )}
                  
                  {member.company && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{member.company}</p>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-2 mb-3">
                  {member.education && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <GraduationCap className="h-3 w-3 text-blue-500" />
                      <span className="truncate">{member.education}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <MapPin className="h-3 w-3 text-green-500" />
                    <span className="truncate">{member.location}</span>
                  </div>
                </div>

                {/* Experience */}
                {member.yearsOfExperience && (
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{member.yearsOfExperience} years exp.</p>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.caste && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5">
                      {member.caste}
                    </Badge>
                  )}
                  {member.district && (
                    <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 text-xs px-2 py-0.5">
                      {member.district}
                    </Badge>
                  )}
                </div>

                {/* Connections */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{member.mutualConnections} connections</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button 
                    className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(member);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white text-xs font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {pagination.page < pagination.pages && (
          <div className="text-center">
            <Button 
              onClick={handleLoadMore}
              disabled={loading}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Members'
              )}
            </Button>
          </div>
        )}

        {/* No Results */}
        {members.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No members found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Profile Modal */}
        <MemberProfileModal 
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Network; 


