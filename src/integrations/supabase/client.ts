// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bvcphmmcvawfzgwvpbpt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Y3BobW1jdmF3Znpnd3ZwYnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjI1MjksImV4cCI6MjA1NzM5ODUyOX0.R0FzRUPCSMc7SDulK4KynM-W3t4ruURLyf7YmWVL8k8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);