export function createReferenceEmailHTML({
  refereeName = "Valued Referee",
  applicantName,
  companyName = "Arise Nursing Agency",
  formLink,
  yourFullName,
  yourPosition = "Recruitment Team",
  yourPhone = "03301335287",
  yourEmail = "info@developer.cribe.org",
}) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reference Request</title>
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
        margin-bottom: 30px;
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
      <!-- Header -->
      <div class="header">
        <h1>Reference Request</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p class="greeting">Dear <span class="name">${refereeName}</span>,</p>
        <p class="message">I hope this message finds you well.</p>

        <p class="message">
          We are writing on behalf of <strong>${companyName}</strong> regarding
          <strong>${applicantName}</strong>, who has listed you as a referee in
          support of their application with
          <strong>${companyName}</strong>.
        </p>

        <p class="message">
          Your professional insight would be highly valued in helping us assess
          the applicant's suitability. The reference form is brief and should
          take approximately <strong>5-10 minutes</strong> to complete.
        </p>

        <div style="text-align: center">
          <a href="${formLink}" class="button" target="_blank">
            Fill Reference Form
          </a>
        </div>

        <div class="info-box">
          <strong>Please note:</strong><br />
          • The form is secure and confidential<br />
        </div>

        <p class="message">
          If you have any questions or require additional information, please
          don't hesitate to reach out to us directly.
        </p>

        <p class="message">Thank you very much for your time and support.</p>

        <p style="margin-top: 35px">Best regards,</p>
        <p style="font-weight: 600; color: #1f2937">
          ${yourFullName}<br />
          ${yourPosition}<br />
          ${yourPhone ? yourPhone + "<br />" : ""} ${yourEmail}
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          This is an automated reference request from
          <strong>${companyName}</strong>.
        </p>
        <p>If you believe this email was sent in error, please ignore it.</p>
      </div>
    </div>
  </body>
</html>
`;
}

export function createReferenceEmailText({
  refereeName = "Valued Referee",
  applicantName,
  companyName = "Arise Nursing Agency",
  formLink,
  yourFullName,
  yourPosition = "Recruitment Team",
  yourPhone = "03301335287",
  yourEmail = "info@developer.cribe.org",
}) {
  return `
Dear ${refereeName},

I hope this message finds you well.

We are writing on behalf of ${companyName} regarding ${applicantName}, who has listed you as a referee 
in support of their application with ${companyName}.

Your professional insight would be highly valued in helping us assess the applicant's suitability. 
The reference form is brief and should take approximately 5-10 minutes to complete.

Please click the link below to fill the reference form:
${formLink}

Please note:
• The form is secure and confidential.

If you have any questions or require additional information, feel free to reach out to us directly.

Thank you very much for your time and support.

Best regards,
${yourFullName}
${yourPosition}
${yourPhone ? yourPhone + "\n" : ""}${yourEmail}

---
This is an automated reference request from ${companyName}.
If you believe this email was sent in error, please ignore it.
  `.trim();
}
