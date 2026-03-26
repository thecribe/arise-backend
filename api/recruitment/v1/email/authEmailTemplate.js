export const authEmailTemplate = ({ name, authLink }) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="max-width:600px;background:#ffffff;border-radius:10px;padding:40px 30px;">
              
              <!-- LOGO -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <img 
                    src="https://developer.cribe.org/static/logo.png"
                    alt="Cribe Logo"
                    width="120"
                    style="display:block;border:0;"
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <h1 style="font-size:22px;color:#111827;">
                    Sign in to your account
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="font-size:16px;color:#4b5563;line-height:1.6;">
                  <p>Hello ${name || "User"},</p>
                  <p>
                    Click below to securely log in. This link expires in 15 minutes.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:25px 0;">
                  <a href="${authLink}"
                     style="display:inline-block;padding:14px 28px;
                     background:#111827;color:#ffffff;
                     text-decoration:none;border-radius:6px;
                     font-weight:bold;">
                     Login Now
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
