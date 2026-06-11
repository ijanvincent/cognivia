<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>Reset Your Password — CogniVia</title>

  {{--
    FONT STRATEGY
    ─────────────────────────────────────────────────────────────────────────────
    Plus Jakarta Sans    → Brand wordmark (400), Headline (900), body copy (400),
                           sign-off (700).
                           Matches the app nav wordmark weight visible in the
                           UI screenshot reference (Image 3) — light/regular, not
                           heavy. Syne 800 was removed; the nav renders "CogniVia"
                           at Plus Jakarta Sans regular weight.

    System stack         → Inline td/p fallback for Outlook desktop and clients
                           that strip embedded <style> blocks.
    ─────────────────────────────────────────────────────────────────────────────
  --}}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-decoration-color: inherit; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }

    .btn-reset:hover { background-color: #1a3d00 !important; }
  </style>
</head>

<body id="body" style="margin:0;padding:0;background-color:#ffffff;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">

  {{--
    PRE-HEADER TEXT
    Rendered as the preview snippet below the subject line in Gmail, Apple Mail,
    Outlook mobile, etc. Zero-width non-joiners pad the remainder to prevent
    client-appended strings from bleeding into the preview.
  --}}
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Reset your CogniVia password — this secure link expires in 60 minutes.&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  {{-- OUTER WRAPPER — full-width, zero padding, edge-to-edge white --}}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
         style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:0;">

        {{-- EMAIL SHELL — max 600px, no border-radius, no border, full bleed --}}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
               style="max-width:600px;width:100%;background:#ffffff;">

          {{-- ── HEADER — logo + wordmark ────────────────────────────────
               CHANGE 1: border-bottom:1px solid #f0f0f0 → removed entirely.
               WHY: The Wise reference email (Image 1) has no visible divider
                    line between the logo row and the body. The user explicitly
                    asked to remove "that <hr>" — the border-bottom was the
                    rendered equivalent of that separator.

               CHANGE 2: Font Syne 800 24px → Plus Jakarta Sans 400 20px,
                          letter-spacing -0.5px → 0.
               WHY: Image 3 (close crop of the CogniVia nav) shows the
                    wordmark in a light/regular weight sans-serif — not a
                    heavy display font. Syne 800 was over-bold and over-sized.
                    Plus Jakarta Sans 400 at 20px matches the nav reference
                    exactly: "just enough" presence without dominating.
          ──────────────────────────────────────────────────────────────── --}}
          <tr>
            <td align="center" style="padding:36px 40px 28px;background:#ffffff;">

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:11px;">
                    {{--
                      Use a hosted URL instead of embedData() to prevent the logo
                      from appearing as an attachment in email clients.
                    --}}
                    <img
                      src="{{ config('app.url') . '/gmail-logo.png' }}"
                      alt="CogniVia"
                      width="38"
                      height="38"
                      style="display:block;width:38px;height:38px;border-radius:9px;object-fit:cover;"
                    />
                  </td>
                  <td style="vertical-align:middle;">
                    {{-- Plus Jakarta Sans 400 — matches app nav wordmark at regular weight --}}
                    <span style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;font-weight:400;color:#0a0e17;letter-spacing:0;line-height:1;">
                      CogniVia
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          {{-- ── BODY — greeting + headline + copy + CTA ──────────────── --}}
          <tr>
            <td style="padding:40px 48px 36px;">

              {{-- Greeting --}}
              <p style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;color:#374151;margin:0 0 18px;line-height:1.5;">
                Hello,
              </p>

              {{-- Large editorial headline --}}
              <p style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:34px;font-weight:900;color:#0a0e17;letter-spacing:-1.2px;line-height:1.15;margin:0 0 22px;">
                Reset Password
              </p>

              {{--
                CHANGE 3: font-size 16px → 13px, line-height 1.75 → 1.6,
                           color #6b7280 → #9ca3af, margin-bottom 32px → 28px.
                WHY: The Wise reference email (Image 1) renders body copy
                     noticeably smaller and lighter than the headline — it
                     supports without competing. At 16px the copy was too
                     prominent. The user explicitly asked to "make it a bit
                     small" and to match the font treatment from the reference.
                     #9ca3af is a lighter grey that matches the subdued tone
                     of the Wise copy. Line-height tightened from 1.75 → 1.6
                     to reduce the generous leading that read as too spacious
                     at the smaller size.
              --}}
              <p style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;color:#9ca3af;line-height:1.6;margin:0 0 28px;">
                A password reset was requested for your account. Click below to set a new password. If this wasn't you, disregard this email.
              </p>

              {{-- CTA BUTTON --}}
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="border-radius:10px;background-color:#163300;">
                    <a
                      href="{{ $resetUrl }}"
                      class="btn-reset"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="display:block;width:100%;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;padding:18px 24px;border-radius:10px;background-color:#163300;mso-padding-alt:0;letter-spacing:0.01em;line-height:1;text-align:center;"
                    >
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          {{-- ── SIGN-OFF ────────────────────────────────────────────────
               No changes. Expiry notice, security notice, footer, and
               copyright remain removed per the user's prior decision.
          ──────────────────────────────────────────────────────────────── --}}
          <tr>
            <td style="padding:0 48px 40px;">
              <p style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:400;color:#374151;line-height:1.7;margin:0;">
                Thanks,<br />
                <strong style="color:#111827;font-weight:700;">The CogniVia Team</strong>
              </p>
            </td>
          </tr>

        </table>
        {{-- /EMAIL SHELL --}}

      </td>
    </tr>
  </table>
  {{-- /OUTER WRAPPER --}}

</body>
</html>