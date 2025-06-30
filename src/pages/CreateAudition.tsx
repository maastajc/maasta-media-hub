
import React, { useState } from 'react';
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
  gender: z.string().optional(),
  experience_level: z.string().optional(),
}).refine((data) => {
  // If offline audition, location is required
  if (data.audition_type === 'offline' && !data.location?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Location is required for offline auditions",
  path: ["location"],
});

const CreateAudition = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      gender: '',
      experience_level: '',
    },
  });

  // Watch audition type to conditionally show location
  const auditionType = useWatch({
    control: form.control,
    name: 'audition_type'
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

      // Prepare the audition data
      const auditionData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        location: values.audition_type === 'offline' ? values.location : 'Online',
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        audition_date: values.audition_date ? new Date(values.audition_date).toISOString() : null,
        project_details: values.project_details || null,
        compensation: compensation || null,
        category: values.category || null,
        age_range: age_range || null,
        gender: values.gender || null,
        experience_level: values.experience_level || null,
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
                                <SelectItem value="offline">Offline</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Conditional Location Field */}
                    {auditionType === 'offline' && (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the audition opportunity"
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
                              placeholder="List the requirements for applicants"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Salary Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Compensation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="salary_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salary Amount (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter amount in rupees" 
                                  {...field} 
                                />
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
                              <FormLabel>Payment Duration</FormLabel>
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
                    </div>

                    {/* Age Range Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Age Requirements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="min_age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Age</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select minimum age" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ageOptions.map((age) => (
                                    <SelectItem key={age} value={age.toString()}>
                                      {age}
                                    </SelectItem>
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
                                    <SelectValue placeholder="Select maximum age" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ageOptions.map((age) => (
                                    <SelectItem key={age} value={age.toString()}>
                                      {age}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="film">Film</SelectItem>
                                <SelectItem value="television">Television</SelectItem>
                                <SelectItem value="theater">Theater</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="voice">Voice Acting</SelectItem>
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="dance">Dance</SelectItem>
                                <SelectItem value="modeling">Modeling</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                    </div>

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tags */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Tags</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag and press Enter"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X 
                              size={14} 
                              className="cursor-pointer hover:text-red-500" 
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Dates and Project Details */}
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

                    <FormField
                      control={form.control}
                      name="project_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional details about the project"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-maasta-purple hover:bg-maasta-purple/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Audition...' : 'Create Audition'}
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
