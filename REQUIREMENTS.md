# AgentDeploy — Product Requirements Document
**Version:** 1.0  
**Status:** Draft  
**Audience:** Senior Developers & Technical Co-builders  
**Last Updated:** 2025  

---

## 1. PRODUCT OVERVIEW

AgentDeploy is a SaaS platform that enables businesses to deploy 
an AI-powered conversational agent (chatbot + voice bot) on their 
existing website. The agent understands the business deeply, 
interacts with end-users in real-time via text or voice, guides 
them through offerings, handles signups/logins, recommends plans, 
applies coupons, and facilitates payments — all while staying 
connected to the business's existing backend systems and database.

The platform has two distinct sides:

- **Business Owner Side:** A web dashboard where the business 
  owner sets up, configures, tests, and monitors their AI agent.
- **End User Side:** A floating chat/voice widget embedded on 
  the business's website that users interact with.

---

## 2. CORE PRINCIPLES

1. **Non-destructive Integration:** The AI agent must NEVER 
   replace or break the existing business system. It acts as 
   an additional layer on top.

2. **Anti-Hallucination by Design:** All critical business data 
   (pricing, plans, coupon codes, payment values) must be 
   manually entered by the business owner in structured text 
   boxes. The AI reads this data — it does not generate or 
   assume it.

3. **Crash Isolation:** If the AI agent crashes or fails, the 
   original website and all its existing features must continue 
   to function without any disruption.

4. **Business Owner Approval at Every Critical Step:** The AI 
   can suggest, analyze, and propose — but cannot finalize any 
   configuration, new feature, or rule without explicit business 
   owner approval.

5. **Existing Data Integrity:** Any user action taken through 
   the AI agent (signup, login, purchase) must be reflected in 
   the business's existing database exactly as if the user had 
   done it through the original website.

6. **Flexible AI Model Support:** The platform must support 
   pluggable AI models. Business owner can bring their own API 
   key (Claude, Gemini, OpenAI). Platform owner (you) can set 
   a default model. Model switching must require only a config 
   change, not a code rewrite.

---

## 3. USER ROLES

### 3.1 Platform Owner (You)
- Access to all business accounts
- Can monitor all agents, logs, errors across all businesses
- Can push fixes that reflect across all deployed agents 
  simultaneously
- Can update default AI model in central config

### 3.2 Business Owner
- Single account per business
- Accesses the AgentDeploy dashboard
- Uploads business data, configures agent, approves rules
- Tests agent in sandbox before going live
- Monitors analytics and logs for their agent
- Adds a single line of embed code to their website

### 3.3 End User (Website Visitor)
- Visits the business's website
- Interacts with the floating AI agent widget
- Can talk via text or real-time voice
- Gets guided through plans, signup/login, payments
- All their data is saved to the business's existing database

---

## 4. PLATFORM ARCHITECTURE

### 4.1 High-Level Architecture