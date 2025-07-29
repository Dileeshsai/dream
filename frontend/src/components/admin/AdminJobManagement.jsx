import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiGet, apiDelete, apiPost } from '../../services/apiService';

const AdminJobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await apiGet('/jobs');
                // Handle both array and object response formats
                const jobsData = Array.isArray(response.data)
                  ? response.data
                  : Array.isArray(response.data.jobs)
                    ? response.data.jobs
                    : [];
                setJobs(jobsData);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                setJobs([]); // Set to empty array on error
            }
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await apiDelete(`/jobs/${jobId}`);
                setJobs(jobs.filter(j => j.id !== jobId));
            } catch (error) {
                console.error("Failed to delete job:", error);
            }
        }
    };

    // Add handlers for accept/reject
    const handleAccept = async (jobId) => {
        try {
            await apiPost(`/jobs/${jobId}/accept`);
            setJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: 'accepted' } : j));
        } catch (error) {
            console.error("Failed to accept job:", error);
        }
    };

    const handleReject = async (jobId) => {
        try {
            await apiPost(`/jobs/${jobId}/reject`);
            setJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: 'rejected' } : j));
        } catch (error) {
            console.error("Failed to reject job:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="p-3 text-left font-semibold">Title</th>
                                <th className="p-3 text-left font-semibold">Location</th>
                                <th className="p-3 text-left font-semibold">Job Type</th>
                                <th className="p-3 text-left font-semibold">Salary Range</th>
                                <th className="p-3 text-left font-semibold">Status</th>
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
                            ) : (jobs || []).map(job => (
                                <tr key={job.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 font-medium">{job.title}</td>
                                    <td className="p-3">{job.location}</td>
                                    <td className="p-3 capitalize">{job.job_type}</td>
                                    <td className="p-3">{job.salary_range}</td>
                                    <td className="p-3 capitalize">{job.status || 'pending'}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                            <Button onClick={() => handleDelete(job.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                                            {job.status !== 'accepted' && (
                                                <Button onClick={() => handleAccept(job.id)} variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">Accept</Button>
                                            )}
                                            {job.status !== 'rejected' && (
                                                <Button onClick={() => handleReject(job.id)} variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminJobManagement; 