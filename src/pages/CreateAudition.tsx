
import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuditionCategorySelect from '@/components/auditions/AuditionCategorySelect';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  audition_type: z.enum(['online', 'offline'], { required_error: 'Please select audition type' }),
  location: z.string().optional(),
  deadline: z.string().optional(),
  audition_date: z.string().optional(),
  project_details: z.string().optional(),
  salary_amount: z.string().optional(),
  salary_duration: z.enum(['per_day', 'per_month', 'whole_project']).optional(),
  min_age: z.string().optional(),
  max_age: z.string().optional(),
  category: z.string().optional(),
  custom_category: z.string().optional(),
  gender: z.string().optional(),
  experience_level: z.string().optional(),
  task_requirements: z.string().optional(),
}).refine((data) => {
  // If offline audition, location is required
  if (data.audition_type === 'offline' && !data.location?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Location is required for offline auditions",
  path: ["location"],
}).refine((data) => {
  // If category is "other", custom_category is required
  if (data.category === 'other' && !data.custom_category?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Please specify custom category",
  path: ["custom_category"],
});

const CreateAudition = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      audition_type: undefined,
      location: '',
      deadline: '',
      audition_date: '',
      project_details: '',
      salary_amount: '',
      salary_duration: undefined,
      min_age: '',
      max_age: '',
      category: '',
      custom_category: '',
      gender: '',
      experience_level: '',
      task_requirements: '',
    },
  });

  // Load saved draft on component mount
  useEffect(() => {
    if (user) {
      const savedDraft = localStorage.getItem(`audition-draft-${user.id}`);
      const savedTags = localStorage.getItem(`audition-tags-${user.id}`);
      
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          form.reset(draftData);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
      
      if (savedTags) {
        try {
          setTags(JSON.parse(savedTags));
        } catch (error) {
          console.error('Error loading tags:', error);
        }
      }
    }
  }, [user, form]);

  // Auto-save functionality
  const formValues = useWatch({ control: form.control });
  
  useEffect(() => {
    if (!user) return;
    
    const timeoutId = setTimeout(() => {
      const dataToSave = {
        ...formValues,
        // Only save non-empty values
        title: formValues.title?.trim() || '',
        description: formValues.description?.trim() || '',
        requirements: formValues.requirements?.trim() || '',
      };
      
      // Only save if there's meaningful content
      if (dataToSave.title || dataToSave.description || dataToSave.requirements) {
        localStorage.setItem(`audition-draft-${user.id}`, JSON.stringify(dataToSave));
        localStorage.setItem(`audition-tags-${user.id}`, JSON.stringify(tags));
        setLastSaved(new Date());
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formValues, tags, user]);

  // Clear draft after successful submission
  const clearDraft = () => {
    if (user) {
      localStorage.removeItem(`audition-draft-${user.id}`);
      localStorage.removeItem(`audition-tags-${user.id}`);
    }
  };

  // Watch audition type and category to conditionally show fields
  const auditionType = useWatch({
    control: form.control,
    name: 'audition_type'
  });

  const selectedCategory = useWatch({
    control: form.control,
    name: 'category'
  });

  // Generate age options (18 to 80)
  const ageOptions = Array.from({ length: 63 }, (_, i) => i + 18);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an audition",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare compensation string
      let compensation = '';
      if (values.salary_amount && values.salary_duration) {
        const durationText = {
          per_day: 'per day',
          per_month: 'per month',
          whole_project: 'for whole project'
        }[values.salary_duration];
        compensation = `₹${values.salary_amount} ${durationText}`;
      }

      // Prepare age range string
      let age_range = '';
      if (values.min_age && values.max_age) {
        age_range = `${values.min_age}-${values.max_age}`;
      } else if (values.min_age) {
        age_range = `${values.min_age}+`;
      } else if (values.max_age) {
        age_range = `Up to ${values.max_age}`;
      }

      // Determine final category - use custom if "other" is selected
      const finalCategory = values.category === 'other' ? values.custom_category : values.category;

      // Prepare the audition data
      const auditionData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        location: values.audition_type === 'offline' ? values.location : 'Online',
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        audition_date: values.audition_date ? new Date(values.audition_date).toISOString() : null,
        //project_details: values.project_details || null,
        compensation: compensation || null,
        category: finalCategory || null,
        age_range: age_range || null,
        gender: values.gender || null,
        experience_level: values.experience_level || null,
        task_requirements: values.task_requirements || null,
        tags: tags.length > 0 ? tags : null,
        creator_id: user.id,
        status: 'open'
      };

      console.log('Posting audition with data:', auditionData);

      // Insert the audition
      const { data, error } = await supabase
        .from('auditions')
        .insert([auditionData])
        .select()
        .single();

      if (error) {
        console.error('Error posting audition:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create audition",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Audition created successfully!",
      });

      // Clear the draft after successful submission
      clearDraft();

      // Navigate to the auditions list or the created audition
      navigate('/auditions');
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to create an audition</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Audition</h1>
              <p className="text-gray-600">Post a new audition opportunity for artists</p>
              {lastSaved && (
                <p className="text-sm text-green-600 mt-2">
                  Draft auto-saved at {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Audition Details</CardTitle>
                <CardDescription>
                  Fill in the details for your audition posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter audition title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audition_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audition Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audition type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">In-Person</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the audition details..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What are you looking for? Skills, experience, etc..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location - only show if offline */}
                    {auditionType === 'offline' && (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter audition location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Category Selection */}
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <AuditionCategorySelect
                              value={field.value || ''}
                              onChange={field.onChange}
                              onCustomCategoryChange={(customCategory) => {
                                form.setValue('custom_category', customCategory);
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Deadline</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audition_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Audition Date</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Compensation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="salary_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compensation Amount</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter amount (without ₹)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salary_duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compensation Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="per_day">Per Day</SelectItem>
                                <SelectItem value="per_month">Per Month</SelectItem>
                                <SelectItem value="whole_project">Whole Project</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Demographics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="min_age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Age</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Min age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageOptions.map((age) => (
                                  <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="max_age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Age</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Max age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageOptions.map((age) => (
                                  <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non_binary">Non-Binary</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="experience_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Task Requirements */}
                    <FormField
                      control={form.control}
                      name="task_requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Requirements (Optional)</FormLabel>
                          <FormDescription>
                            Request specific tasks, photos, videos, or portfolio links from applicants
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., Please submit a 2-minute video performing a dialogue, or provide links to your recent work..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   
                    {/* Tags */}
                    <div>
                      <FormLabel>Tags</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <Button type="button" onClick={addTag} variant="outline">
                            Add
                          </Button>
                        </div>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="gap-1">
                                {tag}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeTag(tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Audition'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAudition;
