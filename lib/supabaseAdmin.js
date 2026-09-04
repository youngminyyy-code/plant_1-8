import { createClient } from "@supabase/supabase-js";

// ⚠️ 이 파일은 서버(API Route)에서만 사용하세요.
// SUPABASE_SERVICE_ROLE_KEY 는 모든 보안 규칙(RLS)을 무시하는 강력한 키라서
// 절대 브라우저 코드("use client" 컴포넌트)에서 불러오면 안 됩니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
