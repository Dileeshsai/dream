import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiGet, apiPost, apiDelete } from '../../services/apiService';


const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth(); // for auth token
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  // Replace all individual form states with a single formData state
  const [formData, setFormData] = useState({
    user: { full_name: '', email: '', phone: '', password: '', role: 'member', is_verified: false },
    profile: { dob: '', gender: '', village: '', mandal: '', district: '', pincode: '', caste: '', subcaste: '', marital_status: '', native_place: '' },
    education: [{ degree: '', institution: '', year_of_passing: '', grade: '' }],
    employment: [{ company_name: '', role: '', years_of_experience: '', currently_working: false }],
    family: []
  });

  // Add step state
  const [step, setStep] = useState(1);
  const [addLoading, setAddLoading] = useState(false); // <-- Add this line

  // Add new state for view/edit modals and selected user
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // for view
  const [editUserData, setEditUserData] = useState(null); // for edit
  const [editLoading, setEditLoading] = useState(false);

  // Helper to fetch users (for reuse after edit/delete)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet('/admin/users');
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        setUsers([
          { id: 1, full_name: 'John Doe', email: 'john@example.com', phone: '+1234567890', role: 'member' },
          { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', role: 'admin' }
        ]);
        setError(null);
      } else {
        setError("Failed to fetch users. Please try again.");
        setUsers([]);
      }
    }
    setLoading(false);
  };

  // Replace useEffect to use fetchUsers helper
  useEffect(() => {
    if (user?.token) {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setLoading(true);
    setError(null);
    try {
        const response = await apiGet(`/admin/users?search=${term}`);
        setUsers(response.data?.users || []);
    } catch (error) {
        console.error("Failed to search users:", error);
        setError("Failed to search users. Please try again.");
        setUsers([]);
    }
    setLoading(false);
  };

  // Update handleDelete to refresh user list after delete
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await apiDelete(`/admin/users/${userId}`);
            await fetchUsers(); // refresh list
        } catch (error) {
            console.error("Failed to delete user:", error);
            setError("Failed to delete user. Please try again.");
        }
    }
  }

  // View user handler
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Edit user handler
  const handleEditUser = (user) => {
    // Deep copy user data for editing
    setEditUserData(JSON.parse(JSON.stringify(user)));
    setShowEditModal(true);
  };

  // Edit form change handler (for basic info only, can be expanded)
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUserData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Edit submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError(null);
    try {
      // Use PUT or POST as per backend (assuming PUT here)
      await apiPost(`/admin/users/update/${editUserData.id}`, editUserData);
      setShowEditModal(false);
      setEditUserData(null);
      await fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to update user.');
    }
    setEditLoading(false);
  };

  // Update all handleChange functions to update formData accordingly
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({
      ...f,
      user: { ...f.user, [name]: type === 'checkbox' ? checked : value }
    }));
  };
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({
      ...f,
      profile: { ...f.profile, [name]: type === 'checkbox' ? checked : value }
    }));
  };
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(f => {
      const newEducation = [...f.education];
      newEducation[index][name] = value;
      return { ...f, education: newEducation };
    });
  };
  const handleEmploymentChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(f => {
      const newEmployment = [...f.employment];
      newEmployment[index][name] = type === 'checkbox' ? checked : value;
      return { ...f, employment: newEmployment };
    });
  };
  const handleFamilyChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(f => {
      const newFamily = [...f.family];
      newFamily[index][name] = value;
      return { ...f, family: newFamily };
    });
  };
  const addFamilyMember = () => {
    setFormData(f => ({ ...f, family: [...f.family, { name: '', relation: '', education: '', profession: '' }] }));
  };
  const removeFamilyMember = (index) => {
    setFormData(f => {
      const newFamily = [...f.family];
      newFamily.splice(index, 1);
      return { ...f, family: newFamily };
    });
  };

  // Refactor handleAddUser to submit the entire formData to the new endpoint
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      setAddLoading(false);
      return;
    }
    setAddLoading(true);
    try {
      await apiPost('/admin/users/full', formData);
      setShowAddModal(false);
      // Reset formData
      setFormData({
        user: { full_name: '', email: '', phone: '', password: '', role: 'member', is_verified: false },
        profile: { dob: '', gender: '', village: '', mandal: '', district: '', pincode: '', caste: '', subcaste: '', marital_status: '', native_place: '' },
        education: [{ degree: '', institution: '', year_of_passing: '', grade: '' }],
        employment: [{ company_name: '', role: '', years_of_experience: '', currently_working: false }],
        family: []
      });
      // Refresh user list, etc.
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to add user.');
    }
    setAddLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button 
            onClick={() => setShowAddModal(true)} 
            variant="default"
          >
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left font-semibold">Full Name</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Phone</th>
                  <th className="p-3 text-left font-semibold">Role</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map(u => (
                    <tr key={u.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3">{u.full_name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.phone}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewUser(u)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditUser(u)}><Edit className="h-4 w-4" /></Button>
                          <Button onClick={() => handleDelete(u.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      {error ? 'Failed to load users' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-6">
            {/* Stepper Indicator */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${step === 1 ? 'font-bold text-blue-600' : 'text-gray-400'}`}>1. Select Role</div>
              <div className="w-8 h-0.5 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step === 2 ? 'font-bold text-blue-600' : 'text-gray-400'}`}>2. User Details</div>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-8">
                <div className="flex gap-8">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all shadow-sm w-48 h-40 text-lg font-semibold focus:outline-none ${formData.user.role === 'admin' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-400'}`}
                    onClick={() => setFormData(f => ({ ...f, user: { ...f.user, role: 'admin' } }))}
                  >
                    <span className="mb-2">👑</span>
                    Admin
                  </button>
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all shadow-sm w-48 h-40 text-lg font-semibold focus:outline-none ${formData.user.role === 'member' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-400'}`}
                    onClick={() => setFormData(f => ({ ...f, user: { ...f.user, role: 'member' } }))}
                  >
                    <span className="mb-2">🧑‍💼</span>
                    Member
                  </button>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.user.role}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: User Details */}
            {step === 2 && (
              <>
                {/* Basic User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" name="full_name" value={formData.user.full_name} onChange={handleUserChange} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.user.email} onChange={handleUserChange} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.user.phone} onChange={handleUserChange} required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" value={formData.user.password} onChange={handleUserChange} required />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="is_verified">Verified</Label>
                      <Switch id="is_verified" name="is_verified" checked={formData.user.is_verified} onCheckedChange={val => setFormData(f => ({ ...f, user: { ...f.user, is_verified: val } }))} />
                    </div>
                  </div>
                </div>

                {/* Member-specific forms - only show if role is member */}
                {formData.user.role === 'member' && (
                  <>
                    {/* Profile Information */}
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold border-b pb-2">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" name="dob" type="date" value={formData.profile.dob} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={formData.profile.gender} onValueChange={val => setFormData(f => ({ ...f, profile: { ...f.profile, gender: val } }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="village">Village</Label>
                          <Input id="village" name="village" value={formData.profile.village} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="mandal">Mandal</Label>
                          <Input id="mandal" name="mandal" value={formData.profile.mandal} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="district">District</Label>
                          <Input id="district" name="district" value={formData.profile.district} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="pincode" value={formData.profile.pincode} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="caste">Caste</Label>
                          <Input id="caste" name="caste" value={formData.profile.caste} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="subcaste">Subcaste</Label>
                          <Input id="subcaste" name="subcaste" value={formData.profile.subcaste} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="marital_status">Marital Status</Label>
                          <Input id="marital_status" name="marital_status" value={formData.profile.marital_status} onChange={handleProfileChange} />
                        </div>
                        <div>
                          <Label htmlFor="native_place">Native Place</Label>
                          <Input id="native_place" name="native_place" value={formData.profile.native_place} onChange={handleProfileChange} />
                        </div>
                      </div>
                    </div>

                    {/* Education Information */}
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold border-b pb-2">Education Information</h3>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`degree-${index}`}>Degree</Label>
                            <Input id={`degree-${index}`} name="degree" value={edu.degree} onChange={e => handleEducationChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`institution-${index}`}>Institution</Label>
                            <Input id={`institution-${index}`} name="institution" value={edu.institution} onChange={e => handleEducationChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`year_of_passing-${index}`}>Year of Passing</Label>
                            <Input id={`year_of_passing-${index}`} name="year_of_passing" type="number" value={edu.year_of_passing} onChange={e => handleEducationChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`grade-${index}`}>Grade</Label>
                            <Input id={`grade-${index}`} name="grade" value={edu.grade} onChange={e => handleEducationChange(index, e)} />
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addFamilyMember} className="w-full mt-2">
                        Add Education
                      </Button>
                    </div>

                    {/* Employment Information */}
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>
                      {formData.employment.map((emp, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`company_name-${index}`}>Company Name</Label>
                            <Input id={`company_name-${index}`} name="company_name" value={emp.company_name} onChange={e => handleEmploymentChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`role-${index}`}>Job Role</Label>
                            <Input id={`role-${index}`} name="role" value={emp.role} onChange={e => handleEmploymentChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`years_of_experience-${index}`}>Years of Experience</Label>
                            <Input id={`years_of_experience-${index}`} name="years_of_experience" type="number" step="0.1" value={emp.years_of_experience} onChange={e => handleEmploymentChange(index, e)} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`currently_working-${index}`}>Currently Working</Label>
                            <Switch id={`currently_working-${index}`} name="currently_working" checked={emp.currently_working} onCheckedChange={val => handleEmploymentChange(index, { target: { name: 'currently_working', value: val } })} />
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addFamilyMember} className="w-full mt-2">
                        Add Employment
                      </Button>
                    </div>

                    {/* Family Members */}
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold border-b pb-2">Family Members</h3>
                      {formData.family.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`family_name-${index}`}>Name</Label>
                            <Input id={`family_name-${index}`} name="name" value={member.name} onChange={e => handleFamilyChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`family_relation-${index}`}>Relation</Label>
                            <Input id={`family_relation-${index}`} name="relation" value={member.relation} onChange={e => handleFamilyChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`family_education-${index}`}>Education</Label>
                            <Input id={`family_education-${index}`} name="education" value={member.education} onChange={e => handleFamilyChange(index, e)} />
                          </div>
                          <div>
                            <Label htmlFor={`family_profession-${index}`}>Profession</Label>
                            <Input id={`family_profession-${index}`} name="profession" value={member.profession} onChange={e => handleFamilyChange(index, e)} />
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addFamilyMember} className="w-full mt-2">
                        Add Family Member
                      </Button>
                    </div>
                  </>
                )}

                {/* Stepper Navigation */}
                <div className="flex gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={addLoading || !user || !user.token}>
                    {addLoading ? 'Adding...' : 'Add User'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div>
                <b>Full Name:</b> {selectedUser.full_name}<br />
                <b>Email:</b> {selectedUser.email}<br />
                <b>Phone:</b> {selectedUser.phone}<br />
                <b>Role:</b> {selectedUser.role}
              </div>
              {/* Member-specific details */}
              {selectedUser.role === 'member' && (
                <>
                  {/* Profile */}
                  {selectedUser.profile && (
                    <div>
                      <h4 className="font-semibold mt-4 mb-2">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><b>Date of Birth:</b> {selectedUser.profile.dob}</div>
                        <div><b>Gender:</b> {selectedUser.profile.gender}</div>
                        <div><b>Village:</b> {selectedUser.profile.village}</div>
                        <div><b>Mandal:</b> {selectedUser.profile.mandal}</div>
                        <div><b>District:</b> {selectedUser.profile.district}</div>
                        <div><b>Pincode:</b> {selectedUser.profile.pincode}</div>
                        <div><b>Caste:</b> {selectedUser.profile.caste}</div>
                        <div><b>Subcaste:</b> {selectedUser.profile.subcaste}</div>
                        <div><b>Marital Status:</b> {selectedUser.profile.marital_status}</div>
                        <div><b>Native Place:</b> {selectedUser.profile.native_place}</div>
                      </div>
                    </div>
                  )}
                  {/* Education */}
                  {selectedUser.education && selectedUser.education.length > 0 && (
                    <div>
                      <h4 className="font-semibold mt-4 mb-2">Education</h4>
                      <ul className="list-disc ml-6">
                        {selectedUser.education.map((edu, idx) => (
                          <li key={idx}>
                            <b>Degree:</b> {edu.degree}, <b>Institution:</b> {edu.institution}, <b>Year:</b> {edu.year_of_passing}, <b>Grade:</b> {edu.grade}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Employment */}
                  {selectedUser.employment && selectedUser.employment.length > 0 && (
                    <div>
                      <h4 className="font-semibold mt-4 mb-2">Employment</h4>
                      <ul className="list-disc ml-6">
                        {selectedUser.employment.map((emp, idx) => (
                          <li key={idx}>
                            <b>Company:</b> {emp.company_name}, <b>Role:</b> {emp.role}, <b>Years:</b> {emp.years_of_experience}, <b>Current:</b> {emp.currently_working ? 'Yes' : 'No'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Family */}
                  {selectedUser.family && selectedUser.family.length > 0 && (
                    <div>
                      <h4 className="font-semibold mt-4 mb-2">Family Members</h4>
                      <ul className="list-disc ml-6">
                        {selectedUser.family.map((fam, idx) => (
                          <li key={idx}>
                            <b>Name:</b> {fam.name}, <b>Relation:</b> {fam.relation}, <b>Education:</b> {fam.education}, <b>Profession:</b> {fam.profession}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUserData && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit_full_name">Full Name</Label>
                <Input id="edit_full_name" name="full_name" value={editUserData.full_name || ''} onChange={handleEditChange} required />
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input id="edit_email" name="email" type="email" value={editUserData.email || ''} onChange={handleEditChange} required />
              </div>
              <div>
                <Label htmlFor="edit_phone">Phone</Label>
                <Input id="edit_phone" name="phone" value={editUserData.phone || ''} onChange={handleEditChange} required />
              </div>
              <div>
                <Label htmlFor="edit_role">Role</Label>
                <Select value={editUserData.role} onValueChange={val => setEditUserData(prev => ({ ...prev, role: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Add more fields for profile, education, etc. as needed */}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement; 