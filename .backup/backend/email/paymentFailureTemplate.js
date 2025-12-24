function buildPaymentFailedEmail({ CUSTOMER_NAME, COURSE_TITLE, AMOUNT, ORDER_ID }) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f6fb;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;color:#111;box-shadow:0 6px 20px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#b91c1c;padding:22px 28px;color:#fff;font-size:16px;font-weight:600;">
              Payment Failed – Action Required
            </td>
          </tr>

          <tr>
            <td style="padding:28px;">

              <h1 style="font-size:22px;margin:0 0 14px;color:#b91c1c;font-weight:700;">
                Dear ${CUSTOMER_NAME},
              </h1>

              <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:16px;">
                We attempted to process your payment for the course 
                <strong>${COURSE_TITLE}</strong>, but unfortunately the transaction did not complete.
              </p>

              <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:18px;">
                This could happen due to server timeout, interrupted session, insufficient balance, or bank authorization failure.
              </p>

              <table width="100%" style="border:1px solid #f2dede;border-radius:8px;margin:20px 0;">
                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Course</td>
                  <td align="right" style="padding:12px;font-size:14px;font-weight:600;color:#222;">${COURSE_TITLE}</td>
                </tr>
                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Amount Attempted</td>
                  <td align="right" style="padding:12px;font-size:14px;font-weight:600;color:#222;">₹${AMOUNT}</td>
                </tr>
                <tr>
                  <td style="padding:12px;font-size:14px;color:#444;">Order ID</td>
                  <td align="right" style="padding:12px;font-size:14px;color:#222;">${ORDER_ID}</td>
                </tr>
              </table>

              <p style="color:#444;font-size:14px;line-height:1.7;margin-bottom:16px;">
                You can retry the payment using the link below. Your learning progress will not start until the transaction is completed.
              </p>

              <div style="text-align:center;margin:24px 0;">
                <a href="https://prodemyx.com/cart"
                  style="background:#dc2626;color:#fff;padding:14px 38px;border-radius:10px;
                  font-weight:700;text-decoration:none;box-shadow:4px 4px 0 #7f1d1d;
                  font-size:16px;display:inline-block;">
                  Retry Payment
                </a>
              </div>

              <p style="color:#444;font-size:14px;line-height:1.7;margin-top:16px;">
                If money was deducted from your bank account, it will be automatically refunded by the payment gateway within 5–7 business days.
              </p>

              <p style="color:#444;font-size:14px;line-height:1.7;margin-top:16px;">
                If you continue facing issues, feel free to reach out to our support team.
              </p>

              <p style="color:#111;font-size:14px;font-weight:600;margin:20px 0 4px;">
                Regards,
              </p>
              <p style="color:#111;font-size:14px;margin:0;">
                Team ProdemyX
              </p>

            </td>
          </tr>

          <tr>
            <td style="background:#f6f8fb;padding:16px;color:#6b7280;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} ProdemyX. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  `;
}

module.exports =  buildPaymentFailedEmail ;
