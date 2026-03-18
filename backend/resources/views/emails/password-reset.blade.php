<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password — CogniVia</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f0f1a;
      color: #ffffff;
      padding: 40px 20px;
    }
    .wrapper {
      max-width: 580px;
      margin: 0 auto;
      background: #1a1a2e;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .header {
      background: linear-gradient(135deg, #6c3fd6, #00c8ff);
      padding: 40px 32px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .tagline {
      font-size: 13px;
      color: rgba(255,255,255,0.75);
      margin-top: 6px;
    }
    .body { padding: 40px 32px; }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .message {
      font-size: 15px;
      color: rgba(255,255,255,0.65);
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .btn-wrapper { text-align: center; margin-bottom: 32px; }
    .btn {
      display: inline-block;
      padding: 14px 36px;
      background: linear-gradient(135deg, #6c3fd6, #00c8ff);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
    }
    .expiry-note {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      text-align: center;
      margin-bottom: 32px;
    }
    .divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 24px;
    }
    .fallback-label {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      margin-bottom: 8px;
    }
    .fallback-url {
      font-size: 12px;
      color: #00c8ff;
      word-break: break-all;
      background: rgba(255,255,255,0.05);
      padding: 10px 14px;
      border-radius: 8px;
    }
    .security-note {
      margin-top: 24px;
      background: rgba(255,200,0,0.07);
      border-left: 3px solid #f5c518;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13px;
      color: rgba(255,255,255,0.55);
      line-height: 1.6;
    }
    .footer {
      background: rgba(0,0,0,0.2);
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">CogniVia</div>
      <div class="tagline">Intelligent Clarity. Start Here.</div>
    </div>
    <div class="body">
      <div class="greeting">Hi, {{ $user->username }} 👋</div>
      <p class="message">
        We received a request to reset the password for your CogniVia account.<br /><br />
        Click the button below to set a new password. This link is valid for
        <strong style="color:#ffffff;">60 minutes</strong> and can only be used once.
      </p>
      <div class="btn-wrapper">
        <a href="{{ $resetUrl }}" class="btn">Reset My Password</a>
      </div>
      <p class="expiry-note">⏱ This link expires in 60 minutes</p>
      <hr class="divider" />
      <p class="fallback-label">If the button doesn't work, copy and paste this link:</p>
      <div class="fallback-url">{{ $resetUrl }}</div>
      <div class="security-note">
        🔒 If you did not request a password reset, you can safely ignore this email.
        Your password will not be changed unless you click the link above.
      </div>
    </div>
    <div class="footer">
      <div>© {{ date('Y') }} CogniVia. All rights reserved.</div>
      <div>This is an automated email — please do not reply.</div>
    </div>
  </div>
</body>
</html>