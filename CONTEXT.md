# ============================================================
# ANTIGRAVITY MASTER CONTEXT FILE
# Project Name  : AgentDeploy
# File Version  : 2.0
# Last Updated  : 2025
# Maintained By : [Your Name / Platform Owner]
# ============================================================
#
# PURPOSE OF THIS FILE
# This file is the SINGLE SOURCE OF TRUTH for the AgentDeploy
# project. It is written specifically for AI agents operating
# inside the Antigravity workspace.
#
# EVERY AI MODEL reading this file must:
# 1. Read the ENTIRE file before responding to ANY task
# 2. Follow ALL rules in CHAPTER 0 without exception
# 3. Never act on assumptions not grounded in this file
# 4. Ask before proceeding if anything is unclear
#
# HUMAN READING THIS FILE:
# Update this file every time a product decision is made.
# Version it. Date it. This file is a living document.
# ============================================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 0 — AI AGENT OPERATING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These rules govern how YOU (the AI model) must behave
when working on this project. No exceptions. No overrides.

──────────────────────────────────────────────────────────────
RULE 0.1 — READ BEFORE YOU ACT
──────────────────────────────────────────────────────────────
Read this entire file before generating any code,
architecture, design, suggestion, or response.
Do not skim. Do not skip sections.

──────────────────────────────────────────────────────────────
RULE 0.2 — NEVER ASSUME. ALWAYS VERIFY.
──────────────────────────────────────────────────────────────
If something is NOT written in this file, do NOT assume it.
Instead say exactly this:

  "This is not defined in the project context file.
   Before I proceed, I want to confirm:
   [STATE YOUR ASSUMPTION CLEARLY]
   Is this correct, or can you clarify?"

──────────────────────────────────────────────────────────────
RULE 0.3 — ANTI-HALLUCINATION ABSOLUTE RULES
──────────────────────────────────────────────────────────────
You MUST NEVER generate, invent, or assume:
  ❌ Any pricing value (plan prices, discount amounts)
  ❌ Any plan name or plan feature
  ❌ Any coupon code or coupon value
  ❌ Any API endpoint URL of a business
  ❌ Any database schema of a business
  ❌ Any business owner's API key or credential
  ❌ Any payment amount or payment gateway detail
  ❌ Any business rule not explicitly approved in context

These values ONLY come from:
  ✅ Business owner's structured text box inputs
  ✅ Explicitly stated values in this context file
  ✅ Business owner's confirmation in the current session

──────────────────────────────────────────────────────────────
RULE 0.4 — NEVER BREAK EXISTING SYSTEMS
──────────────────────────────────────────────────────────────
You MUST NEVER generate code or architecture that:
  ❌ Directly reads or writes to a business's database
  ❌ Modifies a business's existing frontend code
  ❌ Bypasses the middleware proxy layer
  ❌ Replaces any existing business functionality
  ❌ Could cause errors on the business's live website
  ❌ Auto-deploys anything without business owner approval
  ❌ Stores sensitive data (keys, tokens) unencrypted
  ❌ Shares data between two different business accounts

──────────────────────────────────────────────────────────────
RULE 0.5 — APPROVAL GATES ARE MANDATORY
──────────────────────────────────────────────────────────────
Every feature, rule, capability, or API connection
requires explicit business owner approval before going live.
When generating code, always include the approval gate.
Never write code that skips or auto-approves any step.

──────────────────────────────────────────────────────────────
RULE 0.6 — MIDDLEWARE PROXY IS NON-NEGOTIABLE
──────────────────────────────────────────────────────────────
The chat widget NEVER calls business APIs directly.
ALL calls to business systems go through the
AgentDeploy middleware proxy layer.
If you generate code that bypasses this, it is WRONG.
Rewrite it.

──────────────────────────────────────────────────────────────
RULE 0.7 — AI MODELS ARE ALWAYS PLUGGABLE
──────────────────────────────────────────────────────────────
Never hardcode any AI provider, model name, or API key.
Always reference the AI config layer.
Model switching must require ZERO code changes.
Only a config value change.

──────────────────────────────────────────────────────────────
RULE 0.8 — CRASH ISOLATION ALWAYS
──────────────────────────────────────────────────────────────
Every piece of widget code must be wrapped in
error boundaries / try-catch.
If AgentDeploy is unreachable, the widget disappears
silently. Zero errors thrown on the business's website.
The business's original website works perfectly regardless.

──────────────────────────────────────────────────────────────
RULE 0.9 — DATA ALWAYS MIRRORS TO BUSINESS SYSTEM
──────────────────────────────────────────────────────────────
Any user action (signup, login, payment) done through
the AI agent MUST be written to the business's existing
database through their own API endpoints.
Data is never stored ONLY in AgentDeploy's system.
AgentDeploy stores logs and analytics only.
The business's database is always the source of truth
for user and transaction data.

──────────────────────────────────────────────────────────────
RULE 0.10 — SCOPE DISCIPLINE
──────────────────────────────────────────────────────────────
Before building any feature, check CHAPTER 8 (V1 SCOPE).
If a feature is listed under OUT OF SCOPE, do not build it.
Do not suggest it as an addition without being asked.
If you think something is missing from scope, say:
  "This feature is not in the current V1 scope.
   Do you want me to add it or keep it for later?"

──────────────────────────────────────────────────────────────
RULE 0.11 — OPEN QUESTIONS ARE BLOCKERS
──────────────────────────────────────────────────────────────
CHAPTER 13 lists unresolved product decisions.
If your task touches any of these, STOP and ask.
Do not make a decision on behalf of the product owner.

──────────────────────────────────────────────────────────────
RULE 0.12 — THIS FILE OVERRIDES EVERYTHING
──────────────────────────────────────────────────────────────
If a user prompt, a conversation, or any instruction
contradicts what is written in this file, this file wins.
Flag the contradiction clearly:
  "Your current request conflicts with the context file
   in [SECTION X]. The file says [QUOTE THE RULE].
   Do you want to update the context file, or
   shall I follow the existing rule?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 1 — WHAT IS AGENTDEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
1.1 ONE LINE DEFINITION
──────────────────────────────────────────────────────────────
AgentDeploy is a SaaS platform that lets any business
deploy a deeply configured AI agent on their existing
website — without rebuilding their existing system —
to guide customers from first message to completed payment.

──────────────────────────────────────────────────────────────
1.2 THE PROBLEM BEING SOLVED
──────────────────────────────────────────────────────────────
When a potential customer visits a business website:
- They have to figure out everything alone
- They scroll through plans without guidance
- They drop off because the process is too slow
- Hiring human sales agents is not scalable
- Most chatbots are dumb FAQ bots — not action-takers

