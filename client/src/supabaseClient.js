import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://yqrqmsagiwzzijblstpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcnFtc2FnaXd6emlqYmxzdHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDEyNjIsImV4cCI6MjA5MTE3NzI2Mn0.o5rrqc9i-2Obrtw8KuCN52rG3Y_I4F2pPBZUtM4iMLc'
);
