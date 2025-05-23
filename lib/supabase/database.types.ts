export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          sale_price: number | null
          stock_quantity: number
          category_id: string | null
          image_url: string | null
          additional_images: Json | null
          featured: boolean
          is_active: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          sale_price?: number | null
          stock_quantity?: number
          category_id?: string | null
          image_url?: string | null
          additional_images?: Json | null
          featured?: boolean
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          stock_quantity?: number
          category_id?: string | null
          image_url?: string | null
          additional_images?: Json | null
          featured?: boolean
          is_active?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      homepage_sections: {
        Row: {
          id: string
          section_type: string
          title: string | null
          subtitle: string | null
          content: Json | null
          is_enabled: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_type: string
          title?: string | null
          subtitle?: string | null
          content?: Json | null
          is_enabled?: boolean
          display_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_type?: string
          title?: string | null
          subtitle?: string | null
          content?: Json | null
          is_enabled?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      carousel_images: {
        Row: {
          id: string
          image_url: string
          title: string | null
          subtitle: string | null
          cta_text: string | null
          cta_link: string | null
          display_order: number
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title?: string | null
          subtitle?: string | null
          cta_text?: string | null
          cta_link?: string | null
          display_order: number
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title?: string | null
          subtitle?: string | null
          cta_text?: string | null
          cta_link?: string | null
          display_order?: number
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
