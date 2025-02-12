function otpMail(username, otp, supportEmail = "support@example.com") {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content p {
        line-height: 1.6;
        font-size: 16px;
      }
      .otp-code {
        font-size: 28px;
        color: #007bff;
        margin: 20px 0;
        font-weight: bold;
        letter-spacing: 4px;
      }
      .cta-button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      .cta-button:hover {
        background-color: #0056b3;
      }
      .footer {
        background-color: #f8f9fa;
        text-align: center;
        padding: 10px 20px;
        font-size: 12px;
        color: #6c757d;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your OTP Code</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${username}</strong>,</p>
        <p>Use the following OTP to complete your action. This code is valid for 10 minutes:</p>
        <div class="otp-code">${otp}</div>
        <a href="#" class="cta-button">Verify Now</a>
        <p>If you didn’t request this, please ignore this email or contact our support team.</p>
      </div>
      <div class="footer">
        <p>If you need help, reach us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
      </div>
    </div>
  </body>
  </html>
    `;
}

export default otpMail;
