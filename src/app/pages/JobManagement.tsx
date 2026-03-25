import { useState, useEffect } from "react";
import axios from "axios";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
} from "lucide-react";

import { JobFormDialog } from "../components/JobFormDialog";
import { JobDetailsDialog } from "../components/JobDetailsDialog";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { toast } from "sonner";

export interface Job {
  _id?: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  description: string;
  type: string;
  salary: string;
  skills: string[];
  fullDescription: string;
}

const API_URL = "https://ghrbackenddata.onrender.com/api/jobs";

export function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const token = localStorage.getItem("token");

  // ✅ GET JOBS
  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ ADD / UPDATE JOB
const handleSaveJob = async (job: Job) => {
  try {
    if (selectedJob?._id) {
      // UPDATE
      await axios.put(`${API_URL}/${selectedJob._id}`, job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job updated successfully");
    } else {
      // ✅ REMOVE _id before CREATE
      const { _id, ...payload } = job;

      await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job created successfully");
    }

    fetchJobs();
    setIsFormOpen(false);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Error saving job");
  }
};

  // ✅ DELETE JOB
  const handleDeleteConfirm = async () => {
    try {
      if (!jobToDelete?._id) return;

      await axios.delete(`${API_URL}/${jobToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job deleted successfully");
      fetchJobs();
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Management</h2>

        <Button onClick={handleAddJob} className="gap-2 bg-[#1E5F85]">
          <Plus className="w-4 h-4" />
          Add Job
        </Button>
      </div>

      {/* JOB LIST */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <Card key={job._id} className="p-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </div>
                  </div>

                  <Badge>{job.type}</Badge>
                </div>

                <p className="text-sm text-gray-600">{job.description}</p>

                <div className="text-sm space-y-1">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>

                  <div className="flex gap-2">
                    <Briefcase className="w-4 h-4" />
                    {job.experience}
                  </div>

                  <div className="flex gap-2 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                </div>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-1">
                  {job.skills?.map((s, i) => (
                    <Badge key={i} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleViewJob(job)}>
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button size="sm" onClick={() => handleEditJob(job)}>
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(job)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No jobs found</p>
      )}

      {/* DIALOGS */}
      <JobFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        job={selectedJob}
        onSave={handleSaveJob}
      />

      <JobDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        job={selectedJob}
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        jobTitle={jobToDelete?.title || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}