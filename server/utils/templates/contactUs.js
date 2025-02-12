function contactUsMessage(
  username,
  userEmail,
  userMessage,
  supportEmail = "support@example.com"
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Inquiry</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #121212;
          margin: 0;
          padding: 0;
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #1e1e1e;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #28a745;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
        }
        .content p {
          line-height: 1.6;
          font-size: 16px;
          color: #e0e0e0;
        }
        .message-box {
          background-color: #333;
          padding: 15px;
          border-radius: 5px;
          font-size: 14px;
          color: #ddd;
        }
        .reply-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #28a745;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .reply-button:hover {
          background-color: #218838;
        }
        .footer {
          background-color: #252525;
          text-align: center;
          padding: 10px 20px;
          font-size: 12px;
          color: #bbbbbb;
        }
        .footer a {
          color: #28a745;
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
          <h1>New Contact Inquiry from ${username}</h1>
        </div>
        <div class="content">
          <p><strong>User Email:</strong> <a href="mailto:${userEmail}" style="color: #28a745;">${userEmail}</a></p>
          <p><strong>Message:</strong></p>
          <div class="message-box">
            <p>${userMessage}</p>
          </div>
          <p>Click below to reply to the user:</p>
          <a href="mailto:${userEmail}" class="reply-button">Reply to ${username}</a>
        </div>
        <div class="footer">
          <p>Need further assistance? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
          <p>Thank you for reaching out!</p>
        </div>
      </div>
    </body>
    </html>
    `;
}

function contactUsUserMessage(username, supportEmail = "support@example.com") {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We Received Your Inquiry</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #121212;
          margin: 0;
          padding: 0;
          color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #1e1e1e;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #28a745;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content p {
          line-height: 1.6;
          font-size: 16px;
          color: #e0e0e0;
        }
        .footer {
          background-color: #252525;
          text-align: center;
          padding: 10px 20px;
          font-size: 12px;
          color: #bbbbbb;
        }
        .footer a {
          color: #28a745;
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
          <h1>Hello, ${username}!</h1>
        </div>
        <div class="content">
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p>Thank you for reaching out to us!</p>
          <p>If you have any urgent queries, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>Need further assistance? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
          <p>Best Regards,<br>Your Gym Team</p>
        </div>
      </div>
    </body>
    </html>
    `;
}

export { contactUsMessage, contactUsUserMessage };
