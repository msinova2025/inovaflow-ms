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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          attachments: Json | null
          axis: Database["public"]["Enums"]["innovation_axis"]
          banner_url: string | null
          benefits: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          description: string
          end_date: string | null
          expected_results: string | null
          id: string
          modality: string
          proposer: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          start_date: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          axis: Database["public"]["Enums"]["innovation_axis"]
          banner_url?: string | null
          benefits?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          description: string
          end_date?: string | null
          expected_results?: string | null
          id?: string
          modality: string
          proposer: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          axis?: Database["public"]["Enums"]["innovation_axis"]
          banner_url?: string | null
          benefits?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          description?: string
          end_date?: string | null
          expected_results?: string | null
          id?: string
          modality?: string
          proposer?: string
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          link: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      geral: {
        Row: {
          contact_phone: string
          created_at: string
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          ouvidoria_url: string | null
          servicos_url: string | null
          transparencia_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          contact_phone?: string
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          ouvidoria_url?: string | null
          servicos_url?: string | null
          transparencia_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          ouvidoria_url?: string | null
          servicos_url?: string | null
          transparencia_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      how_to_participate: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number | null
          section: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number | null
          section: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number | null
          section?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          published_at: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf_cnpj: string | null
          created_at: string
          full_name: string
          id: string
          organization: string | null
          phone: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          full_name: string
          id: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string
          id?: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      program_info: {
        Row: {
          content: string
          created_at: string
          id: string
          order_index: number | null
          section: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_index?: number | null
          section: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_index?: number | null
          section?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      solution_statuses: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          attachments: Json | null
          axis: Database["public"]["Enums"]["innovation_axis"]
          benefits: string | null
          celular_envio: string | null
          challenge_id: string
          contribution_objectives: string | null
          created_at: string
          created_by: string
          description: string
          detailed_operation: string | null
          direct_beneficiaries: string | null
          document_1_url: string | null
          document_2_url: string | null
          document_3_url: string | null
          established_partnerships: string | null
          id: string
          instagram_link: string | null
          linkedin_link: string | null
          participant_type: string | null
          portfolio_link: string | null
          problem_solved: string | null
          required_resources: string | null
          solution_continuity: string | null
          solution_differentials: string | null
          solution_status_id: string | null
          status: Database["public"]["Enums"]["solution_status"] | null
          success_indicators: string | null
          team_name: string | null
          territory_replication: string | null
          title: string
          updated_at: string
          validation_prototyping: string | null
        }
        Insert: {
          attachments?: Json | null
          axis: Database["public"]["Enums"]["innovation_axis"]
          benefits?: string | null
          celular_envio?: string | null
          challenge_id: string
          contribution_objectives?: string | null
          created_at?: string
          created_by: string
          description: string
          detailed_operation?: string | null
          direct_beneficiaries?: string | null
          document_1_url?: string | null
          document_2_url?: string | null
          document_3_url?: string | null
          established_partnerships?: string | null
          id?: string
          instagram_link?: string | null
          linkedin_link?: string | null
          participant_type?: string | null
          portfolio_link?: string | null
          problem_solved?: string | null
          required_resources?: string | null
          solution_continuity?: string | null
          solution_differentials?: string | null
          solution_status_id?: string | null
          status?: Database["public"]["Enums"]["solution_status"] | null
          success_indicators?: string | null
          team_name?: string | null
          territory_replication?: string | null
          title: string
          updated_at?: string
          validation_prototyping?: string | null
        }
        Update: {
          attachments?: Json | null
          axis?: Database["public"]["Enums"]["innovation_axis"]
          benefits?: string | null
          celular_envio?: string | null
          challenge_id?: string
          contribution_objectives?: string | null
          created_at?: string
          created_by?: string
          description?: string
          detailed_operation?: string | null
          direct_beneficiaries?: string | null
          document_1_url?: string | null
          document_2_url?: string | null
          document_3_url?: string | null
          established_partnerships?: string | null
          id?: string
          instagram_link?: string | null
          linkedin_link?: string | null
          participant_type?: string | null
          portfolio_link?: string | null
          problem_solved?: string | null
          required_resources?: string | null
          solution_continuity?: string | null
          solution_differentials?: string | null
          solution_status_id?: string | null
          status?: Database["public"]["Enums"]["solution_status"] | null
          success_indicators?: string | null
          team_name?: string | null
          territory_replication?: string | null
          title?: string
          updated_at?: string
          validation_prototyping?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solutions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solutions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solutions_solution_status_id_fkey"
            columns: ["solution_status_id"]
            isOneToOne: false
            referencedRelation: "solution_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "advanced" | "challenger" | "solver"
      content_status: "draft" | "pending" | "approved" | "rejected"
      innovation_axis:
        | "desenvolvimento_tecnologico"
        | "iot"
        | "inovacao_governo"
        | "sustentabilidade"
        | "ia_ml"
        | "saude_biotecnologia"
        | "educacao"
        | "mobilidade"
      relationship_type: "B2G" | "B2C" | "G2G" | "G2A" | "G2C"
      solution_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "approved"
        | "rejected"
      user_type: "admin" | "advanced" | "challenger" | "solver"
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
      app_role: ["admin", "advanced", "challenger", "solver"],
      content_status: ["draft", "pending", "approved", "rejected"],
      innovation_axis: [
        "desenvolvimento_tecnologico",
        "iot",
        "inovacao_governo",
        "sustentabilidade",
        "ia_ml",
        "saude_biotecnologia",
        "educacao",
        "mobilidade",
      ],
      relationship_type: ["B2G", "B2C", "G2G", "G2A", "G2C"],
      solution_status: [
        "draft",
        "submitted",
        "in_review",
        "approved",
        "rejected",
      ],
      user_type: ["admin", "advanced", "challenger", "solver"],
    },
  },
} as const
