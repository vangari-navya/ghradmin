import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { Job } from '../pages/JobManagement';

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onSave: (job: Job) => void;
}

export function JobFormDialog({ open, onOpenChange, job, onSave }: JobFormDialogProps) {
  const [formData, setFormData] = useState<Job>({
    title: '',
    company: '',
    location: '',
    experience: '',
    description: '',
    type: 'Full-time',
    salary: '',
    skills: [],
    fullDescription: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        experience: '',
        description: '',
        type: 'Full-time',
        salary: '',
        skills: [],
        fullDescription: '',
      });
    }
    setSkillInput('');
    setErrors({});
  }, [job, open]);

  const handleChange = (field: keyof Job, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {job ? 'Edit Job' : 'Create New Job'}
          </DialogTitle>
          <DialogDescription>
            {job ? 'Update the job details below' : 'Fill in the details to create a new job posting'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                className="h-10"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company <span className="text-red-600">*</span>
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="e.g., TechCorp Inc"
                className="h-10"
              />
              {errors.company && <p className="text-sm text-red-600">{errors.company}</p>}
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-red-600">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="h-10"
              />
              {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium">
                Experience <span className="text-red-600">*</span>
              </Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g., 3-5 years"
                className="h-10"
              />
              {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
            </div>
          </div>

          {/* Type & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Job Type <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value as Job['type'])}
              >
                <SelectTrigger id="type" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">
                Salary Range <span className="text-red-600">*</span>
              </Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                placeholder="e.g., $80,000 - $100,000"
                className="h-10"
              />
              {errors.salary && <p className="text-sm text-red-600">{errors.salary}</p>}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Short Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the job (1-2 sentences)"
              rows={2}
              className="resize-none"
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <Label htmlFor="fullDescription" className="text-sm font-medium">
              Full Description <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => handleChange('fullDescription', e.target.value)}
              placeholder="Detailed job description, responsibilities, and requirements"
              rows={6}
              className="resize-none"
            />
            {errors.fullDescription && (
              <p className="text-sm text-red-600">{errors.fullDescription}</p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-sm font-medium">
              Skills <span className="text-red-600">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill and press Enter"
                className="h-10"
              />
              <Button 
                type="button" 
                onClick={handleAddSkill} 
                variant="secondary"
                className="h-10 px-4"
              >
                Add
              </Button>
            </div>
            {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {formData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="gap-1.5 pl-2.5 pr-1.5 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-10"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="h-10 bg-[#1E5F85]"
            >
              {job ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
