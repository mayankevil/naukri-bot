import aiosmtplib
from email.message import EmailMessage

async def send_email(to_email, subject, body):
    message = EmailMessage()
    message["From"] = "naukribot@yourdomain.com"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",  # Or use AWS SES/Outlook etc.
        port=587,
        start_tls=True,
        username="your_email@gmail.com",
        password="your_app_password"
    )
