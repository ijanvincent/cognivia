<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no"/>
  <title>Reset Your Password — CogniVia</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-decoration-color: inherit; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    .btn-reset:hover { background: #1f2937 !important; }
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#f3f4f6;-webkit-font-smoothing:antialiased;">

  {{-- PRE-HEADER --}}
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Someone requested a password reset for your CogniVia account. This link expires in 60 minutes. &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 1px 4px rgba(0,0,0,.06);">

          {{-- HEADER --}}
          <tr>
            <td style="background:#0d1117;padding:22px 36px;border-bottom:1px solid #1f2937;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    {{--
                      FIX: Use embedData() instead of embed().
                      embed()     → Laravel names the MIME part after the filename ("gmail-logo.png")
                                    which Gmail surfaces as a visible attachment.
                      embedData() → We pass raw binary + mime type with NO filename,
                                    so Gmail treats it as a truly inline/hidden part — no attachment shown.
                    --}}
                    <img
                      src="{{ $message->embedData(file_get_contents(public_path('gmail-logo.png')), 'image/png') }}"
                      alt="CogniVia"
                      width="36"
                      height="36"
                      style="display:block;width:36px;height:36px;border-radius:50%;object-fit:cover;"
                    />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;letter-spacing:-0.2px;line-height:1;">CogniVia</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- BODY --}}
          <tr>
            <td style="padding:36px 36px 28px;">

              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 20px;">
                Password Reset
              </p>

              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;color:#6b7280;margin:0 0 6px;line-height:1.7;">
                Hi <strong style="color:#374151;">{{ $user->username }}</strong>,
              </p>
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;color:#6b7280;margin:0 0 30px;line-height:1.7;">
                We received a request to reset the password associated with your CogniVia account.
                Click the button below to proceed. This link will expire in
                <strong style="color:#111827;">60&nbsp;minutes</strong>.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:8px;background:#111827;">
                    <a href="{{ $resetUrl }}"
                       class="btn-reset"
                       target="_blank"
                       rel="noopener noreferrer"
                       style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;padding:13px 30px;border-radius:8px;background:#111827;mso-padding-alt:0;letter-spacing:0.01em;">
                      <!--[if mso]><i style="letter-spacing:30px;mso-font-width:-100%;mso-text-raise:30pt">&nbsp;</i><![endif]-->
                      Reset Password
                      <!--[if mso]><i style="letter-spacing:30px;mso-font-width:-100%">&nbsp;</i><![endif]-->
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          {{-- FALLBACK LINK --}}
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #f0f0f0;background:#fafafa;">
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#9ca3af;margin:0 0 6px;line-height:1.6;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#6366f1;margin:0;word-break:break-all;line-height:1.6;">
                {{ $resetUrl }}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 36px;border-top:1px solid #f0f0f0;">
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#9ca3af;margin:0;line-height:1.7;">
             Not you? Ignore this email. &copy;&nbsp;{{ date('Y') }}&nbsp;CogniVia.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>