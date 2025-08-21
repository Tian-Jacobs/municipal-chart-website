
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dmhprjobdsajnreesixc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaHByam9iZHNham5yZWVzaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjI5OTAsImV4cCI6MjA3MTMzODk5MH0.hXXv9wyX1Z-ogLD6169ZHwHaO2ksxFETZuskj3noxv0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
