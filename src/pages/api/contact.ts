import type { APIRoute } from 'astro';

export const prerender = false;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function env(key: string): string | undefined {
  // Works both in the Astro build context and the Vercel serverless runtime.
  return (
    (import.meta.env as Record<string, string | undefined>)[key] ??
    (typeof process !== 'undefined' ? process.env?.[key] : undefined)
  );
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function readPayload(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await request.json().catch(() => ({}));
    return data && typeof data === 'object'
      ? (data as Record<string, string>)
      : {};
  }
  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) out[key] = String(value);
  return out;
}

const INQUIRY_LABELS: Record<string, string> = {
  repair: 'Repair / Service',
  sales: 'Buy a product',
  'custom-pc': 'Custom PC build',
  networking: 'Networking / Wi-Fi',
  cctv: 'CCTV / Security',
  amc: 'AMC / IT support',
  'web-development': 'Website development',
  other: 'Other',
};

export const POST: APIRoute = async ({ request }) => {
  const data = await readPayload(request);

  // Honeypot — silently accept bots without notifying Telegram.
  if (String(data.botcheck ?? '').trim()) {
    return jsonResponse({ success: true });
  }

  const firstName = String(data.firstName ?? '').trim();
  const lastName = String(data.lastName ?? '').trim();
  const name = [firstName, lastName].filter(Boolean).join(' ') || '—';
  const email = String(data.email ?? '').trim();
  const phone = [data.phoneCountryCode, data.phone]
    .map(v => String(v ?? '').trim())
    .filter(Boolean)
    .join(' ');
  const inquiry = String(data.inquiryType ?? '').trim();
  const inquiryLabel = INQUIRY_LABELS[inquiry] || inquiry || '—';
  const message = String(data.message ?? '').trim();

  if (!email && !phone) {
    return jsonResponse(
      { success: false, message: 'Please provide an email or phone number.' },
      400
    );
  }

  const token = env('TELEGRAM_BOT_TOKEN');
  const chatId = env('TELEGRAM_CHAT_ID');

  if (!token || !chatId) {
    return jsonResponse(
      {
        success: false,
        message:
          'Messaging is not configured yet. Please call or WhatsApp us in the meantime.',
      },
      500
    );
  }

  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const text =
    `📩 <b>New Enquiry from Website</b>\n\n` +
    `Name: ${esc(name)}\n` +
    `Looking for: ${esc(inquiryLabel)}\n` +
    (email ? `Email: ${esc(email)}\n` : '') +
    (phone ? `Phone: ${esc(phone)}\n` : '') +
    (message ? `\nMessage:\n${esc(message)}\n` : '') +
    `\nReceived: ${timestamp}\n` +
    `Site: mainfotech.com`;

  const tgRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    }
  ).catch(() => null);

  const tgData = tgRes ? await tgRes.json().catch(() => null) : null;

  if (!tgRes || !tgRes.ok || !tgData?.ok) {
    return jsonResponse(
      {
        success: false,
        message:
          'Sorry, we could not send your message right now. Please try again.',
      },
      502
    );
  }

  return jsonResponse({ success: true });
};
