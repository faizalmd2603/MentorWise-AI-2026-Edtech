import { describe, expect, it } from 'vitest';
import { protectResponse, securityHeaders } from '../security-headers';

const nonce = '0123456789abcdef0123456789abcdef';
describe('browser security protections', () => {
  it('requires a nonce for scripts and disallows injected event handlers', () => {
    const csp = securityHeaders(nonce)['Content-Security-Policy'];
    expect(csp).toContain(`script-src 'self' 'nonce-${nonce}'`);
    expect(csp.split('; ').find(d => d.startsWith('script-src '))).not.toContain('unsafe-inline');
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("object-src 'none'");
  });
  it('blocks scam-site framing while allowing the Lovable editor', () => {
    expect(securityHeaders(nonce)['Content-Security-Policy']).toContain("frame-ancestors 'self' https://lovable.dev https://*.lovable.dev");
    expect(securityHeaders(nonce)['X-Frame-Options']).toBe('SAMEORIGIN');
  });
  it('restricts camera and microphone to the app and disables location', () => {
    expect(securityHeaders(nonce)['Permissions-Policy']).toContain('camera=(self), microphone=(self), geolocation=()');
  });
  it('isolates the opener while preserving OAuth popups', () => {
    expect(securityHeaders(nonce)['Cross-Origin-Opener-Policy']).toBe('same-origin-allow-popups');
  });
  it('preserves redirects and cookies', async () => {
    const result = protectResponse(new Response(null, {status: 302, headers: {location: '/auth', 'set-cookie': 'test=value; Secure; HttpOnly'}}), nonce);
    expect(result.status).toBe(302);
    expect(result.headers.get('location')).toBe('/auth');
    expect(result.headers.get('set-cookie')).toBe('test=value; Secure; HttpOnly');
  });
  it('rejects caller-controlled invalid nonce values', () => {
    expect(() => securityHeaders("'; script-src *")).toThrow('Invalid CSP nonce');
  });
});