import db from "../../../../models/index.js";
export const resetPasswordTemplate = async ({ title, name, content }) => {
  let siteLogo = "";
  try {
    const response = await db.SiteDetails.findAll();
    siteLogo = JSON.parse(response[0].site_logo)[0];
  } catch (error) {
    console.error("Error fetching site details:", error);
  }

  console.log({ siteLogo });
  return `
    <!DOCTYPE html>
<html>

<body style="margin:0; padding:0; background-color:#f2f4f7; font-family: Arial, Helvetica, sans-serif;">

  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f4f7; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:6px; padding:40px;">
          
          <!-- Logo -->
          <tr style="width:100%;>
            <td align="center" style=" width:100%; text-align:center;">
              <img src=${siteLogo.img_url} alt="${siteLogo.name || "Cribe Logo"}"
                    width="120"
                    style="display:block; border:0; margin:0 auto;" />
              </td>
          </tr>
          <tr style="width:100%;>
            <td style=" text-align:center; width:100%; padding-bottom:30px; >
                              <h1 style=" text-align:center; margin:0; font-size:32px; font-weight:600;">
                <span style="color:#1da1f2;">Arise</span><span style="color:#333333;">Nursing</span>
              </h1>
            </td>
          </tr>
  <tr style="width:100%;">
                <td style="width:100%;">
                  <h1 style="font-size:22px;color:#111827;">
                    ${title || "Notification"}
                  </h1>
                </td>
              </tr> 
              
              <!-- Divider -->
          <tr style="width:100%;">
            <td style="border-bottom:1px solid #e0e0e0; padding-bottom:20px;"></td>
          </tr>



          <!-- Greeting -->
          <tr style="width:100%;">
            <td style="padding-top:25px; color:#555555; font-size:16px; padding-bottom:20px;">
              Hi ${name || "User"},
            </td>
          </tr>

          <!-- Notification Text -->
         
          ${content ? content.map((item) => ` <tr style="width:100%;"> <td style="color:#555555; font-size:16px; padding-bottom:20px;">${item}</td></tr>`) : ""}
         
        </table>

        <!-- Bottom Footer -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="text-align:center; padding-top:30px;">
          <tr>
            <td style="font-size:12px; color:#999999; line-height:1.6;">
              
              <a href="#" style="color:#999999; text-decoration:underline;">PRIVACY POLICY</a> |
              <a href="#" style="color:#999999; text-decoration:underline;">TERMS OF SERVICE</a> |
              <a href="#" style="color:#999999; text-decoration:underline;">AFFILIATE</a> |
              <a href="#" style="color:#999999; text-decoration:underline;">SUPPORT</a>
              <br><br>

              This email was sent by Ionicware.<br>
              If you do not wish to receive any further emails from us, please 
              <a href="#" style="color:#1a73e8;">unsubscribe</a>.
              <br><br>

              © 2026 Ionicware. | PO Box 1290, Flat Rock NC 28731-1290 USA

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
