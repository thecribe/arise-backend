export function createEmailVerificationHTML({
  firstName = "Valued User",
  companyName = "Arise Nursing Agency",
  verificationLink,
  expiryTime = "30 Minutes",
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email Address</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        background-color: #f4f7fa;
        color: #333333;
        line-height: 1.6;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }

      .header {
        background: linear-gradient(135deg, #2563eb, #1e40af);
        padding: 35px 40px;
        text-align: center;
        color: white;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }

      .content {
        padding: 40px;
      }

      .greeting {
        font-size: 18px;
        margin-bottom: 20px;
        color: #1f2937;
      }

      .message {
        font-size: 16px;
        margin-bottom: 20px;
        color: #4b5563;
      }

      .button {
        display: inline-block;
        background-color: #2563eb;
        color: #ffffff !important;
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        border-radius: 6px;
        margin: 25px 0;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      .info-box {
        background-color: #f8fafc;
        border-left: 4px solid #2563eb;
        padding: 20px;
        margin: 30px 0;
        border-radius: 6px;
      }

      .footer {
        background-color: #f8fafc;
        padding: 30px 40px;
        text-align: center;
        font-size: 14px;
        color: #64748b;
        border-top: 1px solid #e2e8f0;
      }

      .name {
        font-weight: 600;
        color: #1e40af;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        <h1>Email Verification</h1>
      </div>

      <div class="content">

        <p class="greeting">
          Hello <span class="name">${firstName}</span>,
        </p>

        <p class="message">
          Welcome to <strong>${companyName}</strong>.
        </p>

        <p class="message">
          Thank you for creating your account. Before you can sign in, please
          verify your email address by clicking the button below.
        </p>

        <div style="text-align:center;">
          <a href="${verificationLink}" class="button" target="_blank">
            Verify Email Address
          </a>
        </div>

        <div class="info-box">
          <strong>Please note:</strong><br />
          • This verification link will expire in <strong>${expiryTime}</strong>.<br />
          • The link can only be used once.<br />
          • If you did not create this account, you can safely ignore this email.
        </div>

        <p class="message">
          If the button above doesn't work, copy and paste the following URL
          into your browser:
        </p>

        <p class="message" style="word-break: break-all;">
          ${verificationLink}
        </p>

        <p class="message">
          Once your email has been verified, you'll be able to access your account.
        </p>

        <p style="margin-top:35px;">
          Best regards,
        </p>

        <p style="font-weight:600;color:#1f2937;">
          ${companyName}
        </p>

      </div>

      <div class="footer">
        <p>
          This is an automated email from
          <strong>${companyName}</strong>.
        </p>
        <p>
          Please do not reply directly to this email.
        </p>
      </div>

    </div>
  </body>
</html>
`;
}

export function createEmailVerificationText({
  firstName = "Valued User",
  companyName = "Arise Nursing Agency",
  verificationLink,
  expiryTime = "30 Minutes",
}) {
  return `
Hello ${firstName},

Welcome to ${companyName}.

Thank you for creating your account.

Before you can sign in, please verify your email address by visiting the link below:

${verificationLink}

Please note:
• This verification link will expire in ${expiryTime}.
• The link can only be used once.
• If you did not create this account, you can safely ignore this email.

Once your email has been verified, you'll be able to access your account.

Best regards,

${companyName}

---
This is an automated email from ${companyName}.
Please do not reply directly to this email.
`.trim();
}
