function welcomeMessage(
  username,
  ctaUrl,
  supportEmail = "support@example.com"
) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Service</title>
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
        <h1>Welcome, ${username}!</h1>
      </div>
      <div class="content">
        <p>We're thrilled to have you onboard! Explore the amazing features and benefits of our service.</p>
        <p>Click the button below to get started:</p>
        <a href="${ctaUrl}" class="cta-button">Get Started</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      </div>
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
        <p>Thank you for joining us!</p>
      </div>
    </div>
  </body>
  </html>
    `;
}

export default welcomeMessage;
