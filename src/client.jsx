import { createClient } from '@supabase/supabase-js'

const URL = 'https://wevshcwhyuvwvzxsefjj.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldnNoY3doeXV2d3Z6eHNlZmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNTgyNDMsImV4cCI6MjAxNDYzNDI0M30.JbFVLtcCzvGT_fEOxkw6rn312Sb8BlHxOMtmPtFQTMM';

export const supabase = createClient(URL, API_KEY);