export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audition_applications: {
        Row: {
          application_date: string | null
          artist_id: string | null
          audition_id: string | null
          id: string
          notes: string | null
          organizer_notes: string | null
          status: string | null
        }
        Insert: {
          application_date?: string | null
          artist_id?: string | null
          audition_id?: string | null
          id?: string
          notes?: string | null
          organizer_notes?: string | null
          status?: string | null
        }
        Update: {
          application_date?: string | null
          artist_id?: string | null
          audition_id?: string | null
          id?: string
          notes?: string | null
          organizer_notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audition_applications_audition_id_fkey"
            columns: ["audition_id"]
            isOneToOne: false
            referencedRelation: "auditions"
            referencedColumns: ["id"]
          },
        ]
      }
      auditions: {
        Row: {
          age_range: string | null
          audition_date: string | null
          category: string | null
          compensation: string | null
          created_at: string | null
          creator_id: string | null
          deadline: string | null
          description: string | null
          experience_level: string | null
          gender: string | null
          id: string
          location: string | null
          organization_id: string | null
          payment_amount: number | null
          payment_required: boolean
          project_details: string | null
          requirements: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_range?: string | null
          audition_date?: string | null
          category?: string | null
          compensation?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          description?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          organization_id?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          project_details?: string | null
          requirements?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_range?: string | null
          audition_date?: string | null
          category?: string | null
          compensation?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          description?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          organization_id?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          project_details?: string | null
          requirements?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auditions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          artist_id: string
          created_at: string
          description: string | null
          id: string
          organization: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          artist_id: string
          booker_id: string
          budget: number | null
          category: string
          created_at: string
          deadline: string | null
          deliverables: string | null
          duration: string | null
          event_date: string
          id: string
          location: string
          notes: string | null
          num_shows: number | null
          project_type: string
          rehearsal_required: boolean | null
          requirements: string | null
          script_link: string | null
          status: Database["public"]["Enums"]["booking_status"]
          technical_requirements: string | null
          updated_at: string
        }
        Insert: {
          artist_id: string
          booker_id: string
          budget?: number | null
          category: string
          created_at?: string
          deadline?: string | null
          deliverables?: string | null
          duration?: string | null
          event_date: string
          id?: string
          location: string
          notes?: string | null
          num_shows?: number | null
          project_type: string
          rehearsal_required?: boolean | null
          requirements?: string | null
          script_link?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technical_requirements?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: string
          booker_id?: string
          budget?: number | null
          category?: string
          created_at?: string
          deadline?: string | null
          deliverables?: string | null
          duration?: string | null
          event_date?: string
          id?: string
          location?: string
          notes?: string | null
          num_shows?: number | null
          project_type?: string
          rehearsal_required?: boolean | null
          requirements?: string | null
          script_link?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technical_requirements?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          status: string
          target_user_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          target_user_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          target_user_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      education_training: {
        Row: {
          artist_id: string | null
          created_at: string | null
          id: string
          institution: string | null
          is_academic: boolean | null
          qualification_name: string
          year_completed: number | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          institution?: string | null
          is_academic?: boolean | null
          qualification_name: string
          year_completed?: number | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          id?: string
          institution?: string | null
          is_academic?: boolean | null
          qualification_name?: string
          year_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_training_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          attendance_status: string | null
          event_id: string | null
          id: string
          registered_at: string | null
          user_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          confirmation_email_sent: boolean | null
          event_id: string
          id: string
          joined_at: string
          notes: string | null
          participant_email: string | null
          participant_name: string | null
          participant_phone: string | null
          payment_status: string | null
          status: string | null
          ticket_id: string
          ticket_price: number | null
          ticket_type_name: string | null
          user_id: string
        }
        Insert: {
          confirmation_email_sent?: boolean | null
          event_id: string
          id?: string
          joined_at?: string
          notes?: string | null
          participant_email?: string | null
          participant_name?: string | null
          participant_phone?: string | null
          payment_status?: string | null
          status?: string | null
          ticket_id?: string
          ticket_price?: number | null
          ticket_type_name?: string | null
          user_id: string
        }
        Update: {
          confirmation_email_sent?: boolean | null
          event_id?: string
          id?: string
          joined_at?: string
          notes?: string | null
          participant_email?: string | null
          participant_name?: string | null
          participant_phone?: string | null
          payment_status?: string | null
          status?: string | null
          ticket_id?: string
          ticket_price?: number | null
          ticket_type_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          category: string | null
          created_at: string | null
          creator_id: string | null
          date_end: string | null
          date_start: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          is_online: boolean | null
          is_talent_needed: boolean | null
          location: string
          max_attendees: number | null
          organization_id: string | null
          organizer_contact: string | null
          organizer_info: string | null
          payment_amount: number | null
          payment_required: boolean
          registration_deadline: string | null
          status: string | null
          ticket_limit: number | null
          ticket_price: number | null
          ticket_type: string | null
          ticket_types: Json | null
          ticketing_enabled: boolean | null
          title: string
          updated_at: string | null
          winning_prize: number | null
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          is_talent_needed?: boolean | null
          location: string
          max_attendees?: number | null
          organization_id?: string | null
          organizer_contact?: string | null
          organizer_info?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          registration_deadline?: string | null
          status?: string | null
          ticket_limit?: number | null
          ticket_price?: number | null
          ticket_type?: string | null
          ticket_types?: Json | null
          ticketing_enabled?: boolean | null
          title: string
          updated_at?: string | null
          winning_prize?: number | null
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_online?: boolean | null
          is_talent_needed?: boolean | null
          location?: string
          max_attendees?: number | null
          organization_id?: string | null
          organizer_contact?: string | null
          organizer_info?: string | null
          payment_amount?: number | null
          payment_required?: boolean
          registration_deadline?: string | null
          status?: string | null
          ticket_limit?: number | null
          ticket_price?: number | null
          ticket_type?: string | null
          ticket_types?: Json | null
          ticketing_enabled?: boolean | null
          title?: string
          updated_at?: string | null
          winning_prize?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      language_skills: {
        Row: {
          artist_id: string | null
          id: string
          language: string
          proficiency: Database["public"]["Enums"]["language_proficiency"]
        }
        Insert: {
          artist_id?: string | null
          id?: string
          language: string
          proficiency: Database["public"]["Enums"]["language_proficiency"]
        }
        Update: {
          artist_id?: string | null
          id?: string
          language?: string
          proficiency?: Database["public"]["Enums"]["language_proficiency"]
        }
        Relationships: [
          {
            foreignKeyName: "language_skills_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          artist_id: string | null
          created_at: string | null
          description: string | null
          embed_source: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_embed: boolean | null
          is_video: boolean | null
          url: string
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          embed_source?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_embed?: boolean | null
          is_video?: boolean | null
          url: string
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          embed_source?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          is_embed?: boolean | null
          is_video?: boolean | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          connection_id: string | null
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          connection_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          connection_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      network_preferences: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          created_at: string | null
          id: string
          max_distance_km: number | null
          preferred_experience: string | null
          preferred_location: string | null
          preferred_roles: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          created_at?: string | null
          id?: string
          max_distance_km?: number | null
          preferred_experience?: string | null
          preferred_location?: string | null
          preferred_roles?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          created_at?: string | null
          id?: string
          max_distance_km?: number | null
          preferred_experience?: string | null
          preferred_location?: string | null
          preferred_roles?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          org_id: string
          role: Database["public"]["Enums"]["organization_member_role"]
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          org_id: string
          role?: Database["public"]["Enums"]["organization_member_role"]
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          org_id?: string
          role?: Database["public"]["Enums"]["organization_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          about: string | null
          banner_url: string | null
          category: Database["public"]["Enums"]["organization_category"]
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          created_by: string
          id: string
          instagram: string | null
          linkedin: string | null
          logo_url: string | null
          mission: string | null
          name: string
          services: string | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          about?: string | null
          banner_url?: string | null
          category: Database["public"]["Enums"]["organization_category"]
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          logo_url?: string | null
          mission?: string | null
          name: string
          services?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          about?: string | null
          banner_url?: string | null
          category?: Database["public"]["Enums"]["organization_category"]
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          logo_url?: string | null
          mission?: string | null
          name?: string
          services?: string | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          audition_id: string | null
          created_at: string
          currency: string
          event_id: string | null
          id: string
          payment_method: string
          phonepe_order_id: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          audition_id?: string | null
          created_at?: string
          currency?: string
          event_id?: string | null
          id?: string
          payment_method?: string
          phonepe_order_id: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          audition_id?: string | null
          created_at?: string
          currency?: string
          event_id?: string | null
          id?: string
          payment_method?: string
          phonepe_order_id?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_references: {
        Row: {
          artist_id: string | null
          contact: string | null
          created_at: string | null
          id: string
          name: string
          role: string
        }
        Insert: {
          artist_id?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name: string
          role: string
        }
        Update: {
          artist_id?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_references_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          association_membership: string | null
          behance: string | null
          bio: string | null
          category: string | null
          city: string | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          custom_links: Json | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          email_verified_at: string | null
          experience_level: string | null
          full_name: string
          gender: string | null
          headline: string | null
          id: string
          imdb_profile: string | null
          instagram: string | null
          linkedin: string | null
          personal_website: string | null
          phone_number: string | null
          preferred_domains: string | null
          "Primary Profession": string[] | null
          profile_picture_url: string | null
          rate_card: Json | null
          role: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          username: string | null
          verification_token: string | null
          verification_token_expires_at: string | null
          verified: boolean | null
          willing_to_relocate: boolean | null
          work_preference: string | null
          years_of_experience: number | null
          youtube_vimeo: string | null
        }
        Insert: {
          about?: string | null
          association_membership?: string | null
          behance?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          custom_links?: Json | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          experience_level?: string | null
          full_name?: string
          gender?: string | null
          headline?: string | null
          id: string
          imdb_profile?: string | null
          instagram?: string | null
          linkedin?: string | null
          personal_website?: string | null
          phone_number?: string | null
          preferred_domains?: string | null
          "Primary Profession"?: string[] | null
          profile_picture_url?: string | null
          rate_card?: Json | null
          role?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
          verification_token?: string | null
          verification_token_expires_at?: string | null
          verified?: boolean | null
          willing_to_relocate?: boolean | null
          work_preference?: string | null
          years_of_experience?: number | null
          youtube_vimeo?: string | null
        }
        Update: {
          about?: string | null
          association_membership?: string | null
          behance?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          custom_links?: Json | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          experience_level?: string | null
          full_name?: string
          gender?: string | null
          headline?: string | null
          id?: string
          imdb_profile?: string | null
          instagram?: string | null
          linkedin?: string | null
          personal_website?: string | null
          phone_number?: string | null
          preferred_domains?: string | null
          "Primary Profession"?: string[] | null
          profile_picture_url?: string | null
          rate_card?: Json | null
          role?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
          verification_token?: string | null
          verification_token_expires_at?: string | null
          verified?: boolean | null
          willing_to_relocate?: boolean | null
          work_preference?: string | null
          years_of_experience?: number | null
          youtube_vimeo?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          artist_id: string | null
          created_at: string | null
          description: string | null
          director_producer: string | null
          id: string
          link: string | null
          project_name: string
          project_type: Database["public"]["Enums"]["project_type"]
          role_in_project: string
          streaming_platform: string | null
          updated_at: string | null
          year_of_release: number | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          director_producer?: string | null
          id?: string
          link?: string | null
          project_name: string
          project_type: Database["public"]["Enums"]["project_type"]
          role_in_project: string
          streaming_platform?: string | null
          updated_at?: string | null
          year_of_release?: number | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          description?: string | null
          director_producer?: string | null
          id?: string
          link?: string | null
          project_name?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          role_in_project?: string
          streaming_platform?: string | null
          updated_at?: string | null
          year_of_release?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      special_skills: {
        Row: {
          artist_id: string | null
          id: string
          skill: string
        }
        Insert: {
          artist_id?: string | null
          id?: string
          skill: string
        }
        Update: {
          artist_id?: string | null
          id?: string
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "special_skills_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tools_software: {
        Row: {
          artist_id: string | null
          id: string
          tool_name: string
        }
        Insert: {
          artist_id?: string | null
          id?: string
          tool_name: string
        }
        Update: {
          artist_id?: string | null
          id?: string
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_software_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_links: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          updated_at: string
          user_id: string
          work_title: string
          work_url: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          updated_at?: string
          user_id: string
          work_title: string
          work_url: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          work_title?: string
          work_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_email_verification_token: {
        Args: { user_id_param: string }
        Returns: string
      }
      get_event_stats: {
        Args: { event_id_param: string }
        Returns: {
          cancelled_registrations: number
          confirmed_registrations: number
          is_full: boolean
          total_registrations: number
        }[]
      }
      get_unique_categories: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_unique_event_categories: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_event_full: {
        Args: { event_id_param: string }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      user_is_org_admin: {
        Args: { org_uuid: string }
        Returns: boolean
      }
      user_is_org_member_with_role: {
        Args: {
          org_uuid: string
          required_roles: Database["public"]["Enums"]["organization_member_role"][]
        }
        Returns: boolean
      }
      verify_email_token: {
        Args: { token_param: string }
        Returns: boolean
      }
    }
    Enums: {
      artist_category:
        | "actor"
        | "director"
        | "cinematographer"
        | "musician"
        | "editor"
        | "art_director"
        | "stunt_coordinator"
        | "producer"
        | "writer"
        | "other"
      booking_status: "pending" | "approved" | "rejected" | "cancelled"
      experience_level:
        | "beginner"
        | "fresher"
        | "intermediate"
        | "expert"
        | "veteran"
      language_proficiency:
        | "basic"
        | "intermediate"
        | "fluent"
        | "native"
        | "advanced"
      organization_category:
        | "production_house"
        | "media_association"
        | "college"
        | "agency"
        | "studio"
        | "event_organizer"
        | "cultural_body"
        | "union"
        | "other"
      organization_member_role: "admin" | "editor" | "viewer"
      profile_status: "active" | "inactive" | "under_review"
      project_type:
        | "feature_film"
        | "short_film"
        | "web_series"
        | "ad"
        | "music_video"
        | "other"
        | "theater"
        | "commercial"
        | "documentary"
        | "tv_show"
      user_role: "artist" | "event_organizer" | "casting_agent" | "admin"
      work_preference: "freelance" | "contract" | "full_time" | "any"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      artist_category: [
        "actor",
        "director",
        "cinematographer",
        "musician",
        "editor",
        "art_director",
        "stunt_coordinator",
        "producer",
        "writer",
        "other",
      ],
      booking_status: ["pending", "approved", "rejected", "cancelled"],
      experience_level: [
        "beginner",
        "fresher",
        "intermediate",
        "expert",
        "veteran",
      ],
      language_proficiency: [
        "basic",
        "intermediate",
        "fluent",
        "native",
        "advanced",
      ],
      organization_category: [
        "production_house",
        "media_association",
        "college",
        "agency",
        "studio",
        "event_organizer",
        "cultural_body",
        "union",
        "other",
      ],
      organization_member_role: ["admin", "editor", "viewer"],
      profile_status: ["active", "inactive", "under_review"],
      project_type: [
        "feature_film",
        "short_film",
        "web_series",
        "ad",
        "music_video",
        "other",
        "theater",
        "commercial",
        "documentary",
        "tv_show",
      ],
      user_role: ["artist", "event_organizer", "casting_agent", "admin"],
      work_preference: ["freelance", "contract", "full_time", "any"],
    },
  },
} as const
