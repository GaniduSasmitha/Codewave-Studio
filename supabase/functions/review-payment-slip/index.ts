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

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const planNames: Record<string, string> = {
  starter: 'Business Web',
  business: 'E-Commerce',
  custom: 'Web App',
  maintenance: 'Maintenance & Support',
};

type Requirements = {
  businessName?: string;
  preferredDomain?: string;
  description?: string;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Authentication required' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const emailFrom = Deno.env.get('ORDER_EMAIL_FROM');
  const replyTo = Deno.env.get('ORDER_REPLY_TO') || 'codewave.studio.tech@gmail.com';
  const siteUrl = Deno.env.get('SITE_URL') || 'https://codewave.studio.tech';

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !resendApiKey || !emailFrom) {
    return json({ error: 'Order email service is not configured' }, 500);
  }

  let body: { orderId?: unknown; decision?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : '';
  const decision = body.decision === 'verified' || body.decision === 'rejected' ? body.decision : null;
  if (!orderId || !decision) return json({ error: 'A valid order and decision are required' }, 400);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: { user: reviewer }, error: reviewerError } = await userClient.auth.getUser();
  if (reviewerError || !reviewer) return json({ error: 'Invalid session' }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: reviewerProfile, error: roleError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', reviewer.id)
    .single();
  if (roleError || reviewerProfile?.role !== 'admin') return json({ error: 'Admin access required' }, 403);

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, customer_id, package, price, requirements, status, created_at')
    .eq('id', orderId)
    .single();
  if (orderError || !order) return json({ error: 'Order not found' }, 404);
  if (order.status !== 'pending_verification') {
    return json({ error: 'This payment slip has already been reviewed' }, 409);
  }

  const { data: customerResult, error: customerError } = await admin.auth.admin.getUserById(order.customer_id);
  const customer = customerResult?.user;
  if (customerError || !customer?.email) return json({ error: 'Customer email address is unavailable' }, 422);

  const { data: customerProfile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', order.customer_id)
    .maybeSingle();

  let requirements: Requirements = {};
  try {
    requirements = JSON.parse(order.requirements || '{}');
  } catch {
    requirements = { description: order.requirements || '' };
  }

  const reviewedAt = new Date().toISOString();
  const statusUpdate = decision === 'verified'
    ? { status: 'verified', verified_at: reviewedAt, verified_by: reviewer.id }
    : { status: 'rejected', verified_at: null, verified_by: null };

  const { data: updatedOrder, error: updateError } = await admin
    .from('orders')
    .update(statusUpdate)
    .eq('id', orderId)
    .eq('status', 'pending_verification')
    .select('id')
    .maybeSingle();
  if (updateError) return json({ error: 'Could not update the order' }, 500);
  if (!updatedOrder) return json({ error: 'This payment slip has already been reviewed' }, 409);

  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const supportEmail = 'codewave.studio.tech@gmail.com';
  const supportEmailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(`Order #${orderNumber}`)}`;
  const customerName = customerProfile?.full_name || customer.user_metadata?.full_name || 'Customer';
  const planName = planNames[order.package] || order.package || 'Custom Project';
  const accepted = decision === 'verified';
  const subject = accepted
    ? `Payment accepted — Order #${orderNumber}`
    : `Payment slip rejected — Order #${orderNumber}`;
  const headline = accepted ? 'Your payment has been accepted' : 'Your payment slip was rejected';
  const message = accepted
    ? 'We have verified your payment and accepted your order. You can follow the live project status and track each order update from your Client Dashboard. Our team will also contact you with the next project steps.'
    : 'We could not verify the payment slip you submitted. Please sign in to your dashboard and upload a clear, valid payment-slip image to continue.';
  const accent = accepted ? '#15803d' : '#b91c1c';
  const dashboardUrl = `${siteUrl.replace(/\/$/, '')}/#orders-dashboard`;

  const detailRows = [
    ['Order number', `#${orderNumber}`],
    ['Package', planName],
    ['Price', `LKR ${Number(order.price).toLocaleString()}`],
    ['Business name', requirements.businessName || 'Not provided'],
    ['Preferred domain', requirements.preferredDomain || 'Not specified'],
  ].map(([label, value]) => `
    <tr>
      <td style="padding:9px 12px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</td>
      <td style="padding:9px 12px;color:#0b132b;font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #e2e8f0">${escapeHtml(value)}</td>
    </tr>`).join('');

  const emailHtml = `<!doctype html>
  <html lang="en"><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0b132b">
    <div style="max-width:620px;margin:0 auto;padding:32px 16px">
      <div style="background:#0b132b;padding:24px;border-radius:16px 16px 0 0;text-align:center">
        <div style="color:#f3c623;font-size:12px;font-weight:800;letter-spacing:2px">CODEWAVE STUDIO</div>
      </div>
      <div style="background:#ffffff;padding:30px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0">
        <div style="display:inline-block;padding:6px 10px;border-radius:999px;background:${accent}18;color:${accent};font-size:11px;font-weight:800;text-transform:uppercase">${accepted ? 'Payment verified' : 'Action required'}</div>
        <h1 style="font-size:25px;line-height:1.25;margin:18px 0 10px">${headline}</h1>
        <p style="font-size:15px;line-height:1.7;color:#475569">Hello ${escapeHtml(customerName)},</p>
        <p style="font-size:15px;line-height:1.7;color:#475569">${message}</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">${detailRows}</table>
        ${requirements.description ? `<div style="margin:20px 0"><div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#64748b;margin-bottom:7px">Project details</div><div style="font-size:14px;line-height:1.6;color:#334155;background:#f8fafc;padding:14px;border-radius:9px">${escapeHtml(requirements.description)}</div></div>` : ''}
        ${accepted ? '<p style="font-size:14px;line-height:1.7;color:#475569">Use the button below at any time to view your order’s live progress in the Client Dashboard.</p>' : ''}
        <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;margin-top:6px;padding:12px 18px;background:#d4af37;color:#0b132b;text-decoration:none;border-radius:9px;font-size:14px;font-weight:800">${accepted ? 'Track Your Order' : 'Upload a New Payment Slip'}</a>
        <p style="margin-top:28px;font-size:13px;line-height:1.7;color:#64748b">For future details, call us on <a href="tel:+94717441420" style="color:#8a6a00;font-weight:700">+94 71 744 1420</a> or email <a href="${escapeHtml(supportEmailUrl)}" style="color:#8a6a00;font-weight:700">${supportEmail}</a>. Please include order number <strong>#${orderNumber}</strong> in your email.</p>
        <p style="font-size:13px;color:#64748b">Regards,<br><strong style="color:#0b132b">Codewave Studio</strong></p>
      </div>
    </div>
  </body></html>`;

  const emailText = [
    headline,
    `Hello ${customerName},`,
    message,
    `Order number: #${orderNumber}`,
    `Package: ${planName}`,
    `Price: LKR ${Number(order.price).toLocaleString()}`,
    `Business name: ${requirements.businessName || 'Not provided'}`,
    `Preferred domain: ${requirements.preferredDomain || 'Not specified'}`,
    requirements.description ? `Project details: ${requirements.description}` : '',
    accepted
      ? `Track your order's live progress in the Client Dashboard: ${dashboardUrl}`
      : `Upload a new payment slip from your Client Dashboard: ${dashboardUrl}`,
    `For future details, call +94 71 744 1420 or email ${supportEmail}. Please include order number #${orderNumber} in your email.`,
    'Regards, Codewave Studio',
  ].filter(Boolean).join('\n\n');

  let emailResponse: Response;
  try {
    emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [customer.email],
        reply_to: replyTo,
        subject,
        html: emailHtml,
        text: emailText,
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    emailResponse = new Response(null, { status: 503 });
  }

  if (!emailResponse.ok) {
    let providerMessage = `Resend returned HTTP ${emailResponse.status}`;
    try {
      const providerError = await emailResponse.json();
      if (typeof providerError?.message === 'string') providerMessage = providerError.message;
      else if (typeof providerError?.error === 'string') providerMessage = providerError.error;
    } catch {
      // Keep the status-based message when Resend does not return JSON.
    }

    const { error: rollbackError } = await admin
      .from('orders')
      .update({ status: 'pending_verification', verified_at: null, verified_by: null })
      .eq('id', orderId)
      .eq('status', decision);
    console.error('Order email delivery failed', providerMessage, rollbackError?.message || 'rollback successful');
    return json({
      error: rollbackError
        ? 'Email delivery failed and the order status could not be restored. Please check the order immediately.'
        : `Email delivery failed: ${providerMessage}. The order was left pending so you can retry.`,
    }, 502);
  }

  return json({ status: decision, emailSent: true, recipient: customer.email });
});
