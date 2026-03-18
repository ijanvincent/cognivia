<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset Your Password — CogniVia</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { border: 0; outline: none; text-decoration: none; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #07080f 0%, #0d0f1f 50%, #07080f 100%);
      color: #f1f5f9;
      margin: 0;
      padding: 0;
    }

    .email-wrapper {
      width: 100%;
      background: linear-gradient(135deg, #07080f 0%, #0d0f1f 50%, #07080f 100%);
      padding: 48px 16px;
    }

    .email-container {
      max-width: 560px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
    }

    /* ── Header ── */
    .email-header {
      padding: 28px 40px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* CogniVia brand — matches topBarBrand style exactly */
    .brand-name {
      font-size: 18px;
      font-weight: 500;
      color: rgba(241, 245, 249, 0.9);
      letter-spacing: 0.01em;
      text-decoration: none;
    }

    .header-badge {
      font-size: 10px;
      font-weight: 600;
      color: rgba(241, 245, 249, 0.35);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 10px;
      border-radius: 100px;
    }

    /* ── Body ── */
    .email-body {
      padding: 40px 40px 36px;
    }

    .email-greeting {
      font-size: 21px;
      font-weight: 600;
      color: #f1f5f9;
      letter-spacing: -0.3px;
      margin-bottom: 12px;
      line-height: 1.35;
    }

    .email-text {
      font-size: 14px;
      color: rgba(241, 245, 249, 0.5);
      line-height: 1.75;
    }

    /* ── CTA ── */
    .btn-wrapper {
      margin: 32px 0 0;
    }

    .btn-cta {
      display: inline-block;
      padding: 13px 30px;
      background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%);
      color: #07080f !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    /* ── Divider ── */
    .email-divider {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      margin: 28px 0;
    }

    /* ── Info list ── */
    .info-list {
      list-style: none;
      margin: 0 0 28px;
      padding: 0;
    }

    .info-list li {
      font-size: 13px;
      color: rgba(241, 245, 249, 0.4);
      padding: 4px 0 4px 16px;
      position: relative;
      line-height: 1.6;
    }

    .info-list li::before {
      content: '–';
      position: absolute;
      left: 0;
      color: #22d3ee;
    }

    /* ── Fallback ── */
    .fallback-section {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }

    .fallback-label {
      font-size: 10px;
      font-weight: 600;
      color: rgba(241, 245, 249, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 6px;
    }

    .fallback-url {
      font-size: 11px;
      color: #22d3ee;
      word-break: break-all;
      line-height: 1.6;
      font-family: 'Courier New', Courier, monospace;
    }

    /* ── Security ── */
    .security-notice {
      border: 1px solid rgba(245, 197, 24, 0.12);
      border-left: 3px solid rgba(245, 197, 24, 0.5);
      border-radius: 8px;
      padding: 14px 18px;
      background: rgba(245, 197, 24, 0.03);
    }

    .security-text {
      font-size: 12px;
      color: rgba(241, 245, 249, 0.4);
      line-height: 1.65;
    }

    /* ── Footer ── */
    .email-footer {
      padding: 24px 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .footer-text {
      font-size: 11px;
      color: rgba(241, 245, 249, 0.2);
      line-height: 1.7;
    }

    .footer-links {
      margin-top: 10px;
    }

    .footer-links a {
      font-size: 11px;
      color: rgba(241, 245, 249, 0.3);
      text-decoration: none;
      margin-right: 14px;
    }

    @media (max-width: 600px) {
      .email-wrapper  { padding: 24px 12px; }
      .email-header   { padding: 20px 24px; }
      .header-inner   { flex-direction: column; align-items: flex-start; gap: 10px; }
      .email-body     { padding: 28px 24px 24px; }
      .email-footer   { padding: 20px 24px; }
      .email-greeting { font-size: 19px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- Header -->
      <div class="email-header">
        <div class="header-inner">
          <span class="brand-name">CogniVia</span>
          <div class="header-badge">Security Notice</div>
        </div>
      </div>

      <!-- Body -->
      <div class="email-body">

        <h1 class="email-greeting">Hi {{ $user->username }},<br/>reset your password.</h1>

        <p class="email-text">
          Someone requested a password reset for your CogniVia account.
          Use the button below to set a new password.
          If this wasn't you, you can safely ignore this email.
        </p>

        <div class="btn-wrapper">
          <a href="{{ $resetUrl }}" class="btn-cta">Reset Password →</a>
        </div>

        <hr class="email-divider" />

        <ul class="info-list">
          <li>All active sessions will be signed out after reset.</li>
          <li>This link can only be used once.</li>
        </ul>

        <div class="fallback-section">
          <div class="fallback-label">Button not working? Copy this link</div>
          <div class="fallback-url">{{ $resetUrl }}</div>
        </div>

        <div class="security-notice">
          <div class="security-text">
            If you didn't request this, no changes will be made to your account.
            If you're concerned about unauthorized access, consider reviewing your account security.
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="email-footer">
        <div class="footer-text">© {{ date('Y') }} CogniVia · Automated message, do not reply.</div>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Help</a>
        </div>
      </div>

    </div>
  </div>
</body>
</html>