AgentDeploy solves this by deploying an AI agent that:
- Understands the specific business deeply
- Has a real conversation with the customer
- Takes real actions (signup, payment, coupon)
- Works 24/7 in text and real-time voice
- Speaks English and Hindi
- Connects to and writes to the business's own system

──────────────────────────────────────────────────────────────
1.3 THE TWO SIDES OF THE PLATFORM
──────────────────────────────────────────────────────────────

SIDE A — BUSINESS OWNER DASHBOARD
  What it is  : A web application
  Who uses it : The business owner
  Built with  : Next.js + React
  Purpose     : Set up, configure, test, monitor the agent
  Access      : Web browser only (no mobile app in v1)
  Accounts    : One account per business (single admin)

SIDE B — END USER CHAT WIDGET
  What it is  : A floating chat widget
  Who uses it : The business's customers
  Built with  : React (web component)
  Purpose     : Customer talks to AI, gets guided to purchase
  Deployed by : One script tag on business's website
  Modes       : Text chat + Real-time voice
  Languages   : English and Hindi

──────────────────────────────────────────────────────────────
1.4 THE SIMPLE MENTAL MODEL
──────────────────────────────────────────────────────────────
Think of a great in-store salesperson who:
  → Greets every customer
  → Listens to their problem
  → Recommends the right product
  → Explains what's included
  → Offers available discounts
  → Helps them complete the purchase
  → Speaks in their language
  → Is available 24 hours a day, 7 days a week
  → Saves all customer info to the store's existing system

AgentDeploy puts that salesperson on any website.

──────────────────────────────────────────────────────────────
1.5 WHAT MAKES THIS DIFFERENT FROM A BASIC CHATBOT
──────────────────────────────────────────────────────────────
Basic chatbot    → Answers FAQs from a script
AgentDeploy      → Understands context, takes real actions

Basic chatbot    → Tells you the price of a plan
AgentDeploy      → Signs you up, applies your coupon,
                   processes your payment, confirms order

Basic chatbot    → Separate from your existing system
AgentDeploy      → Writes directly to your existing database
                   through your own APIs

Basic chatbot    → If it breaks, you may lose users
AgentDeploy      → If it breaks, original site still works
                   perfectly. Widget silently disappears.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 2 — THE PEOPLE IN THIS SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
PERSON TYPE 1: PLATFORM OWNER
──────────────────────────────────────────────────────────────
Who       : The builder of AgentDeploy (you)
Access    : Master access to entire platform
Can do    :
  - See logs and errors across ALL business accounts
  - Push fixes that reflect to ALL businesses at once
  - Set the default AI model in platform config
  - Onboard businesses manually in v1
  - See all analytics across all agents
Cannot do :
  - Access individual user data of any business
    without explicit permission (privacy boundary)

──────────────────────────────────────────────────────────────
PERSON TYPE 2: BUSINESS OWNER
──────────────────────────────────────────────────────────────
Who       : The company/person deploying the agent
Access    : Their own dashboard only
Can do    :
  - Upload business files and data
  - Configure their AI agent
  - Approve or reject every rule and capability
  - Test in sandbox before going live
  - View their own analytics and logs
  - Pause or rollback their agent anytime
  - Provide their own AI model API key
  - Add embed code to their website
Cannot do :
  - See other businesses' data
  - Skip approval gates
  - Deploy without testing in sandbox
  - Change pricing/plans through AI (must use text forms)
  
Note      : One account per business. No team members in v1.

──────────────────────────────────────────────────────────────
PERSON TYPE 3: END USER
──────────────────────────────────────────────────────────────
Who       : The business's customer visiting their website
Access    : Only the chat widget
Can do    :
  - Talk to the AI agent via text or voice
  - Choose a plan
  - Sign up or log in through the chat
  - Apply coupon codes
  - Make a payment through the chat
  - Switch between English and Hindi
Cannot do :
  - Access the dashboard
  - Change any business configuration
  - See other users' data
  
Important : End user data is ALWAYS saved to the
            business's own existing database.
            AgentDeploy does not own this data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 3 — NON-NEGOTIABLE CORE PRINCIPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These principles are the foundation of every decision.
