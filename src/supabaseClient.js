// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Supabase URL ve Anon Key
const SUPABASE_URL = 'https://dvbprqkvrcpmxugyjohx.supabase.co'; // Supabase URL'inizi buraya ekleyin
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2YnBycWt2cmNwbXh1Z3lqb2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTQ3NTEsImV4cCI6MjAzOTgzMDc1MX0.4M2RfKIm8b2W5XFhPu2_cYTwIBWo4g8tRvuxHld1ZVM'; // Supabase Anon Key'inizi buraya ekleyin

// Supabase istemcisini oluşturun
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
