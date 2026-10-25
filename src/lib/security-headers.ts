// Shared pure policy builder; the server owns the nonce, never a caller.
export function securityHeaders(nonce: string, development = false) {
  if (!/^[a-f0-9]{32}$/.test(nonce)) throw new Error("Invalid CSP nonce");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' https: data: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.elevenlabs.io wss://api.elevenlabs.io https://*.elevenlabs.io wss://*.elevenlabs.io https://*.livekit.cloud wss://*.livekit.cloud https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://cloud-auth.lovable.dev",
    "media-src 'self' https: blob:",
    "worker-src 'self' blob:",
    "frame-src 'self' https://accounts.google.com https://meet.google.com https://www.youtube.com https://www.youtube-nocookie.com",
    "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ].join('; ');
  return {
    [development ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy']: csp,
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Camera and voice assistants remain available only to this app, not embeds.
    'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), browsing-topics=()',
    // Keep provider sign-in windows working; strict isolation needs a separate rollout.
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Embedder-Policy-Report-Only': 'require-corp',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}

export function protectResponse(response: Response, nonce: string, development = false): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders(nonce, development))) headers.set(name, value);
  // Retain streaming, redirects, multiple cookies and the original status/body.
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}