Every line of code must respect all of these.

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 1: NON-DESTRUCTIVE INTEGRATION                │
│                                                         │
│ The AI agent is an ADDITION to the business system.     │
│ It never replaces, modifies, or risks breaking the      │
│ existing website, database, API, or any feature.        │
│                                                         │
│ IF AgentDeploy goes down:                               │
│   → Business website works perfectly                    │
│   → Widget silently disappears                          │
│   → Zero errors thrown on the business page             │
│   → All original features continue functioning          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 2: ANTI-HALLUCINATION BY DESIGN               │
│                                                         │
│ Critical business data is NEVER generated by AI.        │
│                                                         │
│ The following MUST come from business owner text inputs: │
│   → Plan names                                          │
│   → Plan prices                                         │
│   → Billing cycles                                      │
│   → Plan features list                                  │
│   → Coupon codes (exact strings)                        │
│   → Discount values                                     │
│   → Payment gateway details                             │
│   → Payment endpoint URLs                               │
│   → Payment amounts                                     │
│                                                         │
│ AI reads and uses this data.                            │
│ AI does NOT create, modify, or assume this data.        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 3: CRASH ISOLATION                            │
│                                                         │
│ The widget embed script is wrapped in try-catch.        │
│ Widget failure = zero impact on business website.       │
│ AI agent never modifies business frontend code.         │
│ AI agent only calls APIs — never writes to DB directly. │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 4: APPROVAL BEFORE EVERY ACTION               │
│                                                         │
│ AI can: suggest, analyze, propose, generate drafts.     │
│ AI cannot: finalize, deploy, or go live without         │
│ explicit business owner approval.                       │
│                                                         │
│ This applies to:                                        │
│   → Every conversation rule                             │
│   → Every agentic capability                            │
│   → Every new feature                                   │
│   → Every API connection                                │
│   → Going live on production                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 5: EXISTING DATA INTEGRITY                    │
│                                                         │
│ User actions through the AI agent must be reflected     │
│ in the business's existing database EXACTLY as if       │
│ the user had used the original website.                 │
│                                                         │
│ Data flow:                                              │
│   Widget → Proxy → Business API → Business Database     │
│                                                         │
│ AgentDeploy stores: logs, analytics, session data only  │
│ Business database stores: users, transactions, plans    │
│ Business database is ALWAYS the source of truth         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 6: PLUGGABLE AI MODELS                        │
│                                                         │
│ AI provider is NEVER hardcoded anywhere.                │
│ All AI calls reference a config object only.            │
│                                                         │
│ Config structure:                                       │
│   provider      : "anthropic" | "google" | "openai"    │
│   model         : model name string                     │
│   api_key_source: "platform" | "business_owner"        │
│   fallback      : secondary provider config             │
│                                                         │
│ Switching model = change config value only.             │
│ Zero code changes required to switch AI providers.      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 7: MIDDLEWARE PROXY IS MANDATORY              │
│                                                         │
│ Widget → AgentDeploy Backend → Proxy → Business API     │
│                                                         │
│ The widget NEVER talks to business APIs directly.       │
│ ALL business API calls go through the proxy layer.      │
│                                                         │
│ The proxy provides:                                     │
│   → Pre-call logging                                    │
│   → Input validation                                    │
│   → Post-call logging                                   │
│   → Error handling and alerting                         │
│   → Complete isolation per business                     │
│   → Ability to pause/rollback without touching          │
│     the business's code                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRINCIPLE 8: NEW FEATURES NEVER BREAK OLD FEATURES      │
│                                                         │
│ Any new feature set up through AgentDeploy must:        │
│   → Be tested in sandbox before going live              │
│   → Be connected to the existing system properly        │
│   → Work independently of the AI agent                  │
│   → Not affect any existing functionality               │
│   → Have business owner approval at every step          │
│                                                         │
│ The original system works with OR without the           │
│ new feature. New features are additive only.            │
└─────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 4 — SYSTEM ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
4.1 FULL SYSTEM ARCHITECTURE DIAGRAM
──────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│ BUSINESS WEBSITE │
│ (Existing site — AgentDeploy does NOT modify this) │
│ │
│ <script src="agentdeploy.io/widget.js" │
│ data-agent-id="biz_abc123"> │
│ </script> │
│ │ │
│ [Floating Widget Button] │
│ [Chat Panel — React Web Component] │
└───────────────────────────┼─────────────────────────────────┘
│
HTTPS / WebSocket
(Encrypted always)
│
┌───────────────────────────▼─────────────────────────────────┐
│ AGENTDEPLOY BACKEND (FastAPI/Python) │
│ │
│ ┌─────────────────┐ ┌──────────────────────────────────┐ │
│ │ Widget API │ │ Dashboard API │ │
│ │ Endpoints │ │ Endpoints │ │
│ └────────┬─────────┘ └──────────────┬───────────────────┘ │
│ │ │ │
│ ┌────────▼───────────────────────────▼───────────────────┐ │
│ │ AI ORCHESTRATION LAYER │ │
│ │ │ │
│ │ ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐ │ │
│ │ │ Setup │ │ Conversation │ │ New Feature │ │ │
│ │ │ Analyst AI │ │ Agent AI │ │ Architect AI │ │ │
│ │ └──────┬──────┘ └──────┬───────┘ └────────┬────────┘ │ │
│ │ │ │ │ │ │
│ │ ┌──────▼───────────────▼──────────────────▼─────────┐ │ │
│ │ │ AI MODEL CONFIG LAYER │ │ │
│ │ │ provider / model / api_key / fallback │ │ │
│ │ │ Claude 3.5 Sonnet (default primary) │ │ │
│ │ │ Gemini 1.5 Pro (default secondary) │ │ │
│ │ └────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ BUSINESS CONFIG STORE │ │
│ │ (Stored in AgentDeploy's own Supabase database) │ │
│ │ │ │
│ │ Encrypted API Keys Vault │ │
│ │ Approved Rules Store │ │
│ │ Capability Flags Store │ │
│ │ Structured Business Data (plans, coupons, payment) │ │
│ │ Version History (for rollback) │ │
│ │ Logs and Analytics Store │ │
│ └──────────────────────────────────────────────────────┘ │
│ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ MIDDLEWARE / API PROXY LAYER │ │
│ │ │ │
│ │ → Validates all inputs before sending │ │
│ │ → Logs every call BEFORE execution │ │
│ │ → Logs every response AFTER execution │ │
│ │ → Handles errors gracefully │ │
│ │ → Isolates each business completely │ │
│ │ → Never exposes business API keys to widget │ │
│ └────────────────────────┬─────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
│
Verified + Logged API calls only
│
┌───────────────────────────▼─────────────────────────────────┐
│ BUSINESS'S EXISTING SYSTEM │
│ │
│ ┌────────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│ │ Auth Endpoints │ │ Plan/Product │ │ Payment Endpoints│ │
│ │ /login │ │ Endpoints │ │ (existing gateway│ │
│ │ /signup │ │ /plans │ │ or Razorpay) │ │
│ └────────┬───────┘ └──────┬───────┘ └────────┬─────────┘ │
│ │ │ │ │
│ ┌────────▼────────────────▼──────────────────▼──────────┐ │
│ │ BUSINESS'S EXISTING DATABASE │ │
│ │ (Supabase / Firebase / Custom REST) │ │
│ │ THIS IS THE SOURCE OF TRUTH FOR USER DATA │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘


──────────────────────────────────────────────────────────────
4.2 VOICE ARCHITECTURE
──────────────────────────────────────────────────────────────

[User Microphone]
│
│ Raw audio stream
▼
[Widget — WebSocket Client]
│
│ WSS (encrypted WebSocket)
▼
[FastAPI WebSocket Endpoint]
│
├──► [STT Engine]
│ Primary : Deepgram (real-time streaming)
│ Fallback : OpenAI Whisper
│ Languages: en-US, hi-IN
│ Output : Transcribed text
│
├──► [AI Conversation Agent]
│ Input : Transcribed text + conversation history
│ Output : AI response text
│
└──► [TTS Engine]
Primary : ElevenLabs
Fallback : Google Cloud TTS
Languages: en-US, hi-IN
Output : Audio stream back to widget

Latency target : Under 1.5 seconds end-to-end
Failure mode : Auto-switch to text chat silently
Language detect: Auto from first user input
Manual override: EN / HI toggle button in widget



──────────────────────────────────────────────────────────────
4.3 DATABASE COMPATIBILITY — DECISION TREE
──────────────────────────────────────────────────────────────

Business applies to onboard
│
▼
Does business use Supabase?
YES ──► Mode A: Supabase Integration
Business provides:
- Supabase Project URL
- Supabase Anon Key
- Supabase Service Role Key
We use: Supabase Python client
Existing RLS policies: STILL ENFORCED
We never bypass RLS.
│
NO
│
▼
Does business use Firebase?
YES ──► Mode B: Firebase Integration
Business provides:
- Firebase project config JSON
- Firebase service account JSON
We use: Firebase Admin SDK (Python)
Existing Security Rules: STILL ENFORCED
We never bypass Firebase Security Rules.
│
NO
│
▼
Does business have a custom REST API?
YES ──► Mode C: Custom REST API Integration
Business provides:
- Base API URL
- Auth method (Bearer / API Key / Basic)
- API documentation file (uploaded)
We do: AI reads docs, maps endpoints
Business approves each endpoint we can call
Business must whitelist our server IPs
│
NO
│
▼
CANNOT ONBOARD IN V1
Business is shown a clear message:
"We currently support Supabase, Firebase, and
custom REST API backends. Your system type is
not yet supported. Join our waitlist for
future compatibility updates."



──────────────────────────────────────────────────────────────
4.4 EMBED CODE — HOW IT WORKS
──────────────────────────────────────────────────────────────

Business adds ONE line to their website HTML
(before the closing </body> tag):

  <script src="https://agentdeploy.io/widget.js"
          data-agent-id="biz_UNIQUE_ID_HERE">
  </script>

What this does:
  → Loads the AgentDeploy React web component
  → Widget reads agent-id from the data attribute
  → Widget fetches its config from AgentDeploy servers
  → Widget renders floating button on the page
  → Widget communicates ONLY with AgentDeploy servers
  → Widget is sandboxed — cannot access business page DOM
  → If AgentDeploy servers unreachable — widget does
    not appear, zero errors thrown, page works normally

What this does NOT do:
  → Does not modify any existing HTML on the page
  → Does not intercept any existing website requests
  → Does not read any existing page data or cookies
  → Does not connect to business APIs directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 5 — BUSINESS OWNER DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
5.1 TECH STACK FOR DASHBOARD
──────────────────────────────────────────────────────────────
  Framework         : Next.js + React
  Platform database : Supabase (AgentDeploy's own)
  Business owner auth: Supabase Auth
  File storage      : Supabase Storage
  Deployment        : Vercel

──────────────────────────────────────────────────────────────
5.2 DASHBOARD PAGES
──────────────────────────────────────────────────────────────

PAGE 1: HOME / OVERVIEW
  - Agent status pill: LIVE (green) / SANDBOX (yellow) /
    PAUSED (red)
  - Stats cards: Total conversations today, Conversions
    today, Conversion rate, Active users right now
  - Alert banner if errors exist (links to Logs page)
  - Recent conversations table (last 5 sessions)
  - Quick actions: Pause Agent, Go to Sandbox, View Logs

PAGE 2: SETUP WORKSPACE (SANDBOX)
  This is the most complex page.
  See full setup flow in Chapter 6.
  Sub-sections:
  - File upload area
  - AI setup chat interface
  - Progress stepper (7 steps)
  - Structured data forms (plans, coupons, payment)
  - Rules list with approve/reject
  - Capabilities checklist
  - API keys vault

PAGE 3: ANALYTICS
  - Date range picker
  - KPI cards: conversations, conversions, rate,
    avg duration, voice vs text ratio
  - Line chart: conversations + conversions over time
  - Pie chart: plan breakdown (which plans sold most)
  - Bar chart: top user problems mentioned
  - Funnel table: Started → Viewed Plans → Signed Up →
    Payment Started → Payment Completed (with % drop-off)

PAGE 4: LOGS & MONITORING
  - Real-time log feed
  - Filter bar: All / Errors / Warnings / Info + Search
  - Each log entry:
    * Color coded border (red/yellow/blue)
    * Timestamp
    * Type: API_FAILURE | AI_ERROR | PAYMENT_ERROR |
             AUTH_FAILURE | AGENT_CRASH | FEATURE_ERROR
    * Description (human readable)
    * Session ID (clickable → opens session detail)
    * Status: Unresolved 🔴 | Resolved ✅ |
              Platform Fix Applied 🔵
  - Click any log → right panel with full error detail,
    stack trace, API request/response, suggested fix
  NOTE: Platform owner sees ALL businesses' logs
        Business owner sees ONLY their own logs

PAGE 5: VERSION CONTROL & ROLLBACK
  - Full version history of all agent config changes
  - Each version: timestamp, what changed, who changed
  - One-click rollback to any previous version
  - Rollback takes effect within 60 seconds
  - Current version highlighted

PAGE 6: EMBED & INTEGRATION
  - Embed code block (copy button)
  - Instructions: "Add before </body> tag"
  - Integration health check dashboard:
    * Widget Detected: ✅/❌
    * Auth API: ✅/❌
    * Payment API: ✅/❌
    * Database: ✅/❌
    * AI Model: ✅/❌ (shows which model is active)
  - Server IP whitelist (expandable section)

PAGE 7: SETTINGS
  - Business profile (name, URL, category)
  - AI model configuration
  - Notification preferences

──────────────────────────────────────────────────────────────
5.3 STRUCTURED DATA FORMS (ANTI-HALLUCINATION LAYER)
──────────────────────────────────────────────────────────────

CRITICAL: These forms are the ONLY source of truth for
business-critical data. AI reads from these. AI never
generates values for these fields. Business owner types
every value manually.

FORM A — PLANS & PRICING
  (One form per plan. Business owner adds as many as needed)
  Fields:
    Plan Name         : [text input — typed by owner]
    Plan Price        : [number input — typed by owner]
    Currency          : [dropdown — selected by owner]
    Billing Cycle     : [dropdown: monthly/yearly/one-time]
    Features Included : [multi-line text — typed by owner]
    Session Details   : [text input — typed by owner]
    Plan Description  : [text area — typed by owner]

FORM B — COUPON CODES
  (One form per coupon. Owner adds as many as needed)
  Fields:
    Coupon Code      : [text input — exact string, typed]
    Discount Type    : [dropdown: percentage / flat amount]
    Discount Value   : [number input — typed by owner]
    Expiry Date      : [date picker — selected by owner]
    Applicable Plans : [multi-select from plan list]
    Max Uses         : [number input — typed by owner]

FORM C — PAYMENT DETAILS
  Fields:
    Existing Gateway Name    : [text input — typed by owner]
    Existing Payment Endpoint: [text input — typed by owner]
    Existing Payment API Key : [password input — encrypted]
    Use Razorpay as fallback : [toggle]
    If Razorpay ON:
      Razorpay Key ID        : [text input — typed by owner]
      Razorpay Key Secret    : [password input — encrypted]
    Payment amounts in chat  : [text input — typed by owner]

RULE: AI must use ONLY the values from these forms when
      discussing plans, prices, coupons with end users.
      If a value is not in these forms, the AI must say:
      "I don't have that information right now.
       Let me connect you with our team."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 6 — BUSINESS OWNER SETUP FLOW (ONBOARDING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the step-by-step flow when a business owner
sets up their agent for the first time.

──────────────────────────────────────────────────────────────
STEP 1 — ACCOUNT CREATION
──────────────────────────────────────────────────────────────
Fields:
  - Email + Password
  - Business name
  - Business website URL
  - Business category (dropdown)
System action:
  - Creates account in AgentDeploy's Supabase database
  - Sends verification email
  - Business owner must verify before proceeding

──────────────────────────────────────────────────────────────
STEP 2 — COMPATIBILITY CHECK (HARD GATE)
──────────────────────────────────────────────────────────────
System asks business owner:
  "Which platform powers your backend?"
  ○ Supabase
  ○ Firebase
  ○ Custom REST API
  ○ I'm not sure (shown help guide)
  ○ None of these (shown: cannot onboard message)

If none of the above → onboarding stops here with
clear explanation of why and what to do next.

If compatible → proceed with mode-specific key collection
(see Chapter 4.3 for mode details)

──────────────────────────────────────────────────────────────
STEP 3 — BUSINESS DATA UPLOAD
──────────────────────────────────────────────────────────────
Business owner can upload:
  - PDF files (pricing docs, FAQs, plan brochures)
  - Image files (plan comparison charts, screenshots)
  - Text files (any business documentation)
  - OR paste text directly into a large text area

After upload:
  - Setup Analyst AI reads all content
  - AI sends messages in chat interface asking about
    what it found and what it is unsure about
  - Business owner replies to confirm or correct AI
  - AI is NOT extracting pricing to use directly —
    it is building understanding to ask better questions
    and populate the structured forms below

──────────────────────────────────────────────────────────────
STEP 4 — STRUCTURED DATA ENTRY
──────────────────────────────────────────────────────────────
Business owner fills all three structured forms:
  - Form A: Plans & Pricing
  - Form B: Coupon Codes
  - Form C: Payment Details

AI can pre-suggest values based on uploaded documents
BUT business owner must manually confirm every value.
Pre-suggestions are shown as editable fields.
Business owner must click "Confirm" per field.
Nothing is saved until confirmed.

──────────────────────────────────────────────────────────────
STEP 5 — RULE GENERATION + APPROVAL
──────────────────────────────────────────────────────────────
AI generates a list of conversation rules.
Each rule is shown as a card with:
  - Rule description in plain English
  - AI confidence level (High / Medium / Low)
  - Approve toggle
  - Reject toggle
  - Edit inline option

Business owner reviews EVERY rule.
Only approved rules are stored and used by the agent.
Business owner can add custom rules manually.
No rule goes live without explicit approval toggle.

──────────────────────────────────────────────────────────────
STEP 6 — AGENTIC CAPABILITY SELECTION
──────────────────────────────────────────────────────────────
AI presents capabilities it can offer based on
the business's system and approved rules.

Each capability card shows:
  - Capability name + icon
  - What it does (plain English)
  - Enable / Disable toggle
  - If NEW (not in existing system):
    "NEW — Setup Required" badge in yellow
    Clicking this triggers the New Feature Flow
    (see Chapter 7)

Standard capabilities:
  - User Login via chat
  - User Signup via chat
  - Show Plan Cards in chat
  - Apply Coupon Codes
  - Process Payments
  - Send Confirmation (if existing system supports)

Business owner enables ONLY what they want.
Disabled capabilities cannot be triggered by end users.

──────────────────────────────────────────────────────────────
STEP 7 — API KEYS & INTEGRATION
──────────────────────────────────────────────────────────────
System shows a checklist of required API keys/credentials
based on integration mode and selected capabilities.

Business owner inputs each required item.
All keys stored encrypted (AES-256) immediately on input.
System runs a connection test for each:
  ✅ Green tick = connected successfully
  ❌ Red cross = failed (with specific error message)
Business owner must fix all failures before proceeding.

Optional: Business owner provides their own AI model key
  If provided: their key is used
  If not provided: platform default key is used

──────────────────────────────────────────────────────────────
STEP 8 — SANDBOX TESTING
──────────────────────────────────────────────────────────────
Agent is deployed in fully isolated sandbox environment.
Mock/dummy data is used — nothing is written to real DB.

Business owner sees:
  LEFT SIDE : Widget preview (exactly as end user sees it)
  RIGHT SIDE: Action log panel (what agent is doing)

Action log shows in real-time:
  → API call about to be made (endpoint + payload)
  ← Response received (status + body)
  ✅ Action succeeded
  ❌ Action failed (with reason)

Business owner must test all critical flows:
  Greeting → Problem understanding → Plan recommendation →
  Plan card display → Signup → Coupon application →
  Payment initiation → Confirmation

Only when business owner is satisfied:
  "Go Live →" button becomes enabled

──────────────────────────────────────────────────────────────
STEP 9 — GO LIVE
──────────────────────────────────────────────────────────────
Business owner clicks "Go Live"
System shows embed code:

  <script src="https://agentdeploy.io/widget.js"
          data-agent-id="biz_UNIQUE_ID">
  </script>

Business owner copies this and adds to their website.
System pings business website to detect if widget loaded.
Integration health check runs automatically.
Dashboard shows "LIVE" status in green.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 7 — NEW FEATURE SETUP FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When a feature is needed that doesn't exist in
the business's current system:

──────────────────────────────────────────────────────────────
TRIGGER SOURCES
──────────────────────────────────────────────────────────────
  A. Setup Analyst AI detects missing feature during analysis
  B. End user requests a feature the bot cannot fulfill
  C. Business owner manually requests via dashboard

──────────────────────────────────────────────────────────────
FULL NEW FEATURE FLOW
──────────────────────────────────────────────────────────────


Feature identified
│
▼
AI presents proposal to business owner in plain English:
"Your users may want [FEATURE]. This doesn't currently
exist in your system. Would you like to add it?"
│
┌─────┴─────┐
YES NO
│ │
│ Feature rejected. Logged. Done.
▼
AI asks: "Does your backend already support this
via an existing API endpoint?"
│
├── YES ──► Business provides:
│ - Endpoint URL (text input)
│ - API documentation (file upload)
│ → Tested in sandbox
│ → Business owner approves
│ → Goes live
│
└── NO ───► Business owner chooses a path:
│
├── PATH A: "Generate code — my developer
│ will add it to our backend"
│ AI generates:
│ - Exact code snippet to add
│ - Where to add it (file, function)
│ - What endpoint it creates
│ Business developer implements it
│ Business provides new endpoint URL
│ Tested in sandbox
│ Business owner approves
│ Goes live
│
└── PATH B: "Handle it externally —
don't touch our backend"
AI suggests third-party service
(e.g., Mailchimp for email,
Twilio for SMS)
Business owner provides:
- Third-party API keys (text input)
- Required data in structured forms
Tested in sandbox
Business owner approves
Goes live



──────────────────────────────────────────────────────────────
CRITICAL RULES FOR NEW FEATURES
──────────────────────────────────────────────────────────────
  → All required data entered in text boxes by owner
  → AI does not generate values for the feature
  → Feature must be tested in sandbox before live
  → Business owner must explicitly approve before live
  → New feature must not break any existing feature
  → New feature connected to existing system properly
  → Original system works independently of new feature
  → If new feature fails, existing system unaffected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 8 — V1 SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
IN SCOPE FOR V1 — BUILD THESE
──────────────────────────────────────────────────────────────

DASHBOARD:
  ✅ Web-only dashboard (Next.js + React)
  ✅ Single admin account per business
  ✅ File upload + AI analysis (PDF, image, text)
  ✅ Paste text area for business description
  ✅ AI setup conversation interface (chat with AI)
  ✅ Structured forms: plans, coupons, payment
  ✅ AI rule generation with per-rule approve/reject
  ✅ Custom rule addition by business owner
  ✅ Agentic capability selection with toggles
  ✅ New feature setup flow (Path A and Path B)
  ✅ API keys vault (AES-256 encrypted)
  ✅ Integration modes: Supabase, Firebase, REST API
  ✅ Connection testing per API key/credential
  ✅ Sandbox testing with mock data + action log
  ✅ One-click Go Live
  ✅ Embed code generation (unique per business)
  ✅ Integration health check dashboard
  ✅ Analytics dashboard (all metrics in Chapter 5)
  ✅ Logs and monitoring with filters
  ✅ Platform owner master log (all businesses)
  ✅ Platform owner push fix (all businesses at once)
  ✅ One-click rollback with full version history
  ✅ Rollback takes effect within 60 seconds
  ✅ Basic widget customization (color, bot name, avatar)

WIDGET:
  ✅ Floating chat widget (web only, bottom-right)
  ✅ Text chat mode
  ✅ Real-time voice mode (WebSocket streaming)
  ✅ Auto language detection (English + Hindi)
  ✅ Manual language toggle (EN / HI)
  ✅ Plan cards displayed inside chat
  ✅ User signup flow inside chat
  ✅ User login flow inside chat
  ✅ Coupon code application inside chat
  ✅ Payment initiation (existing or Razorpay)
  ✅ Graceful error messages for all failures
  ✅ Silent failure if AgentDeploy is unreachable
  ✅ Data written to business's existing database
  ✅ Voice auto-fallback to text on failure

──────────────────────────────────────────────────────────────
OUT OF SCOPE FOR V1 — DO NOT BUILD THESE
──────────────────────────────────────────────────────────────
  ❌ Mobile dashboard app
  ❌ Multiple team members per business account
  ❌ Full white-labeling (custom domain, full branding)
  ❌ Direct database connections (non-API databases)
  ❌ GraphQL support
  ❌ MongoDB direct connection
  ❌ MySQL / PostgreSQL direct connection
  ❌ Automated code deployment to business servers
  ❌ Mobile app version of the chat widget
  ❌ SaaS billing system (manual business onboarding)
  ❌ Agent template marketplace
  ❌ Cross-business analytics reports
  ❌ Languages beyond English and Hindi
  ❌ Video/image sharing inside widget (v1 is text+voice)
  ❌ Multi-agent setup (one agent per business only)
  ❌ A/B testing of conversation flows

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 9 — AI LAYER SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
9.1 THREE AI ROLES
──────────────────────────────────────────────────────────────

ROLE 1: SETUP ANALYST AI
  Used by    : Business owner during onboarding (dashboard)
  Triggered  : When business owner uploads files
  What it does:
    - Reads uploaded PDFs, images, text files
    - Extracts understanding of: business type, plans,
      processes, FAQs, customer types
    - Asks clarifying questions in chat interface
    - Suggests what features/rules might be useful
    - Pre-fills structured form suggestions for owner
      to confirm (not auto-save, owner must confirm)
    - Generates initial conversation rule set
    - Proposes agentic capabilities based on business
  What it NEVER does:
    - Generate or assume pricing values
    - Generate or assume plan names
    - Generate or assume coupon codes
    - Save anything without owner confirmation

ROLE 2: CONVERSATION AGENT AI
  Used by    : End users through the chat widget
  Triggered  : Every time a user sends a message or speaks
  What it does:
    - Greets user and understands their problem
    - Follows ONLY approved conversation rules
    - Uses ONLY data from structured business owner forms
    - Shows plan cards when relevant
    - Guides user through signup / login
    - Applies coupon codes from approved list only
    - Initiates payment flow
    - Answers FAQs using only uploaded business data
    - Maintains conversation context within a session
    - Responds in user's language (English or Hindi)
  What it NEVER does:
    - Make up any information not in its approved context
    - Call any API not in the approved capability list
    - Store data anywhere other than business's own DB
    - Take any action not approved by business owner
  When it doesn't know something:
    Says: "I don't have that information right now.
           Let me connect you with our team."

ROLE 3: NEW FEATURE ARCHITECT AI
  Used by    : Business owner when new feature needed
  Triggered  : Feature request from user or owner
  What it does:
    - Proposes feature logic in plain English
    - Determines if existing API can support it
    - If Path A: generates code snippet for developer
    - If Path B: identifies third-party service
    - Asks for required data via structured forms
    - Sets up feature in sandbox for testing
  What it NEVER does:
    - Deploy anything without business owner approval
    - Generate values for payment, pricing, 


    9.3 CONVERSATION AGENT SYSTEM PROMPT RULES
──────────────────────────────────────────────────────────────

The system prompt for ROLE 2 (Conversation Agent)
MUST contain ALL of these and ONLY these:

MUST INCLUDE:
→ Business name and description (from owner's upload)
→ Approved plan names, prices, features (from Form A)
→ Approved coupon codes and values (from Form B)
→ Approved conversation rules (from Step 5)
→ List of approved agentic capabilities (from Step 6)
→ Language instruction (respond in user's language)
→ Unknown information instruction (say you don't know)
→ Anti-hallucination instruction (below)

ANTI-HALLUCINATION INSTRUCTION (include verbatim):
"You must ONLY use information explicitly provided
in this system prompt. You must NEVER invent, assume,
or extrapolate any pricing, plan names, coupon codes,
discount values, or business policies. If a user asks
for information not present in this prompt, say:
'I don't have that information right now.
Let me connect you with our team.'"

MUST NOT INCLUDE:
→ Any hardcoded API keys or credentials
→ Any data not approved by business owner
→ Any capability not in the approved list

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 10 — TECH STACK REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPONENT TECHNOLOGY NOTES
─────────────────────────────────────────────────────────
Dashboard Frontend : Next.js + React Web only
Widget Frontend : React Web component
Backend API : Python FastAPI Main server
AI Orchestration : LangChain or custom Pluggable
AI Primary Default : Claude 3.5 Sonnet Anthropic
AI Secondary Default : Gemini 1.5 Pro Google
Voice STT Primary : Deepgram Real-time
Voice STT Fallback : OpenAI Whisper Fallback
Voice TTS Primary : ElevenLabs Natural voice
Voice TTS Fallback : Google Cloud TTS Fallback
Voice Protocol : WebSocket (FastAPI WS) Streaming
Platform Database : Supabase Our own data
File Storage : Supabase Storage Biz files
API Key Encryption : AES-256 All keys
Business Owner Auth : Supabase Auth Dashboard login
Frontend Deploy : Vercel Dashboard+CDN
Backend Deploy : Railway or Render FastAPI server
Logging : Custom → Supabase Searchable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 11 — SECURITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These rules must be enforced in every piece of code:

STORAGE:
→ All API keys encrypted AES-256 at rest
→ API keys never sent to or stored in frontend
→ API keys never appear in any log entry
→ Sensitive form data (keys, secrets) masked in UI

COMMUNICATION:
→ All widget ↔ backend communication over HTTPS
→ All voice streaming over WSS (not WS)
→ Widget only communicates with AgentDeploy servers
→ Widget cannot access the business page's DOM/cookies

ISOLATION:
→ Each business's agent is fully isolated
→ Business A cannot access Business B's data
→ Business A's API keys cannot be used by B's agent
→ Platform owner access is logged and audited

SESSIONS:
→ End user session tokens: max 1 hour lifetime
→ Refresh tokens issued only to verified sessions
→ Rate limiting on ALL widget API endpoints

PROXY:
→ Business API keys only used server-side in proxy
→ Proxy never forwards raw API keys to widget
→ Proxy sanitizes API response bodies before logging
(removes any PII or sensitive data from logs)

COMPLIANCE:
→ User chat data deletable on request (GDPR-aware)
→ Business owner can request full data export
→ Business owner can request full data deletion
→ IP whitelisting available for business API protection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 12 — ERROR HANDLING & RELIABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────────────────────────────
PERFORMANCE TARGETS
──────────────────────────────────────────────────────────────
Widget load time : Under 2 seconds
Voice response latency: Under 1.5 seconds
Text AI response time : Under 3 seconds
Rollback effect time : Within 60 seconds
Platform uptime target: 99.5%

──────────────────────────────────────────────────────────────
ERROR HANDLING RULES
──────────────────────────────────────────────────────────────

IF AI MODEL FAILS:
→ Show user: "I'm having a moment, please try again"
→ Log error with full details
→ Try fallback AI model automatically
→ Alert platform owner

IF BUSINESS API CALL FAILS:
→ Show user a friendly, non-technical message
→ Log: endpoint, request (sanitized), response,
timestamp, session ID
→ Notify platform owner
→ Do NOT retry payment-related calls automatically

IF PAYMENT API FAILS:
→ NEVER retry automatically
→ Show user clear message: "Payment could not be
processed. Please try again or contact support."
→ Log with full details
→ Alert platform owner immediately

IF VOICE FAILS:
→ Auto-switch to text mode silently
→ Show user: "Switched to text mode"
→ Log the voice failure
→ Do NOT show technical error to user

IF WIDGET SCRIPT FAILS TO LOAD:
→ Zero errors thrown on business page
→ Widget simply does not appear
→ Business website functions completely normally
→ Log the failure on AgentDeploy side

IF AGENTDEPLOY BACKEND IS DOWN:
→ Widget script detects this during load
→ Widget does not render (silent failure)
→ Business page works perfectly
→ Platform owner is alerted by monitoring system

──────────────────────────────────────────────────────────────
LOG ENTRY REQUIRED FIELDS (EVERY LOG MUST HAVE THESE)
──────────────────────────────────────────────────────────────

timestamp (ISO 8601 format)
business_id (which business this is for)
session_id (which user session)
log_type (ERROR / WARNING / INFO)
error_code (API_FAILURE / AI_ERROR /
PAYMENT_ERROR / AUTH_FAILURE /
AGENT_CRASH / FEATURE_ERROR)
description (human-readable what happened)
endpoint (which API endpoint was called)
request_summary (sanitized — no keys, no PII)
response_status (HTTP status code)
response_summary (sanitized)
resolution_status (UNRESOLVED / RESOLVED /
PLATFORM_FIX_APPLIED)
platform_fix_id (if fix was pushed by platform owner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 13 — OPEN QUESTIONS (DO NOT ASSUME ANSWERS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If your task touches any of these questions, STOP.
Ask the product owner before making any decision.

Q1 STATUS: UNDECIDED
What is the pricing model for charging businesses?
Options: per conversation / monthly flat /
per agent / revenue share on conversions

Q2 STATUS: UNDECIDED
Which languages to support after English + Hindi?

Q3 STATUS: UNDECIDED
Will there be a pre-built agent template marketplace?
(templates for common business types like yoga studio,
coaching, e-commerce, etc.)

Q4 STATUS: UNDECIDED
What is the go-to-market strategy?
(direct outreach, partnerships, app marketplaces)

Q5 STATUS: UNDECIDED
GDPR and data residency for international businesses?
Important before any international launch.

Q6 STATUS: UNDECIDED
What happens when a business changes their API structure?
(versioning and migration strategy)

Q7 STATUS: UNDECIDED
How do we support businesses with no tech team?
(for Path A new features where a developer is needed)

Q8 STATUS: UNDECIDED
How many concurrent business agents must v1 support?
(capacity planning for backend infrastructure)

Q9 STATUS: UNDECIDED
What is the SLA commitment to businesses?
(uptime guarantees, support response times)

Q10 STATUS: UNDECIDED
Will the platform support webhooks from business
systems pushing data TO AgentDeploy?
(e.g., "user just bought manually, update agent context")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 14 — TERMINOLOGY DICTIONARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use these exact terms consistently everywhere.
Never invent new terms for existing concepts.

TERM DEFINITION
────────────────────────────────────────────────────────
AgentDeploy : The SaaS platform being built
Platform Owner : The builder/operator of AgentDeploy
Business Owner : Company using AgentDeploy dashboard
End User : Business's customer using widget
Agent : The AI deployed for one business
Agent ID : Unique identifier per business agent
Widget : The floating chat UI on biz website
Dashboard : Business owner's web admin panel
Sandbox : Isolated test env (no real data)
Middleware Proxy : Our layer between widget + biz APIs
Structured Data : Data entered in text boxes by owner
Capability : An approved action the agent can take
Rule : An approved conversation behavior
Integration Mode : How we connect to biz DB (A/B/C)
Mode A : Supabase integration
Mode B : Firebase integration
Mode C : Custom REST API integration
Embed Code : The one script tag for biz website
Go Live : Agent deployed to production widget
Rollback : Reverting to previous agent config
Platform Fix : Fix pushed to all businesses at once
Setup Analyst AI : AI role during business onboarding
Conversation Agent : AI role talking to end users
Feature Architect AI: AI role designing new features
Path A : New feature via developer code
Path B : New feature via third-party service
Anti-hallucination : System design preventing AI making
up critical business data
Crash Isolation : Widget failing without breaking site
Keys Vault : Encrypted storage for all API keys
Action Log : Real-time sandbox activity monitor
Version History : All past agent configurations stored

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 15 — REFERENCE EXAMPLE BUSINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use this example to understand the product when testing,
generating demos, or explaining the system.
These values are EXAMPLE ONLY — not real business data.

BUSINESS NAME : FaceYoga Studio (Example)
WEBSITE : faceyoga.example.com
INTEGRATION MODE : Mode A (Supabase)
BOT NAME : Zara

PLANS (as entered by business owner in Form A):
┌──────────────────────────────────────────────────────┐
│ Plan 1: Beginner Plan │
│ Price: ₹2,999 / month │
│ Features: 2 Zoom sessions, video library, │
│ WhatsApp support │
├──────────────────────────────────────────────────────┤
│ Plan 2: Intermediate Plan │
│ Price: ₹4,999 / month │
│ Features: 4 Zoom sessions, video library, │
│ 1:1 consultation, WhatsApp support │
├──────────────────────────────────────────────────────┤
│ Plan 3: Advanced Plan │
│ Price: ₹7,999 / month │
│ Features: 8 Zoom sessions, video library, │
│ daily 1:1, WhatsApp + call support │
└──────────────────────────────────────────────────────┘

COUPONS (as entered by business owner in Form B):
┌──────────────────────────────────────────────────────┐
│ Code: YOGA20 │
│ Type: Percentage | Value: 20% off │
│ Applicable: All plans | First-time users only │
├──────────────────────────────────────────────────────┤
│ Code: WELCOME50 │
│ Type: Flat | Value: ₹500 off │
│ Applicable: Beginner Plan only │
└──────────────────────────────────────────────────────┘

PAYMENT: Razorpay (business owner provided their keys)

APPROVED CAPABILITIES:
✅ User Login, User Signup, Show Plans
✅ Apply Coupons, Process Payment
✅ Welcome Email (Path B via Mailchimp)

EXAMPLE CONVERSATION FLOW:
User : "My face feels tight and I'm very stressed"
Zara : Empathizes, asks about their goals
Zara : "Based on what you've shared, the Beginner
Plan sounds perfect for you."
Zara : [Shows Beginner Plan card: ₹2,999/month with
features exactly as entered by owner]
Zara : "I also have a coupon YOGA20 for 20% off —
that brings it to ₹2,399 for your first month"
User : "That sounds great"
Zara : "Let me get you signed up. What's your name
and email?"
[Signup flow via Supabase Auth]
[Data written to FaceYoga's Supabase database]
[Razorpay payment initiated for ₹2,399]
[Payment confirmed]
[Welcome email triggered via Mailchimp]
Zara : "You're all set! Check your email for details."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHAPTER 16 — FILE MAINTENANCE INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR THE HUMAN MAINTAINING THIS FILE:

WHEN TO UPDATE THIS FILE:
→ Any new product decision is made
→ Any feature added or removed from scope
→ Any tech stack change
→ Any open question gets resolved
→ Any new rule or principle is established
→ Any terminology change

HOW TO UPDATE:
→ Change the version number at the top
→ Update the date
→ Add a changelog entry below
→ If an open question is resolved, move it from
Chapter 13 to the relevant chapter

HOW TO USE WITH AI AGENTS IN ANTIGRAVITY:
→ Attach this file at the start of every session
→ OR paste it as the first message
→ If AI gives a wrong answer, point to the chapter:
"Re-read Chapter [X] and correct your response"
→ If AI makes a new decision not in this file,
add it to this file before ending the session

VERSIONING:
V1.0 — Initial context file created
V2.0 — Full rewrite with stricter AI rules,
decision trees, architecture diagrams,
and improved chapter structure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF ANTIGRAVITY MASTER CONTEXT FILE
Version : 2.0
Project : AgentDeploy
This file is the highest authority.
When in doubt, re-read Chapter 0.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


---

## What Makes V2 Better Than V1

| Area | V1 | V2 |
|---|---|---|
| AI Rules | 12 basic rules | 12 rules with exact scripts for AI to say when unsure |
| Architecture | Text description | Full ASCII diagrams with data flow arrows |
| Database strategy | Paragraph | Visual decision tree flowchart |
| New feature flow | Text steps | Full flowchart with branches |
| Forms | Listed fields | Explicit note on EVERY field that owner must type it |
| System prompt rules | Brief mention | Full specification of what MUST and MUST NOT be in prompt |
| Error handling | General rules | Specific handling per failure type |
| Log structure | Field list | Required fields with types for every single log |
| Open questions | Listed | Each has a STATUS label so AI knows it is a blocker |
| Maintenance | Not included | Full instructions on how to keep file updated |
| Contradiction handling | Rule only | Exact script for AI to say when conflict found |