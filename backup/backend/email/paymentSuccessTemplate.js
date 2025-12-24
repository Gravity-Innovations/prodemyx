function buildPaymentSuccessEmail({
  CUSTOMER_NAME,
  CUSTOMER_EMAIL,
  TEMP_PASSWORD,
  COURSE_TITLE,
  AMOUNT,
  ORDER_ID
}) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background:#f4f6fb;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
          style="background:#ffffff;border-radius:12px;overflow:hidden;
          color:#111;box-shadow:0 6px 20px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#059669;padding:22px 28px;color:#fff;
              font-size:20px;font-weight:700;">
              Payment Successful – Course Access Granted
            </td>
          </tr>

          <tr>
            <td style="padding:30px;">

              <h1 style="font-size:22px;margin:0 0 14px;color:#059669;font-weight:700;">
                Hello ${CUSTOMER_NAME},
              </h1>

              <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:20px;">
                Your access to <strong>${COURSE_TITLE}</strong> is now activated.
              </p>

              ${TEMP_PASSWORD ? `
                <div style="background:#ecfdf5;border:1px solid #a7f3d0;padding:20px;
                  border-radius:10px;margin-bottom:25px;">
                  <h3 style="margin:0 0 10px;font-size:18px;color:#047857;">
                    Your ProdemyX Account Has Been Created
                  </h3>
                  <p style="margin:0;color:#444;font-size:15px;line-height:1.6;">
                    <strong>Email:</strong> ${CUSTOMER_EMAIL}<br/>
                    <strong>Temporary Password:</strong> ${TEMP_PASSWORD}
                  </p>
                </div>
              ` : ""}

              <table width="100%" 
                style="border:1px solid #e5e7eb;border-radius:10px;margin:20px 0;">
                
                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Course</td>
                  <td align="right"
                    style="padding:12px;font-size:14px;font-weight:600;color:#111;">
                    ${COURSE_TITLE}
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Amount Paid</td>
                  <td align="right"
                    style="padding:12px;font-size:14px;font-weight:600;color:#111;">
                    ₹${AMOUNT}
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Order ID</td>
                  <td align="right"
                    style="padding:12px;font-size:14px;color:#111;">
                    ${ORDER_ID}
                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  `;
}

module.exports = buildPaymentSuccessEmail;
