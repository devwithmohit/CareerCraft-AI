"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobStore } from '@/store/job-store';
import { useResumeStore } from '@/store/resume-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building,
  MapPin,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  FileText,
  Plus,
  Search,
  Star,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Upload,
  Link,
  User,
  Briefcase,
  Globe,
  DollarSign
} from 'lucide-react';
import type { JobApplication, Job } from '@/store/job-store';

// Form validation schema
const applicationSchema = z.object({
  jobId: z.string().min(1, 'Please select a job'),
  resumeId: z.string().min(1, 'Please select a resume'),
  coverLetterId: z.string().optional(),
  status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  appliedAt: z.string(),
  notes: z.string().optional(),
  customJobTitle: z.string().optional(),
  customCompany: z.string().optional(),
  customLocation: z.string().optional(),
  customUrl: z.string().url().optional().or(z.literal('')),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  contacts: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'),
    notes: z.string().optional(),
  })).optional(),
  reminders: z.array(z.object({
    type: z.enum(['follow-up', 'interview', 'custom']),
    date: z.string(),
    message: z.string().min(1, 'Message is required'),
  })).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface AddApplicationProps {
  children?: React.ReactNode;
  defaultJobId?: string;
  onSuccess?: (application: JobApplication) => void;
}

export default function AddApplication({
  children,
  defaultJobId,
  onSuccess
}: AddApplicationProps) {
  const {
    jobs,
    createApplication,
    getJobById,
    searchJobs,
    isLoading: jobsLoading
  } = useJobStore();

  const { resumes } = useResumeStore();
  const { addNotification } = useUIStore();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCustomJob, setIsCustomJob] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [contacts, setContacts] = useState<ApplicationFormData['contacts']>([]);
  const [reminders, setReminders] = useState<ApplicationFormData['reminders']>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'draft',
      appliedAt: new Date().toISOString().split('T')[0],
      notes: '',
      contacts: [],
      reminders: [],
    }
  });

  const watchedJobId = watch('jobId');
  const watchedStatus = watch('status');

  // Load default job if provided
  useEffect(() => {
    if (defaultJobId && isOpen) {
      const job = getJobById(defaultJobId);
      if (job) {
        setSelectedJob(job);
        setValue('jobId', defaultJobId);
      }
    }
  }, [defaultJobId, isOpen, getJobById, setValue]);

  // Search jobs when query changes
  useEffect(() => {
    if (jobSearchQuery && jobSearchQuery.length > 2) {
      searchJobs({ query: jobSearchQuery });
    }
  }, [jobSearchQuery, searchJobs]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setValue('jobId', job.id);
    setIsCustomJob(false);
  };

  const handleCustomJobToggle = () => {
    setIsCustomJob(!isCustomJob);
    if (!isCustomJob) {
      setSelectedJob(null);
      setValue('jobId', '');
    }
  };

  const addContact = () => {
    const newContact = {
      name: '',
      email: '',
      role: '',
      notes: '',
    };
    setContacts([...(contacts || []), newContact]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts?.filter((_, i) => i !== index) || [];
    setContacts(updatedContacts);
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updatedContacts = contacts?.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    ) || [];
    setContacts(updatedContacts);
  };

  const addReminder = () => {
    const newReminder = {
      type: 'follow-up' as const,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
      message: '',
    };
    setReminders([...(reminders || []), newReminder]);
  };

  const removeReminder = (index: number) => {
    const updatedReminders = reminders?.filter((_, i) => i !== index) || [];
    setReminders(updatedReminders);
  };

  const updateReminder = (index: number, field: string, value: string) => {
    const updatedReminders = reminders?.map((reminder, i) =>
      i === index ? { ...reminder, [field]: value } : reminder
    ) || [];
    setReminders(updatedReminders);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      let jobId = data.jobId;

      // If custom job, create a temporary job entry
      if (isCustomJob) {
        const customJob: Job = {
          id: `custom-${Date.now()}`,
          title: data.customJobTitle || 'Custom Position',
          company: data.customCompany || 'Unknown Company',
          location: data.customLocation || 'Remote',
          type: 'full-time',
          remote: true,
          description: '',
          requirements: [],
          postedAt: new Date().toISOString(),
          source: 'manual',
          matchScore: 0,
          bookmarked: false,
          applied: true,
          url: data.customUrl || undefined,
        };

        // Note: In a real implementation, you'd want to save this job to your backend
        jobId = customJob.id;
      }

      const applicationData: Partial<JobApplication> = {
        jobId,
        resumeId: data.resumeId,
        coverLetterId: data.coverLetterId,
        status: data.status,
        appliedAt: data.appliedAt + 'T00:00:00.000Z',
        notes: data.notes || '',
        contacts: contacts || [],
        reminders: (reminders || []).map(reminder => ({
          ...reminder,
          id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          completed: false,
        })),
        timeline: [{
          id: `timeline-${Date.now()}`,
          type: 'applied' as const,
          date: new Date().toISOString(),
          description: data.status === 'applied' ? 'Application submitted' : 'Application created as draft',
        }],
      };

      createApplication(jobId, applicationData);

      addNotification({
        type: 'success',
        title: 'Application Added',
        message: `Successfully added application for ${selectedJob?.title || data.customJobTitle}`,
        duration: 5000,
      });

      if (onSuccess) {
        onSuccess(applicationData as JobApplication);
      }

      handleClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add application. Please try again.',
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setSelectedJob(null);
    setIsCustomJob(false);
    setContacts([]);
    setReminders([]);
    setJobSearchQuery('');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(jobSearchQuery.toLowerCase())
  ).slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Add New Application
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="job" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="job">Job Details</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            {/* Job Selection Tab */}
            <TabsContent value="job" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Job Position</h3>
                <Button
                  type="button"
                  variant={isCustomJob ? "default" : "outline"}
                  size="sm"
                  onClick={handleCustomJobToggle}
                >
                  {isCustomJob ? "Use Existing Job" : "Add Custom Job"}
                </Button>
              </div>

              {!isCustomJob ? (
                <div className="space-y-4">
                  {/* Job Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for jobs..."
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Job Selection */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <Card
                          key={job.id}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-gray-50",
                            selectedJob?.id === job.id && "ring-2 ring-blue-500 bg-blue-50"
                          )}
                          onClick={() => handleJobSelect(job)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{job.title}</h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    <span>{job.company}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{job.location}</span>
                                  </div>
                                  {job.remote && (
                                    <Badge variant="secondary" className="text-xs">Remote</Badge>
                                  )}
                                </div>
                              </div>
                              {job.matchScore && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span className="text-gray-600">{job.matchScore}%</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : jobSearchQuery.length > 2 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No jobs found matching "{jobSearchQuery}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Search for jobs or add a custom position</p>
                      </div>
                    )}
                  </div>

                  <Controller
                    name="jobId"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                  {errors.jobId && (
                    <p className="text-sm text-red-600">{errors.jobId.message}</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customJobTitle">Job Title *</Label>
                    <Controller
                      name="customJobTitle"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="customJobTitle"
                          placeholder="e.g. Senior Frontend Developer"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customCompany">Company *</Label>
                    <Controller
                      name="customCompany"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="customCompany"
                          placeholder="e.g. Acme Corp"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customLocation">Location</Label>
                    <Controller
                      name="customLocation"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="customLocation"
                          placeholder="e.g. San Francisco, CA"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customUrl">Job URL</Label>
                    <Controller
                      name="customUrl"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="customUrl"
                          type="url"
                          placeholder="https://company.com/jobs/123"
                        />
                      )}
                    />
                    {errors.customUrl && (
                      <p className="text-sm text-red-600 mt-1">{errors.customUrl.message}</p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Application Details Tab */}
            <TabsContent value="application" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resumeId">Resume *</Label>
                  <Controller
                    name="resumeId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resume" />
                        </SelectTrigger>
                        <SelectContent>
                          {resumes.map((resume) => (
                            <SelectItem key={resume.id} value={resume.id}>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{resume.title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.resumeId && (
                    <p className="text-sm text-red-600 mt-1">{errors.resumeId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Application Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="appliedAt">
                    {watchedStatus === 'applied' ? 'Applied Date' : 'Created Date'}
                  </Label>
                  <Controller
                    name="appliedAt"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="appliedAt"
                        type="date"
                      />
                    )}
                  />
                </div>

                {/* Cover Letter Selection */}
                <div>
                  <Label htmlFor="coverLetterId">Cover Letter (Optional)</Label>
                  <Controller
                    name="coverLetterId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cover letter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No cover letter</SelectItem>
                          {/* Add cover letter options when available */}
                          <SelectItem value="default">Default Cover Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="Add any notes about this application..."
                      rows={4}
                    />
                  )}
                />
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <Button type="button" variant="outline" size="sm" onClick={addContact}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>

              {contacts && contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Contact {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContact(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Name *</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => updateContact(index, 'name', e.target.value)}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => updateContact(index, 'email', e.target.value)}
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Role *</Label>
                          <Input
                            value={contact.role}
                            onChange={(e) => updateContact(index, 'role', e.target.value)}
                            placeholder="Hiring Manager"
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={contact.notes}
                            onChange={(e) => updateContact(index, 'notes', e.target.value)}
                            placeholder="Additional notes about this contact..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No contacts added yet</p>
                  <p className="text-sm">Add contacts to keep track of your networking</p>
                </div>
              )}
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Reminders & Follow-ups</h3>
                <Button type="button" variant="outline" size="sm" onClick={addReminder}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </div>

              {reminders && reminders.length > 0 ? (
                <div className="space-y-4">
                  {reminders.map((reminder, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Reminder {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReminder(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={reminder.type}
                              onValueChange={(value) => updateReminder(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={reminder.date}
                              onChange={(e) => updateReminder(index, 'date', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Message *</Label>
                          <Input
                            value={reminder.message}
                            onChange={(e) => updateReminder(index, 'message', e.target.value)}
                            placeholder="Follow up on application status"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No reminders set</p>
                  <p className="text-sm">Add reminders to stay on top of your applications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setValue('status', 'draft')}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setValue('status', 'applied')}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-white" />
                    Adding...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Quick Add Application (simplified version)
export function QuickAddApplication({ jobId, children }: { jobId: string; children?: React.ReactNode }) {
  const { getJobById, createApplication } = useJobStore();
  const { resumes } = useResumeStore();
  const { addNotification } = useUIStore();

  const job = getJobById(jobId);

  const handleQuickAdd = () => {
    if (!job || resumes.length === 0) {
      addNotification({
        type: 'error',
        title: 'Cannot Add Application',
        message: 'No resume available or job not found',
        duration: 5000,
      });
      return;
    }

    const defaultResume = resumes[0]; // Use first resume as default

    createApplication(jobId, {
      resumeId: defaultResume.id,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      notes: `Quick application for ${job.title} at ${job.company}`,
      contacts: [],
      reminders: [],
      timeline: [{
        id: `timeline-${Date.now()}`,
        type: 'applied',
        date: new Date().toISOString(),
        description: 'Application submitted (quick add)',
      }],
    });

    addNotification({
      type: 'success',
      title: 'Application Added',
      message: `Successfully added application for ${job.title}`,
      duration: 5000,
    });
  };

  return (
    <Button
      onClick={handleQuickAdd}
      size="sm"
      className="w-full"
    >
      <Plus className="w-4 h-4 mr-2" />
      Quick Apply
    </Button>
  );
}
