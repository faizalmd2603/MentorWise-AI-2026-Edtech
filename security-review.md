# FlawPilot security and performance review

## Implemented in preview, not published
- Production Content Security Policy uses a unique server-generated nonce for framework scripts; inline event handlers and plugin objects are blocked. Inline styles remain allowed because the editor, resume templates and animations require them.
- Framing is restricted to the app and the Lovable editor by CSP. X-Frame-Options provides a same-origin fallback.
- Permissions Policy permits camera/microphone only for the app; location, payment, USB and related unused features are disabled.
- COOP uses same-origin-allow-popups to preserve provider sign-in. Strong COOP/COEP cross-origin isolation is **not enabled**; COEP is report-only pending a complete third-party resource compatibility rollout.
- Security headers cover server responses and error pages without buffering/compressing response bodies.
- Sidebar preference cookie now uses SameSite=Lax and Secure on HTTPS. This is not a login cookie, and must remain JavaScript-readable.
- Removed the artificial 1.6-second homepage interaction blocker and hero remount. Animations are retained.
- Resume/video tool bundles load on demand. Replaced broad icon namespace lookups with a bounded shared icon map.
- Added intrinsic dimensions to official banner, logos, testimonial photos and certificate images; deferred below-the-fold image loading.

## Verified
- All 14 security/search/resume unit tests passed.
- Preview home response 200; nonce present and framework script nonces matched.
- Browser test applying enforced script policy rejected a newly inserted untrusted inline script.
- Fresh browser: authenticated session loaded, resume template gallery opened, mobile certificate opened and closed; no page errors.
- Latest automatic build reports build OK.
- No Lighthouse/FlawPilot rescan or production header verification after publishing was performed. No new performance score is claimed.

## Outside app control / pending
1. **DMARC:** public DNS had no _dmarc TXT. Confirm Zoho DKIM and all sending sources before enforcing rejection. Start with `v=DMARC1; p=none` for observation (this alone does not stop forgery), then move to quarantine/reject after validating alignment. Do not invent a reporting mailbox.
2. **DKIM:** correct Zoho selector is unknown; obtain its exact record in Zoho Mail Admin Console. Absence at a guessed selector does not prove DKIM is absent. Lovable sender `info.mentorwiseai.store` is verified and ready; keep its delegated records separate from Zoho apex MX/SPF.
3. **SPF:** apex currently publishes `v=spf1 include:zoho.in ~all`. Do not create a second SPF record or remove Zoho authorization.
4. **MTA-STS:** no _mta-sts TXT. Requires an HTTPS policy at `https://mta-sts.mentorwiseai.store/.well-known/mta-sts.txt`, with the actual Zoho MX hosts (`mx.zoho.in`, `mx2.zoho.in`, `mx3.zoho.in`). Set up and validate that host first; do not publish an enforce policy before its HTTPS policy is available.
5. **CAA:** no CAA observed. Domain provider must add records allowing the hosting authorities documented by Lovable: Let's Encrypt, Google Trust Services and SSL.com. Confirm exact issuer identifiers and wildcard requirements before restricting renewals.
6. **DNSSEC:** no parent DS observed. Enable signing at the DNS provider and register its exact DS at the registrar; never invent DS values.
7. **IPv6:** no AAAA observed. Needs a hosting-supported IPv6 target; do not point an invented address at the domain.
8. **Unexpected port:** report does not identify port, protocol or host. Hosting controls listening ports; app code cannot close them. Obtain the scanner's exact evidence before action.
9. **__dpl / login cookie:** no app code creates __dpl. Hosting-issued cookies cannot safely be renamed or rewritten here. Live response observed an edge bot cookie with Secure and HttpOnly; that is not evidence about the scanner's unnamed login cookie. Need exact cookie name/attributes to verify ownership.
10. **Rate limiting:** Lovable backend has no standard rate-limit primitive. No new ad-hoc limiter was installed; requires user confirmation of tradeoffs. Provider-side bot/request controls are preferable for infrastructure-level protection.
11. **Strict isolation:** intentionally pending because forced COEP can block fonts, images, video and sign-in. A scanner score alone is not justification to break integrations.

## Release and reassessment
Publish the app changes, inspect production headers and integrations, then rerun FlawPilot against `https://mentorwiseai.store`. Several reported rows are duplicates. A score above 98 cannot be guaranteed by app edits while provider-controlled findings remain unresolved.