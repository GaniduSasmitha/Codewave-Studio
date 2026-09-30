import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Authentication required' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !anonKey || !serviceRoleKey) return json({ error: 'Server configuration error' }, 500);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const isGoogleUser = user.app_metadata?.provider === 'google'
    || user.app_metadata?.providers?.includes('google');
  const source = user.user_metadata?.picture || user.user_metadata?.avatar_url;
  if (!isGoogleUser || typeof source !== 'string') return json({ error: 'No Google profile photo available' }, 400);

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(source);
  } catch {
    return json({ error: 'Invalid profile photo URL' }, 400);
  }

  const trustedHost = sourceUrl.hostname === 'googleusercontent.com'
    || sourceUrl.hostname.endsWith('.googleusercontent.com');
  if (sourceUrl.protocol !== 'https:' || !trustedHost) return json({ error: 'Untrusted profile photo host' }, 400);

  let imageResponse: Response;
  try {
    imageResponse = await fetch(sourceUrl, {
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
      headers: { Accept: 'image/jpeg,image/png,image/webp' },
    });
  } catch {
    return json({ error: 'Could not retrieve profile photo' }, 502);
  }
  if (!imageResponse.ok) return json({ error: 'Could not retrieve profile photo' }, 502);

  const mimeType = imageResponse.headers.get('content-type')?.split(';')[0]?.toLowerCase();
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  if (!mimeType || !extensions[mimeType]) return json({ error: 'Unsupported profile photo type' }, 415);

  const declaredSize = Number(imageResponse.headers.get('content-length') || 0);
  if (declaredSize > 2 * 1024 * 1024) return json({ error: 'Profile photo is too large' }, 413);
  const imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
  if (imageBytes.byteLength === 0 || imageBytes.byteLength > 2 * 1024 * 1024) {
    return json({ error: 'Profile photo is empty or too large' }, 413);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const avatarPath = `${user.id}/profile.${extensions[mimeType]}`;
  const { error: uploadError } = await admin.storage.from('avatars').upload(avatarPath, imageBytes, {
    contentType: mimeType,
    cacheControl: '3600',
    upsert: true,
  });
  if (uploadError) return json({ error: 'Could not store profile photo' }, 500);

  const { error: profileError } = await admin
    .from('profiles')
    .update({ avatar_path: avatarPath })
    .eq('id', user.id);
  if (profileError) {
    await admin.storage.from('avatars').remove([avatarPath]);
    return json({ error: 'Could not attach profile photo' }, 500);
  }

  return json({ avatar_path: avatarPath });
});
