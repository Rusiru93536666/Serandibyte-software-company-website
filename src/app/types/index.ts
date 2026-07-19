export interface ContentSection {
  id?: number
  section?: string
  title?: string
  subtitle?: string
  description?: string
  button_text?: string
  button_link?: string
  is_active?: boolean
  display_order?: number
}

export interface ContactMessage {
  id?: number
  service?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  status?: string
}
