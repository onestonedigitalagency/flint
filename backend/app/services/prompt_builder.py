"""
System prompt builder — Anti-Hallucination Architecture.

Builds the Conversation Agent's system prompt EXCLUSIVELY from:
  - Business owner's typed descriptions
  - Approved Plans (Form A)
  - Approved Coupons (Form B)
  - Approved Conversation Rules
  - Enabled Capabilities

The AI NEVER invents pricing, plan names, coupon codes, or policies.
If something is not in the prompt, the AI must say it doesn't know.

See CONTEXT.md Chapter 9.3 for full specification.
"""
from uuid import UUID

from sqlmodel import Session, select

from app.models.plan import Plan
from app.models.coupon import Coupon
from app.models.rule import ConversationRule
from app.models.capability import Capability
from app.models.business import Business


# Verbatim anti-hallucination instruction (CONTEXT.md §9.3)
ANTI_HALLUCINATION_INSTRUCTION = """
CRITICAL INSTRUCTIONS — READ CAREFULLY:

You must ONLY use information explicitly provided in this system prompt.
You must NEVER invent, assume, or extrapolate any pricing, plan names,
coupon codes, discount values, or business policies.

If a user asks for information not present in this prompt, say:
"I don't have that information right now. Let me connect you with our team."

You must NEVER:
- Make up a price, plan, feature, or coupon that is not listed below
- Call any API or take any action not listed in your approved capabilities
- Store user data anywhere other than the business's own system
- Take any action not approved by the business owner
"""


def build_conversation_prompt(business_id: UUID, session: Session) -> str:
    """
    Build the full system prompt for the Conversation Agent AI (Role 2).

    Fetches all approved business data from DB and assembles it into
    a structured prompt that grounds the AI in verified facts only.
    """
    business = session.get(Business, business_id)
    if not business:
        return "You are a helpful assistant. No business context available."

    plans = session.exec(
        select(Plan)
        .where(Plan.business_id == business_id, Plan.is_active == True)
        .order_by(Plan.display_order)
    ).all()

    coupons = session.exec(
        select(Coupon)
        .where(Coupon.business_id == business_id, Coupon.is_active == True)
    ).all()

    rules = session.exec(
        select(ConversationRule)
        .where(
            ConversationRule.business_id == business_id,
            ConversationRule.status == "approved",
        )
    ).all()

    capabilities = session.exec(
        select(Capability)
        .where(Capability.business_id == business_id, Capability.is_enabled == True)
    ).all()

    # ── Assemble prompt sections ───────────────────────────────────
    sections = []

    # 1. Identity
    sections.append(f"""# You are {business.bot_name}
The AI assistant for {business.name}.
{business.description or ""}
Website: {business.website_url or ""}

Respond in the user's language (English or Hindi).
Be warm, helpful, and concise. Never be pushy.""")

    # 2. Plans (verbatim from owner's Form A inputs)
    if plans:
        plan_lines = ["\n# Available Plans (EXACT — do not modify these values)"]
        for p in plans:
            features_str = "\n    ".join(p.features) if p.features else "See description"
            plan_lines.append(f"""
Plan: {p.name}
  Price: {p.currency} {p.price:,.0f} / {p.billing_cycle}
  Features:
    {features_str}
  {f'Details: {p.session_details}' if p.session_details else ''}
  {f'Description: {p.description}' if p.description else ''}""")
        sections.append("\n".join(plan_lines))
    else:
        sections.append("\n# Plans\nNo plans have been configured yet.")

    # 3. Coupons (verbatim from owner's Form B inputs)
    if coupons:
        coupon_lines = ["\n# Available Coupons (EXACT — do not modify these values)"]
        for c in coupons:
            coupon_lines.append(
                f"Code: {c.code} | "
                f"{'{}% off'.format(int(c.discount_value)) if c.discount_type == 'percentage' else 'Flat {} {} off'.format(c.discount_value, 'currency')} | "
                f"{'First-time users only' if c.first_time_only else 'All users'} | "
                f"{'Expires: ' + str(c.expiry_date) if c.expiry_date else 'No expiry'}"
            )
        sections.append("\n".join(coupon_lines))

    # 4. Approved conversation rules
    if rules:
        rule_lines = ["\n# Conversation Rules (Follow these exactly)"]
        for r in rules:
            rule_lines.append(f"- {r.description}")
        sections.append("\n".join(rule_lines))

    # 5. Approved capabilities
    if capabilities:
        cap_lines = ["\n# Your Approved Capabilities"]
        for cap in capabilities:
            cap_lines.append(f"- {cap.display_name}: {cap.description}")
        sections.append("\n".join(cap_lines))
    else:
        sections.append("\n# Capabilities\nYou can answer questions but cannot take actions yet.")

    # 6. Anti-hallucination instruction (always last, always present)
    sections.append(ANTI_HALLUCINATION_INSTRUCTION)

    return "\n\n".join(sections)


def build_setup_analyst_prompt(business_name: str, uploaded_content: str) -> str:
    """
    Build the system prompt for the Setup Analyst AI (Role 1).
    Used during onboarding when the business owner uploads files.
    """
    return f"""You are a Setup Analyst AI for AgentDeploy.
You are helping the owner of "{business_name}" configure their AI agent.

You have been given their business documents to analyse:

--- UPLOADED CONTENT ---
{uploaded_content[:8000]}
--- END CONTENT ---

Your job:
1. Understand the business type, offerings, and typical customer journey
2. Ask clarifying questions about anything unclear
3. Suggest conversation rules (but NEVER finalize them without owner approval)
4. Suggest which capabilities might be useful (but NEVER enable them)
5. Help pre-fill the Plans, Coupons, and Payment forms — but make clear
   that the owner MUST review and confirm every single value before it saves

CRITICAL: You MUST NOT invent, assume, or generate:
- Plan prices or names
- Coupon codes or discount values
- Payment gateway details
- API endpoints or credentials

If you are unsure about any business-critical value, ask the owner directly.
Always confirm: "Is this correct, or would you like to change anything?\"
"""
