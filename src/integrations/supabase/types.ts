export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artist_details: {
        Row: {
          association_membership: string | null
          category: Database["public"]["Enums"]["artist_category"]
          created_at: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string
          rate_card: Json | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          association_membership?: string | null
          category: Database["public"]["Enums"]["artist_category"]
          created_at?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string
          rate_card?: Json | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          association_membership?: string | null
          category?: Database["public"]["Enums"]["artist_category"]
          created_at?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string
          rate_card?: Json | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audition_applications: {
        Row: {
          application_date: string | null
          artist_id: string | null
          audition_id: string | null
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          application_date?: string | null
          artist_id?: string | null
          audition_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          application_date?: string | null
          artist_id?: string | null
          audition_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audition_applications_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_details"
            referencedColumns: ["id"]
          },
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
          audition_cover: Json | null
          audition_date: string | null
          category: string | null
          compensation: string | null
          cover_image_url: string | null
          created_at: string | null
          creator_id: string | null
          deadline: string | null
          description: string | null
          experience_level: string | null
          gender: string | null
          id: string
          location: string | null
          project_details: string | null
          requirements: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_range?: string | null
          audition_cover?: Json | null
          audition_date?: string | null
          category?: string | null
          compensation?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          description?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          location?: string | null
          project_details?: string | null
          requirements?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_range?: string | null
          audition_cover?: Json | null
          audition_date?: string | null
          category?: string | null
          compensation?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          deadline?: string | null
          description?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          location?: string | null
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
        ]
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
            referencedRelation: "artist_details"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          event_date: string
          id: string
          location: string
          max_attendees: number | null
          organizer_info: string | null
          ticket_price: number | null
          ticketing_enabled: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          event_date: string
          id?: string
          location: string
          max_attendees?: number | null
          organizer_info?: string | null
          ticket_price?: number | null
          ticketing_enabled?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string
          max_attendees?: number | null
          organizer_info?: string | null
          ticket_price?: number | null
          ticketing_enabled?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
            referencedRelation: "artist_details"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
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
            foreignKeyName: "media_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "artist_details"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          imdb_profile: string | null
          instagram: string | null
          linkedin: string | null
          personal_website: string | null
          phone_number: string | null
          profile_picture_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          status: Database["public"]["Enums"]["profile_status"] | null
          updated_at: string | null
          willing_to_relocate: boolean | null
          work_preference: Database["public"]["Enums"]["work_preference"] | null
          youtube_vimeo: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id: string
          imdb_profile?: string | null
          instagram?: string | null
          linkedin?: string | null
          personal_website?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          status?: Database["public"]["Enums"]["profile_status"] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
          work_preference?:
            | Database["public"]["Enums"]["work_preference"]
            | null
          youtube_vimeo?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          imdb_profile?: string | null
          instagram?: string | null
          linkedin?: string | null
          personal_website?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          status?: Database["public"]["Enums"]["profile_status"] | null
          updated_at?: string | null
          willing_to_relocate?: boolean | null
          work_preference?:
            | Database["public"]["Enums"]["work_preference"]
            | null
          youtube_vimeo?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          artist_id: string | null
          created_at: string | null
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
            referencedRelation: "artist_details"
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
            referencedRelation: "artist_details"
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
            referencedRelation: "artist_details"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
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
      experience_level:
        | "beginner"
        | "fresher"
        | "intermediate"
        | "expert"
        | "veteran"
      language_proficiency: "basic" | "intermediate" | "fluent" | "native"
      profile_status: "active" | "inactive" | "under_review"
      project_type:
        | "feature_film"
        | "short_film"
        | "web_series"
        | "ad"
        | "music_video"
        | "other"
      user_role: "artist" | "event_organizer" | "casting_agent" | "admin"
      work_preference: "freelance" | "contract" | "full_time" | "any"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
      experience_level: [
        "beginner",
        "fresher",
        "intermediate",
        "expert",
        "veteran",
      ],
      language_proficiency: ["basic", "intermediate", "fluent", "native"],
      profile_status: ["active", "inactive", "under_review"],
      project_type: [
        "feature_film",
        "short_film",
        "web_series",
        "ad",
        "music_video",
        "other",
      ],
      user_role: ["artist", "event_organizer", "casting_agent", "admin"],
      work_preference: ["freelance", "contract", "full_time", "any"],
    },
  },
} as const
