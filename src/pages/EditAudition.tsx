import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuditionCategorySelect from '@/components/auditions/AuditionCategorySelect';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  location: z.string().min(1, 'Location is required'),
  deadline: z.string().optional(),
  audition_date: z.string().optional(),
  project_details: z.string().optional(),
  compensation: z.string().optional(),
  category: z.string().optional(),
  age_range: z.string().optional(),
  gender: z.string().optional(),
  experience_level: z.string().optional(),
});

const EditAudition = () => {
  const { auditionId } = useParams<{ auditionId: string }>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState('');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      deadline: '',
      audition_date: '',
      project_details: '',
      compensation: '',
      category: '',
      age_range: '',
      gender: '',
      experience_level: '',
    },
  });

  useEffect(() => {
    const fetchAudition = async () => {
      if (!auditionId || !user) return;

      try {
        const { data, error } = await supabase
          .from('auditions')
          .select('*')
          .eq('id', auditionId)
          .eq('creator_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching audition:', error);
          toast({
            title: "Error",
            description: "Failed to load audition details",
            variant: "destructive",
          });
          navigate('/auditions');
          return;
        }

        if (data) {
          // Populate form with existing data
          form.reset({
            title: data.title || '',
            description: data.description || '',
            requirements: data.requirements || '',
            location: data.location || '',
            deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : '',
            audition_date: data.audition_date ? new Date(data.audition_date).toISOString().slice(0, 16) : '',
            project_details: data.project_details || '',
            compensation: data.compensation || '',
            category: data.category || '',
            age_range: data.age_range || '',
            gender: data.gender || '',
            experience_level: data.experience_level || '',
          });

          setTags(data.tags || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        navigate('/auditions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudition();
  }, [auditionId, user, form, toast, navigate]);

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
    if (!user || !auditionId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit this audition",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const auditionData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        location: values.location,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        audition_date: values.audition_date ? new Date(values.audition_date).toISOString() : null,
        project_details: values.project_details || null,
        compensation: values.compensation || null,
        category: values.category || null,
        age_range: values.age_range || null,
        gender: values.gender || null,
        experience_level: values.experience_level || null,
        tags: tags.length > 0 ? tags : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('auditions')
        .update(auditionData)
        .eq('id', auditionId)
        .eq('creator_id', user.id);

      if (error) {
        console.error('Error updating audition:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update audition",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Audition updated successfully!",
      });

      navigate(`/auditions/${auditionId}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the audition details.</p>
          </div>
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
              <h1 className="text-3xl font-bold mb-2">Edit Audition</h1>
              <p className="text-gray-600">Update your audition posting</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Audition Details</CardTitle>
                <CardDescription>
                  Update the details for your audition posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Form fields - same as CreateAudition but abbreviated */}
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
                    </div>

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

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <AuditionCategorySelect
                              value={field.value || ''}
                              onChange={field.onChange}
                              onCustomCategoryChange={setCustomCategory}
                            />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="age_range"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Range</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 25-35" {...field} />
                            </FormControl>
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
                    </div>

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

                    {/* Dates and Compensation */}
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

                    <FormField
                      control={form.control}
                      name="compensation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compensation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Details about payment, benefits, etc."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating Audition...' : 'Update Audition'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate(`/auditions/${auditionId}`)}
                      >
                        Cancel
                      </Button>
                    </div>
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

export default EditAudition;
