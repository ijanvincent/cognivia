<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Reset Your Password</title>
</head>
<body style="margin:0;padding:40px 16px;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

    {{-- ===== HEADER ===== --}}
    <div style="padding:24px 36px;background:#111827;border-bottom:1px solid #1f2937;display:flex;align-items:center;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;padding-right:12px;">
            <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;">
              <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('gmail-logo.png'))) }}"
                   alt="" width="36" height="36"
                   style="display:block;border-radius:8px;"/>
            </div>
          </td>
          <td style="vertical-align:middle;">
            <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">CogniVia</span>
          </td>
        </tr>
      </table>
    </div>

    {{-- ===== BODY ===== --}}
    <div style="padding:36px 36px 28px;">
      <p style="font-size:11px;color:#9ca3af;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.08em;">Password reset</p>
      <p style="font-size:15px;font-weight:600;color:#111827;margin:0 0 8px;">Hi, {{ $user->username }}</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 28px;line-height:1.7;">
        We received a request to reset your password. Click the button below — this link expires in
        <strong style="color:#374151;">60 minutes</strong>.
      </p>
      <a href="{{ $resetUrl }}"
         style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        Reset password
      </a>
    </div>

    {{-- ===== FALLBACK LINK ===== --}}
    <div style="padding:20px 36px;border-top:1px solid #f0f0f0;background:#fafafa;">
      <p style="font-size:12px;color:#9ca3af;margin:0 0 4px;">If the button doesn't work, copy this link:</p>
      <p style="font-size:12px;color:#6366f1;margin:0;word-break:break-all;">{{ $resetUrl }}</p>
    </div>

    {{-- ===== FOOTER ===== --}}
    <div style="padding:16px 36px;border-top:1px solid #f0f0f0;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        If you didn't request this, ignore this email.
        &nbsp;&middot;&nbsp;
        &copy; {{ date('Y') }} CogniVia
      </p>
    </div>

  </div>
</body>
</html>