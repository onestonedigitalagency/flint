"""
Transactional email service using Resend.

Sends:
  - OTP emails for password reset
  - Email verification links
  - Welcome emails on successful signup

Falls back to console logging in development if RESEND_API_KEY is not set.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def _get_resend_client():
    """Lazily import resend and configure."""
    try:
        import resend
        from app.core.config import settings
        resend.api_key = settings.RESEND_API_KEY
        return resend
    except ImportError:
        return None


async def send_otp_email(email: str, otp: str, full_name: Optional[str] = None) -> bool:
    """
    Send a 6-digit OTP for password reset.
    Returns True on success, False on failure.
    """
    from app.core.config import settings

    name = full_name or "there"
    subject = "Your AgentDeploy Password Reset Code"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a1a2e;">Password Reset Code</h2>
      <p>Hi {name},</p>
      <p>Your one-time password reset code is:</p>
      <div style="background: #f0f4ff; border-radius: 8px; padding: 24px;
                  text-align: center; font-size: 36px; font-weight: bold;
                  letter-spacing: 8px; color: #1a1a2e; margin: 24px 0;">
        {otp}
      </div>
      <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="color: #666;">If you did not request this, ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999;">AgentDeploy — AI Agents for your business</p>
    </div>
    """

    if not settings.RESEND_API_KEY:
        logger.info(f"[DEV EMAIL] OTP for {email}: {otp}")
        return True

    resend = _get_resend_client()
    if not resend:
        logger.warning("Resend package not installed. OTP: %s", otp)
        return False

    try:
        resend.Emails.send({
            "from": f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>",
            "to": [email],
            "subject": subject,
            "html": html_body,
        })
        return True
    except Exception as exc:
        logger.error("Failed to send OTP email to %s: %s", email, exc)
        return False


async def send_verification_email(email: str, token: str, full_name: Optional[str] = None) -> bool:
    """Send an email verification link."""
    from app.core.config import settings

    name = full_name or "there"
    verify_url = f"https://agentdeploy.io/verify-email?token={token}"
    subject = "Verify your AgentDeploy email"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a1a2e;">Verify your email</h2>
      <p>Hi {name},</p>
      <p>Click the button below to verify your email address:</p>
      <a href="{verify_url}"
         style="display: inline-block; background: #4f46e5; color: white;
                padding: 12px 28px; border-radius: 8px; text-decoration: none;
                font-weight: bold; margin: 16px 0;">
        Verify Email
      </a>
      <p style="color: #666;">This link expires in <strong>24 hours</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999;">AgentDeploy — AI Agents for your business</p>
    </div>
    """

    if not settings.RESEND_API_KEY:
        logger.info(f"[DEV EMAIL] Verify link for {email}: {verify_url}")
        return True

    resend = _get_resend_client()
    if not resend:
        return False

    try:
        resend.Emails.send({
            "from": f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>",
            "to": [email],
            "subject": subject,
            "html": html_body,
        })
        return True
    except Exception as exc:
        logger.error("Failed to send verification email to %s: %s", email, exc)
        return False


async def send_welcome_email(email: str, full_name: Optional[str] = None) -> bool:
    """Send a welcome email after business owner signup."""
    from app.core.config import settings

    name = full_name or "there"
    subject = "Welcome to AgentDeploy 🎉"
    html_body = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a1a2e;">Welcome to AgentDeploy, {name}!</h2>
      <p>Your account is ready. Let's deploy your first AI agent.</p>
      <a href="https://agentdeploy.io/dashboard"
         style="display: inline-block; background: #4f46e5; color: white;
                padding: 12px 28px; border-radius: 8px; text-decoration: none;
                font-weight: bold; margin: 16px 0;">
        Go to Dashboard
      </a>
      <p style="color: #666;">Your AI agent will be live in minutes, not months.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #999;">AgentDeploy — AI Agents for your business</p>
    </div>
    """

    if not settings.RESEND_API_KEY:
        logger.info(f"[DEV EMAIL] Welcome email for {email}")
        return True

    resend = _get_resend_client()
    if not resend:
        return False

    try:
        resend.Emails.send({
            "from": f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>",
            "to": [email],
            "subject": subject,
            "html": html_body,
        })
        return True
    except Exception as exc:
        logger.error("Failed to send welcome email to %s: %s", email, exc)
        return False
