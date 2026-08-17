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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cases: {
        Row: {
          category: string
          content: Json
          cover_url: string | null
          created_at: string
          descriptor: string
          id: string
          published: boolean
          seo_description: string
          service: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          category?: string
          content?: Json
          cover_url?: string | null
          created_at?: string
          descriptor?: string
          id?: string
          published?: boolean
          seo_description?: string
          service?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          year?: string
        }
        Update: {
          category?: string
          content?: Json
          cover_url?: string | null
          created_at?: string
          descriptor?: string
          id?: string
          published?: boolean
          seo_description?: string
          service?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          crm_closed_at: string | null
          crm_meeting_at: string | null
          crm_notes: string | null
          crm_presented_at: string | null
          crm_proposal_at: string | null
          crm_services: Json
          crm_status: string
          crm_updated_at: string | null
          crm_value: number | null
          email: string
          gclid: string | null
          id: string
          landing_url: string | null
          message: string
          name: string
          referrer: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          crm_closed_at?: string | null
          crm_meeting_at?: string | null
          crm_notes?: string | null
          crm_presented_at?: string | null
          crm_proposal_at?: string | null
          crm_services?: Json
          crm_status?: string
          crm_updated_at?: string | null
          crm_value?: number | null
          email: string
          gclid?: string | null
          id?: string
          landing_url?: string | null
          message: string
          name: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          crm_closed_at?: string | null
          crm_meeting_at?: string | null
          crm_notes?: string | null
          crm_presented_at?: string | null
          crm_proposal_at?: string | null
          crm_services?: Json
          crm_status?: string
          crm_updated_at?: string | null
          crm_value?: number | null
          email?: string
          gclid?: string | null
          id?: string
          landing_url?: string | null
          message?: string
          name?: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      diagnostic_leads: {
        Row: {
          company: string | null
          created_at: string
          crm_closed_at: string | null
          crm_meeting_at: string | null
          crm_notes: string | null
          crm_presented_at: string | null
          crm_proposal_at: string | null
          crm_services: Json
          crm_status: string
          crm_updated_at: string | null
          crm_value: number | null
          dimensions: Json | null
          email: string
          gclid: string | null
          id: string
          landing_url: string | null
          name: string
          phase: string | null
          referrer: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          crm_closed_at?: string | null
          crm_meeting_at?: string | null
          crm_notes?: string | null
          crm_presented_at?: string | null
          crm_proposal_at?: string | null
          crm_services?: Json
          crm_status?: string
          crm_updated_at?: string | null
          crm_value?: number | null
          dimensions?: Json | null
          email: string
          gclid?: string | null
          id?: string
          landing_url?: string | null
          name: string
          phase?: string | null
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          crm_closed_at?: string | null
          crm_meeting_at?: string | null
          crm_notes?: string | null
          crm_presented_at?: string | null
          crm_proposal_at?: string | null
          crm_services?: Json
          crm_status?: string
          crm_updated_at?: string | null
          crm_value?: number | null
          dimensions?: Json | null
          email?: string
          gclid?: string | null
          id?: string
          landing_url?: string | null
          name?: string
          phase?: string | null
          referrer?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string
          created_at: string
          id: string
          published: boolean
          service: string
          sort_order: number
          title: string
          year: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          service?: string
          sort_order?: number
          title: string
          year?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          service?: string
          sort_order?: number
          title?: string
          year?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          channel: string
          client: string
          cover_alt: string
          cover_url: string | null
          created_at: string
          duration: string
          format: string
          id: string
          objective: string
          preview_seconds: number
          published: boolean
          section: string
          sort_order: number
          updated_at: string
          video_url: string | null
          youtube_id: string | null
        }
        Insert: {
          channel?: string
          client?: string
          cover_alt?: string
          cover_url?: string | null
          created_at?: string
          duration?: string
          format?: string
          id?: string
          objective?: string
          preview_seconds?: number
          published?: boolean
          section?: string
          sort_order?: number
          updated_at?: string
          video_url?: string | null
          youtube_id?: string | null
        }
        Update: {
          channel?: string
          client?: string
          cover_alt?: string
          cover_url?: string | null
          created_at?: string
          duration?: string
          format?: string
          id?: string
          objective?: string
          preview_seconds?: number
          published?: boolean
          section?: string
          sort_order?: number
          updated_at?: string
          video_url?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      save_diagnostic_lead: {
        Args: {
          p_id: string
          p_name: string
          p_company?: string | null
          p_email?: string | null
          p_whatsapp?: string | null
          p_phase?: string | null
          p_dimensions?: Json | null
          p_gclid?: string | null
          p_utm_source?: string | null
          p_utm_medium?: string | null
          p_utm_campaign?: string | null
          p_utm_term?: string | null
          p_utm_content?: string | null
          p_referrer?: string | null
          p_landing_url?: string | null
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
