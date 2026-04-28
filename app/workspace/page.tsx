"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FlintChatOverlay, FlintChatTrigger, Message } from '@/components/flint-neural-chat/FlintChat';
import CreateBusinessModal from '@/components/CreateBusinessModal';

/* ─────────────────────────────────────────────────────────────
   AgentDeploy – Setup Workspace  (Light, Precision-Editorial)
   Route: /workspace
   Fonts: Space Grotesk (headline) + Inter (body) loaded inline
   ───────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { icon: "grid_view",  label: "Workspace", active: true  },
  { icon: "smart_toy",  label: "Agents",    active: false },
  { icon: "database",   label: "Knowledge", active: false },
  { icon: "insights",   label: "Analytics", active: false },
  { icon: "tune",       label: "Settings",  active: false },
];

const INDEXED_FILES = [
  { icon: "description", name: "api_docs_v2.pdf",  status: "Indexed",  statusBg: "#d3e4fe", statusColor: "#435368" },
  { icon: "code",        name: "schema_v1.json",   status: "Pending",  statusBg: "#d9e4ea", statusColor: "#566166" },
];

/* ───────────────────────────────────────────────────────────────
   DEPLOYMENT VIEW COMPONENT
   ─────────────────────────────────────────────────────────────── */

const EMBED_CODE = `<!-- AgentDeploy Widget -->
<script
  src="https://cdn.agentdeploy.ai/widget/v2.1/loader.js"
  data-agent-id="ag_8f2k9x4m1n7p"
  data-brand-color="#4d44e3"
  data-position="bottom-right"
  async
></script>`;

const API_CODE = `// AgentDeploy API Integration
const response = await fetch(
  "https://api.agentdeploy.ai/v1/chat",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ag_sk_live_••••••••",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: "ag_8f2k9x4m1n7p",
      message: userInput,
      session_id: sessionId,
    }),
  }
);

const data = await response.json();
console.log(data.reply);`;

const REACT_CODE = `import { AgentWidget } from '@agentdeploy/react';

export default function App() {
  return (
    <AgentWidget
      agentId="ag_8f2k9x4m1n7p"
      brandColor="#4d44e3"
      position="bottom-right"
      greeting="Hi! How can I help you today?"
      onMessage={(msg) => console.log(msg)}
    />
  );
}`;

const SANDBOX_LOGS = [
  { time: "12:04:01", type: "info", msg: "Agent initialized with context: product_catalog_v3" },
  { time: "12:04:02", type: "success", msg: "Connected to Supabase middleware proxy" },
  { time: "12:04:03", type: "info", msg: "User: \"What are your pricing plans?\"" },
  { time: "12:04:04", type: "success", msg: "Agent: Retrieved 3 plans from knowledge base (120ms)" },
  { time: "12:04:05", type: "info", msg: "Action: display_pricing_table — awaiting approval gate" },
  { time: "12:04:06", type: "warn", msg: "Hallucination check passed — confidence: 0.97" },
];

const HEALTH_CHECKS = [
  { label: "Widget detected on domain", status: "pass" },
  { label: "API key validated & active", status: "pass" },
  { label: "SSL certificate active", status: "pass" },
  { label: "Response latency < 200ms", status: "pass" },
  { label: "Knowledge base synced", status: "pass" },
];

const DEMO_MESSAGES = [
  { sender: "ai", text: "Hi! 👋 I'm your AI assistant. I can help with pricing, bookings, and product questions. How can I help you today?" },
  { sender: "user", text: "What are your pricing plans?" },
  { sender: "ai", text: "We offer three plans:\n• Starter — $29/mo\n• Professional — $79/mo\n• Enterprise — Custom pricing\n\nWould you like to know more about any specific plan?" },
];

interface SandboxLog {
  time: string;
  type: string;
  msg: string;
}

interface DeploymentViewProps {
  setIsChatOpen: (isOpen: boolean) => void;
  sandboxLogs: SandboxLog[];
  setSandboxLogs: React.Dispatch<React.SetStateAction<SandboxLog[]>>;
  embedCode?: string;
  apiCode?: string;
  reactCode?: string;
  agentId?: string;
  businessName?: string;
  agentStatus?: string;
}

function DeploymentView({ setIsChatOpen, sandboxLogs, setSandboxLogs, embedCode, apiCode, reactCode, agentId, businessName, agentStatus }: DeploymentViewProps) {
  const [activeCodeTab, setActiveCodeTab] = React.useState<'embed' | 'api' | 'react'>('embed');
  const [copiedTab, setCopiedTab] = React.useState<string | null>(null);
  const [isSandboxRunning, setIsSandboxRunning] = React.useState(false);
  const [targetDomain, setTargetDomain] = React.useState(businessName ? `${businessName.toLowerCase().replace(/\s+/g, '')}.com` : 'yourwebsite.com');

  const codeMap = { embed: embedCode || EMBED_CODE, api: apiCode || API_CODE, react: reactCode || REACT_CODE };

  const handleCopy = (tab: string) => {
    navigator.clipboard.writeText(codeMap[tab as keyof typeof codeMap]);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };


  const runSandbox = () => {
    setIsSandboxRunning(true);
    setSandboxLogs(SANDBOX_LOGS.slice(0, 2));
    let i = 2;
    const interval = setInterval(() => {
      if (i < SANDBOX_LOGS.length) {
        setSandboxLogs(prev => [...prev, SANDBOX_LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsSandboxRunning(false);
      }
    }, 600);
  };

  return (
    <div className="dp-root">
      {/* ── Left Column (60%) ──────────────────────────── */}
      <div className="dp-left-col">

        {/* Agent Preview Card */}
        <div className="dp-card dp-preview-card">
          <div className="dp-card-header">
            <div>
              <div className="dp-card-title">{businessName ? `${businessName} — Agent Preview` : 'Agent Preview'}</div>
              <div className="dp-card-subtitle">Preview how your agent appears on your website.</div>
            </div>
            {agentStatus === 'live' ? (
              <div className="dp-live-badge" style={{ background: '#dcfce7', color: '#166534' }}>
                <span className="dp-live-dot" style={{ background: '#16a34a' }} />
                Live
              </div>
            ) : (
              <div className="dp-live-badge">
                <span className="dp-live-dot" />
                Sandbox Mode
              </div>
            )}
          </div>

          {/* Browser Chrome Frame */}
          <div className="dp-browser-frame">
            <div className="dp-browser-chrome">
              <div className="dp-browser-dots">
                <span className="dp-dot dp-dot-red" />
                <span className="dp-dot dp-dot-yellow" />
                <span className="dp-dot dp-dot-green" />
              </div>
              <div className="dp-browser-url">
                <span className="material-symbols-outlined" style={{ fontSize: '14px', opacity: 0.4 }}>lock</span>
                <span>{targetDomain}</span>
              </div>
              <div style={{ width: '60px' }} />
            </div>

            {/* Website Mock */}
            <div className="dp-website-mock">
              <div className="dp-mock-nav">
                <div className="dp-mock-logo" />
                <div className="dp-mock-nav-links">
                  <div className="dp-mock-link" /> <div className="dp-mock-link" /> <div className="dp-mock-link" />
                </div>
              </div>
              <div className="dp-mock-hero">
                <div className="dp-mock-line dp-mock-line-lg" />
                <div className="dp-mock-line dp-mock-line-md" />
                <div className="dp-mock-line dp-mock-line-sm" />
              </div>
              <div className="dp-mock-grid">
                <div className="dp-mock-card-placeholder" />
                <div className="dp-mock-card-placeholder" />
                <div className="dp-mock-card-placeholder" />
              </div>


              {/* Chat Trigger Button */}
              <button className="dp-chat-trigger" onClick={() => setIsChatOpen(true)}>
                <span className="material-symbols-outlined">chat</span>
                <span className="dp-chat-trigger-label">Try your agent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sandbox Testing Console */}
        <div className="dp-card dp-sandbox-card">
          <div className="dp-card-header">
            <div>
              <div className="dp-card-title">Sandbox Environment</div>
              <div className="dp-card-subtitle">Test your agent in an isolated sandbox before going live.</div>
            </div>
            <button
              className={`dp-run-btn ${isSandboxRunning ? 'dp-running' : ''}`}
              onClick={runSandbox}
              disabled={isSandboxRunning}
            >
              <span className="material-symbols-outlined">{isSandboxRunning ? 'hourglass_top' : 'play_arrow'}</span>
              {isSandboxRunning ? 'Running...' : 'Run Test Suite'}
            </button>
          </div>

          {/* Status Indicators */}
          <div className="dp-status-row">
            <div className="dp-status-chip dp-status-pass">
              <span className="material-symbols-outlined">check_circle</span> API Connected
            </div>
            <div className="dp-status-chip dp-status-pass">
              <span className="material-symbols-outlined">check_circle</span> Model Loaded
            </div>
            <div className="dp-status-chip dp-status-neutral">
              <span className="material-symbols-outlined">speed</span> Latency: 120ms
            </div>
            <div className="dp-status-chip dp-status-pass">
              <span className="material-symbols-outlined">check_circle</span> Knowledge Synced
            </div>
          </div>

          {/* Console Log */}
          <div className="dp-console">
            {sandboxLogs.map((log, i) => (
              <div key={i} className={`dp-log-line dp-log-${log.type}`}>
                <span className="dp-log-time">{log.time}</span>
                <span className={`dp-log-badge dp-log-badge-${log.type}`}>
                  {log.type.toUpperCase()}
                </span>
                <span className="dp-log-msg">{log.msg}</span>
              </div>
            ))}
            {isSandboxRunning && (
              <div className="dp-log-line dp-log-info dp-log-blink">
                <span className="dp-log-time">--:--:--</span>
                <span className="dp-log-badge dp-log-badge-info">RUNNING</span>
                <span className="dp-log-msg">Processing test suite...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Column (40%) ─────────────────────────── */}
      <div className="dp-right-col">

        {/* Integration Code Section */}
        <div className="dp-card dp-code-card">
          <div className="dp-card-header">
            <div>
              <div className="dp-card-title">Integration Code</div>
              <div className="dp-card-subtitle">Add the agent to your website with one of these methods.</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dp-code-tabs">
            <button
              className={`dp-code-tab ${activeCodeTab === 'embed' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('embed')}
            >
              <span className="material-symbols-outlined">code</span> Embed Script
            </button>
            <button
              className={`dp-code-tab ${activeCodeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('api')}
            >
              <span className="material-symbols-outlined">api</span> API
            </button>
            <button
              className={`dp-code-tab ${activeCodeTab === 'react' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('react')}
            >
              <span className="material-symbols-outlined">deployed_code</span> React
            </button>
          </div>

          {/* Code Block */}
          <div className="dp-code-block">
            <div className="dp-code-header">
              <span className="dp-code-lang">
                {activeCodeTab === 'embed' ? 'HTML' : activeCodeTab === 'api' ? 'JavaScript' : 'JSX'}
              </span>
              <button className="dp-copy-btn" onClick={() => handleCopy(activeCodeTab)}>
                <span className="material-symbols-outlined">
                  {copiedTab === activeCodeTab ? 'check' : 'content_copy'}
                </span>
                {copiedTab === activeCodeTab ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="dp-code-pre">
              <code>{codeMap[activeCodeTab]}</code>
            </pre>
          </div>

          <div className="dp-code-note">
            <span className="material-symbols-outlined">info</span>
            <span>
              {activeCodeTab === 'embed'
                ? 'Place this script tag just before </body> in your HTML file.'
                : activeCodeTab === 'api'
                ? 'Use this endpoint to integrate the agent into your backend.'
                : 'Install the package with: npm install @agentdeploy/react'}
            </span>
          </div>
        </div>

        {/* Integration Health Check */}
        <div className="dp-card dp-health-card">
          <div className="dp-card-header">
            <div>
              <div className="dp-card-title">Integration Health</div>
              <div className="dp-card-subtitle">All systems operational.</div>
            </div>
            <button className="dp-verify-btn">
              <span className="material-symbols-outlined">refresh</span>
              Verify
            </button>
          </div>

          <div className="dp-health-list">
            {HEALTH_CHECKS.map((check, i) => (
              <div key={i} className="dp-health-item">
                <span className={`material-symbols-outlined dp-health-icon dp-health-${check.status}`}>
                  {check.status === 'pass' ? 'check_circle' : 'error'}
                </span>
                <span className="dp-health-label">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Go Live Section */}
        <div className="dp-card dp-golive-card">
          <div className="dp-golive-header">
            <span className="material-symbols-outlined dp-golive-icon">rocket_launch</span>
            <div>
              <div className="dp-card-title">Go Live</div>
              <div className="dp-card-subtitle">Deploy your agent to production.</div>
            </div>
          </div>

          <div className="dp-domain-input-group">
            <label className="dp-domain-label">Target Domain</label>
            <div className="dp-domain-input-wrap">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--ds-outline)' }}>language</span>
              <input
                className="dp-domain-input"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>

          <button className="dp-deploy-production-btn">
            <span className="material-symbols-outlined">rocket_launch</span>
            Deploy to Production
          </button>

          <div className="dp-deploy-warning">
            <span className="material-symbols-outlined">warning</span>
            <span>This will make your agent live and accessible to visitors on your website.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Business {
  id: string;
  name: string;
  agent_id: string;
  agent_status: string;
  website_url?: string;
  bot_name?: string;
  category?: string;
  onboarding_step: number;
  onboarding_completed: boolean;
}

interface VaultEntry {
  id: string;
  key_name: string;
  connection_status: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string, full_name?: string, email_verified?: boolean } | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [vaultEntries, setVaultEntries] = useState<Record<string, VaultEntry>>({});
  const [vaultInputs, setVaultInputs] = useState<Record<string, { apiKey: string; secretKey: string; url?: string }>>({});
  const [vaultSaving, setVaultSaving] = useState<Record<string, boolean>>({});
  const [vaultSuccess, setVaultSuccess] = useState<Record<string, boolean>>({});
  const [vaultError, setVaultError] = useState<Record<string, string>>({});
  const [activeStage, setActiveStage] = React.useState('Analysis');
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const userData = await api.get("/auth/me");
        setUser(userData);
        // Load business
        try {
          const biz = await api.get("/businesses/mine");
          setBusiness(biz);
          // Load vault entries for this business
          const keys: VaultEntry[] = await api.get(`/businesses/${biz.id}/vault`);
          const mapped: Record<string, VaultEntry> = {};
          keys.forEach((k) => { mapped[k.key_name] = k; });
          setVaultEntries(mapped);
        } catch (bizErr: any) {
          if (bizErr?.message?.includes('404') || bizErr?.message?.toLowerCase().includes('no business')) {
            setShowCreateBusiness(true);
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        router.push("/signin");
      }
    };
    checkAuth();
  }, [router]);

  // Called after CreateBusinessModal successfully creates a business
  const handleBusinessCreated = (biz: Business) => {
    setBusiness(biz);
    setShowCreateBusiness(false);
  };

  // Save an integration API key to the vault
  const handleVaultSave = async (serviceId: string, serviceName: string) => {
    if (!business) return;
    const inputs = vaultInputs[serviceId] || {};
    if (!inputs.apiKey?.trim()) return;

    setVaultSaving((prev) => ({ ...prev, [serviceId]: true }));
    setVaultError((prev) => ({ ...prev, [serviceId]: '' }));
    try {
      // Save API key
      const apiKeyName = `${serviceName} API Key`;
      const secretKeyName = `${serviceName} Secret Key`;

      const saved = await api.post(`/businesses/${business.id}/vault`, {
        key_name: apiKeyName,
        key_type: 'integration',
        key_value: inputs.apiKey.trim(),
        description: `${serviceName} API Key for ${business.name}`,
      });
      setVaultEntries((prev) => ({ ...prev, [apiKeyName]: saved }));

      if (inputs.secretKey?.trim()) {
        const saved2 = await api.post(`/businesses/${business.id}/vault`, {
          key_name: secretKeyName,
          key_type: 'integration',
          key_value: inputs.secretKey.trim(),
          description: `${serviceName} Secret Key for ${business.name}`,
        });
        setVaultEntries((prev) => ({ ...prev, [secretKeyName]: saved2 }));
      }

      if (serviceId === 'supabase' && inputs.url?.trim()) {
        const saved3 = await api.post(`/businesses/${business.id}/vault`, {
          key_name: 'Supabase URL',
          key_type: 'integration',
          key_value: inputs.url.trim(),
          description: `Supabase project URL for ${business.name}`,
        });
        setVaultEntries((prev) => ({ ...prev, ['Supabase URL']: saved3 }));
      }

      setVaultSuccess((prev) => ({ ...prev, [serviceId]: true }));
      setTimeout(() => {
        setVaultSuccess((prev) => ({ ...prev, [serviceId]: false }));
        setExpandedCard(null);
      }, 2000);
    } catch (err: any) {
      setVaultError((prev) => ({ ...prev, [serviceId]: err.message || 'Failed to save key' }));
    } finally {
      setVaultSaving((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<Message[]>([
    { id: "1", sender: "ai", text: "Hi! 👋 I'm your AI assistant. I can help with pricing, bookings, and product questions. How can I help you today?" }
  ]);
  const [sandboxLogs, setSandboxLogs] = React.useState(SANDBOX_LOGS.slice(0, 2));

  const handleSendMessage = (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), sender: "ai", 
        text: "We offer three plans:\n• Starter — $29/mo\n• Professional — $79/mo\n• Enterprise — Custom pricing\n\nWould you like to know more about any specific plan?" 
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setSandboxLogs(prev => [
        ...prev, 
        { time: new Date().toLocaleTimeString('en-US', { hour12: false }), type: "info", msg: `User: "${text}"` },
        { time: new Date().toLocaleTimeString('en-US', { hour12: false }), type: "success", msg: "Agent: Retrieved 3 plans from knowledge base" }
      ]);
    }, 1200);
  };

  // Build embed code using real agent_id (or fallback)
  const agentId = business?.agent_id ?? 'ag_pending_setup';
  const realEmbedCode = `<!-- AgentDeploy Widget -->
<script
  src="https://cdn.agentdeploy.ai/widget/v2.1/loader.js"
  data-agent-id="${agentId}"
  data-brand-color="#4d44e3"
  data-position="bottom-right"
  async
></script>`;
  const realApiCode = `// AgentDeploy API Integration
const response = await fetch(
  "https://api.agentdeploy.ai/v1/chat",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer ag_sk_live_••••••••",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: "${agentId}",
      message: userInput,
      session_id: sessionId,
    }),
  }
);

const data = await response.json();
console.log(data.reply);`;
  const realReactCode = `import { AgentWidget } from '@agentdeploy/react';

export default function App() {
  return (
    <AgentWidget
      agentId="${agentId}"
      brandColor="#4d44e3"
      position="bottom-right"
      greeting="Hi! How can I help you today?"
      onMessage={(msg) => console.log(msg)}
    />
  );
}`;

  return (
    <>
      {showCreateBusiness && (
        <CreateBusinessModal onCreated={handleBusinessCreated} />
      )}
      <FlintChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onVoiceDetected={(detected) => console.log("Voice:", detected)}
      />
      {/* ── Google Fonts ─────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Barlow:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

        /* ── Design Tokens ──────────────────────────────── */
        :root {
          --ds-primary:           #4d44e3;
          --ds-primary-dim:       #4034d7;
          --ds-primary-container: #e2dfff;
          --ds-on-primary:        #faf6ff;
          --ds-on-primary-cnt:    #3f33d6;

          --ds-surface:           #f7f9fb;
          --ds-surface-low:       #f0f4f7;
          --ds-surface-bright:    #f7f9fb;
          --ds-surface-cnt:       #e8eff3;
          --ds-surface-cnt-high:  #e1e9ee;
          --ds-surface-cnt-high2: #d9e4ea;
          --ds-surface-white:     #ffffff;

          --ds-on-surface:        #2a3439;
          --ds-on-surface-var:    #566166;
          --ds-outline:           #717c82;
          --ds-outline-var:       #a9b4b9;

          --ds-tertiary-cnt:      #cfdef5;
          --ds-on-tertiary-cnt:   #414f62;
          --ds-secondary-cnt:     #d3e4fe;
          --ds-on-secondary-cnt:  #435368;

          --ds-radius-sm:  6px;
          --ds-radius-md:  10px;
          --ds-radius-lg:  16px;
          --ds-radius-xl:  20px;

          --ds-shadow-soft: 0 4px 24px -4px rgba(42,52,57,0.07);
          --ds-shadow-card: 0 1px 3px rgba(42,52,57,0.06), 0 4px 16px -2px rgba(42,52,57,0.04);
        }

        /* ── Reset & Base ───────────────────────────────── */
        html, body { height: 100%; margin: 0; padding: 0; }

        .ws-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--ds-surface);
          color: var(--ds-on-surface);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Sidebar ────────────────────────────────────── */
        .ws-sidebar {
          width: 232px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: var(--ds-surface-white);
          border-right: 1px solid var(--ds-surface-cnt-high);
          padding: 20px 12px;
          gap: 20px;
          overflow-y: auto;
        }

        .ws-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px;
        }
        .ws-brand-icon {
          width: 34px; height: 34px;
          border-radius: var(--ds-radius-md);
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ws-brand-icon .material-symbols-outlined {
          font-size: 18px;
          color: white;
          font-variation-settings: 'FILL' 1;
        }
        .ws-brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--ds-on-surface);
          line-height: 1;
        }
        .ws-brand-version {
          font-size: 10px;
          color: var(--ds-outline);
          letter-spacing: 0.12em;
          margin-top: 3px;
        }

        .ws-new-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: var(--ds-radius-md);
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          color: var(--ds-on-primary);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 13px;
          border: none; cursor: pointer;
          box-shadow: 0 2px 8px rgba(77,68,227,0.25);
          transition: opacity 0.15s, transform 0.15s;
          width: 100%;
        }
        .ws-new-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .ws-new-btn:active { transform: translateY(0); }
        .ws-new-btn .material-symbols-outlined { font-size: 16px; }

        .ws-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }

        .ws-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: var(--ds-radius-md);
          color: var(--ds-on-surface-var);
          font-size: 13px; font-weight: 500;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          border: none; background: transparent; width: 100%; text-align: left;
        }
        .ws-nav-item .material-symbols-outlined { font-size: 20px; flex-shrink: 0; }
        .ws-nav-item:hover { background: var(--ds-surface-low); color: var(--ds-on-surface); }
        .ws-nav-item.active {
          background: var(--ds-primary-container);
          color: var(--ds-primary);
          font-weight: 600;
        }
        .ws-nav-item.active .material-symbols-outlined { font-variation-settings: 'FILL' 1; }

        .ws-nav-footer {
          border-top: 1px solid var(--ds-surface-cnt-high);
          padding-top: 12px;
          display: flex; flex-direction: column; gap: 2px;
        }

        /* ── Main Column ────────────────────────────────── */
        .ws-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* ── Topbar ─────────────────────────────────────── */
        .ws-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          height: 58px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--ds-surface-cnt-high);
          flex-shrink: 0;
          gap: 16px;
        }
        .ws-topbar-left { display: flex; align-items: center; gap: 20px; }
        .ws-topbar-brand {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700; font-size: 16px;
          color: var(--ds-on-surface);
          white-space: nowrap;
        }
        .ws-search {
          position: relative;
          display: flex; align-items: center;
        }
        .ws-search-icon {
          position: absolute; left: 10px;
          font-size: 16px; color: var(--ds-outline-var);
          pointer-events: none;
        }
        .ws-search input {
          background: var(--ds-surface-low);
          border: 1px solid transparent;
          border-radius: var(--ds-radius-md);
          padding: 7px 12px 7px 34px;
          font-size: 13px;
          color: var(--ds-on-surface);
          width: 220px;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: 'Inter', sans-serif;
        }
        .ws-search input::placeholder { color: var(--ds-outline-var); }
        .ws-search input:focus {
          border-color: var(--ds-primary);
          box-shadow: 0 0 0 3px rgba(77,68,227,0.08);
        }
        .ws-topbar-right { display: flex; align-items: center; gap: 10px; }
        .ws-topbar-docs {
          font-size: 13px; font-weight: 500;
          color: var(--ds-primary);
          background: none; border: none; cursor: pointer;
          padding: 6px 10px; border-radius: var(--ds-radius-sm);
          transition: background 0.15s;
        }
        .ws-topbar-docs:hover { background: var(--ds-primary-container); }
        .ws-deploy-btn {
          padding: 7px 16px;
          border-radius: var(--ds-radius-md);
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          color: var(--ds-on-primary);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 13px;
          border: none; cursor: pointer;
          box-shadow: 0 2px 8px rgba(77,68,227,0.2);
          transition: opacity 0.15s;
        }
        .ws-deploy-btn:hover { opacity: 0.9; }
        .ws-divider { width: 1px; height: 22px; background: var(--ds-surface-cnt-high2); }
        .ws-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px;
          border-radius: var(--ds-radius-sm);
          background: none; border: none; cursor: pointer;
          color: var(--ds-on-surface-var);
          transition: background 0.15s, color 0.15s;
        }
        .ws-icon-btn:hover { background: var(--ds-surface-low); color: var(--ds-on-surface); }
        .ws-icon-btn .material-symbols-outlined { font-size: 20px; }
        .ws-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid var(--ds-surface-white);
          box-shadow: 0 0 0 1px var(--ds-outline-var);
          object-fit: cover; cursor: pointer;
        }

        /* ── Stage Switcher ─────────────────────────────── */
        .ws-stages {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .ws-stage-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
          padding: 4px 0;
          background: none;
          border: none;
          transition: color 0.2s;
        }
        .ws-stage-label {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: var(--ds-outline);
        }
        .ws-stage-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--ds-surface-cnt-high2);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .ws-stage-item.active .ws-stage-label {
          color: var(--ds-primary);
        }
        .ws-stage-item.active .ws-stage-dot {
          background: var(--ds-primary);
          box-shadow: 0 0 8px var(--ds-primary);
        }
        .ws-stage-item:hover .ws-stage-label {
          color: var(--ds-on-surface);
        }

        /* ── Content Area ───────────────────────────────── */
        .ws-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 24px 28px 20px;
          gap: 20px;
        }

        /* ── Page Header ────────────────────────────────── */
        .ws-page-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-shrink: 0;
        }
        .ws-breadcrumb {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 700;
          color: var(--ds-outline);
          margin-bottom: 4px;
        }
        .ws-page-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px; font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ds-on-surface);
        }
        .ws-live-badge {
          display: flex; align-items: center; gap: 7px;
          background: var(--ds-primary-container);
          color: var(--ds-on-primary-cnt);
          padding: 6px 12px;
          border-radius: var(--ds-radius-md);
          font-size: 11px; font-weight: 700;
        }
        .ws-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--ds-primary);
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Canvas Grid ────────────────────────────────── */
        .ws-canvas {
          flex: 1;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
          overflow: hidden;
          min-height: 0;
        }

        /* ── Card Base ──────────────────────────────────── */
        .ws-card {
          background: var(--ds-surface-white);
          border-radius: var(--ds-radius-lg);
          box-shadow: var(--ds-shadow-card);
          overflow: hidden;
        }

        /* ── Left Col ───────────────────────────────────── */
        .ws-left-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow: hidden;
          min-height: 0;
        }

        .ws-knowledge-card {
          flex: 1;
          display: flex; flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }

        .ws-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid var(--ds-surface-cnt-high);
          flex-shrink: 0;
        }
        .ws-card-header-icon {
          width: 36px; height: 36px;
          border-radius: var(--ds-radius-sm);
          background: var(--ds-surface-low);
          display: flex; align-items: center; justify-content: center;
        }
        .ws-card-header-icon .material-symbols-outlined { font-size: 20px; color: var(--ds-outline); }
        .ws-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--ds-on-surface);
        }
        .ws-card-subtitle {
          font-size: 12px;
          color: var(--ds-on-surface-var);
          margin-top: 1px;
        }

        .ws-drop-zone {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          margin: 16px;
          border: 2px dashed var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-md);
          background: var(--ds-surface);
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          min-height: 140px;
        }
        .ws-drop-zone:hover {
          border-color: var(--ds-primary);
          background: rgba(77,68,227,0.03);
        }
        .ws-drop-zone:hover .ws-drop-icon-wrap { transform: scale(1.08); }
        .ws-drop-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--ds-surface-white);
          box-shadow: var(--ds-shadow-soft);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
          transition: transform 0.2s;
        }
        .ws-drop-icon-wrap .material-symbols-outlined {
          font-size: 26px;
          color: var(--ds-primary);
          font-variation-settings: 'FILL' 1;
        }
        .ws-drop-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--ds-on-surface);
        }
        .ws-drop-sub {
          font-size: 12px; color: var(--ds-on-surface-var);
          margin-top: 4px; max-width: 180px; line-height: 1.5;
        }
        .ws-drop-browse {
          margin-top: 14px;
          font-size: 12px; font-weight: 700;
          color: var(--ds-primary);
          background: none; border: none; cursor: pointer;
          border-bottom: 1.5px solid rgba(77,68,227,0.25);
          transition: border-color 0.15s;
          padding-bottom: 1px;
        }
        .ws-drop-browse:hover { border-color: var(--ds-primary); }

        .ws-file-list {
          padding: 0 16px 16px;
          flex-shrink: 0;
        }
        .ws-file-list-label {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.15em; font-weight: 700;
          color: var(--ds-outline);
          margin-bottom: 8px;
          padding: 0 4px;
        }
        .ws-file-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px;
          border-radius: var(--ds-radius-sm);
          background: var(--ds-surface-low);
          margin-bottom: 6px;
        }
        .ws-file-item:last-child { margin-bottom: 0; }
        .ws-file-left { display: flex; align-items: center; gap: 10px; }
        .ws-file-left .material-symbols-outlined { font-size: 18px; color: var(--ds-outline); }
        .ws-file-name { font-size: 12px; font-weight: 600; color: var(--ds-on-surface); }
        .ws-file-badge {
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 4px;
        }

        /* ── Engine Status Card ──────────────────────────── */
        .ws-engine-card {
          flex-shrink: 0;
        }
        .ws-engine-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
        }
        .ws-engine-icon {
          width: 38px; height: 38px;
          border-radius: var(--ds-radius-sm);
          background: var(--ds-tertiary-cnt);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ws-engine-icon .material-symbols-outlined { font-size: 20px; color: var(--ds-on-tertiary-cnt); }
        .ws-engine-info { display: flex; align-items: center; gap: 12px; }
        .ws-engine-title { font-size: 12px; font-weight: 700; color: var(--ds-on-surface); }
        .ws-engine-sub { font-size: 11px; color: var(--ds-on-surface-var); margin-top: 1px; }
        .ws-engine-stat { text-align: right; }
        .ws-engine-pct {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px; font-weight: 700;
          color: var(--ds-primary);
        }
        .ws-engine-pct-label { font-size: 10px; color: var(--ds-on-surface-var); }

        /* ── Right Col – Chat ────────────────────────────── */
        .ws-right-col { display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

        .ws-chat-card {
          flex: 1;
          display: flex; flex-direction: column;
          overflow: hidden;
          min-height: 0;
          position: relative;
        }

        .ws-chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: var(--ds-surface);
          border-bottom: 1px solid var(--ds-surface-cnt-high);
          flex-shrink: 0;
        }
        .ws-chat-agent { display: flex; align-items: center; gap: 12px; }
        .ws-chat-agent-icon {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--ds-primary-container);
          display: flex; align-items: center; justify-content: center;
        }
        .ws-chat-agent-icon .material-symbols-outlined {
          font-size: 22px; color: var(--ds-primary);
          font-variation-settings: 'FILL' 1;
        }
        .ws-chat-agent-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--ds-on-surface);
        }
        .ws-chat-agent-status { font-size: 11px; color: var(--ds-on-surface-var); margin-top: 2px; }
        .ws-chat-actions { display: flex; gap: 4px; }

        .ws-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex; flex-direction: column; gap: 20px;
          scroll-behavior: smooth;
        }
        .ws-messages::-webkit-scrollbar { width: 4px; }
        .ws-messages::-webkit-scrollbar-thumb { background: var(--ds-outline-var); border-radius: 4px; }

        /* AI message */
        .ws-msg-ai { display: flex; gap: 10px; max-width: 82%; }
        .ws-msg-ai-avatar {
          width: 30px; height: 30px;
          border-radius: var(--ds-radius-sm);
          background: var(--ds-surface-cnt);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .ws-msg-ai-avatar .material-symbols-outlined { font-size: 14px; color: var(--ds-primary); }
        .ws-msg-ai-bubble {
          background: var(--ds-surface-low);
          border-radius: 0 var(--ds-radius-lg) var(--ds-radius-lg) var(--ds-radius-lg);
          padding: 14px 16px;
          font-size: 13px; line-height: 1.65;
          color: var(--ds-on-surface);
        }
        .ws-msg-ai-bubble strong { font-weight: 700; color: var(--ds-primary); }

        .ws-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .ws-suggestion-chip {
          font-size: 12px; font-weight: 600;
          padding: 7px 14px;
          border-radius: 999px;
          background: var(--ds-surface-white);
          border: 1px solid var(--ds-outline-var);
          color: var(--ds-on-surface);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .ws-suggestion-chip:hover {
          background: var(--ds-primary);
          border-color: var(--ds-primary);
          color: white;
        }

        /* User message */
        .ws-msg-user { display: flex; justify-content: flex-end; }
        .ws-msg-user-inner { max-width: 82%; }
        .ws-msg-user-bubble {
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          color: var(--ds-on-primary);
          border-radius: var(--ds-radius-lg) 0 var(--ds-radius-lg) var(--ds-radius-lg);
          padding: 14px 16px;
          font-size: 13px; line-height: 1.65;
          box-shadow: 0 4px 16px rgba(77,68,227,0.22);
        }
        .ws-msg-user-time {
          text-align: right;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--ds-outline);
          margin-top: 6px;
        }

        /* Typing indicator */
        .ws-msg-typing { display: flex; gap: 10px; align-items: flex-end; }
        .ws-typing-bubble {
          display: flex; align-items: center; gap: 5px;
          background: var(--ds-surface-low);
          border-radius: 0 var(--ds-radius-lg) var(--ds-radius-lg) var(--ds-radius-lg);
          padding: 14px 18px;
        }
        .ws-typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ds-primary);
          animation: bounce 1.2s ease-in-out infinite;
        }
        .ws-typing-dot:nth-child(2) { animation-delay: 0.18s; }
        .ws-typing-dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        /* Input bar */
        .ws-input-wrap {
          padding: 14px 16px 16px;
          background: var(--ds-surface-white);
          border-top: 1px solid var(--ds-surface-cnt-high);
          flex-shrink: 0;
        }
        .ws-input-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--ds-surface-low);
          border: 1.5px solid var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-lg);
          padding: 6px 6px 6px 12px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ws-input-bar:focus-within {
          border-color: var(--ds-primary);
          box-shadow: 0 0 0 3px rgba(77,68,227,0.08);
        }
        .ws-input-bar input {
          flex: 1; border: none; background: transparent;
          font-size: 13px; font-family: 'Inter', sans-serif;
          color: var(--ds-on-surface); outline: none;
          padding: 5px 2px;
        }
        .ws-input-bar input::placeholder { color: var(--ds-outline-var); }
        .ws-attach-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: var(--ds-radius-sm);
          background: none; border: none; cursor: pointer;
          color: var(--ds-outline);
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .ws-attach-btn:hover { background: var(--ds-surface-cnt); color: var(--ds-on-surface); }
        .ws-attach-btn .material-symbols-outlined { font-size: 18px; }
        .ws-send-btn {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: var(--ds-radius-md);
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(77,68,227,0.25);
          transition: opacity 0.15s, transform 0.1s;
        }
        .ws-send-btn:hover { opacity: 0.9; }
        .ws-send-btn:active { transform: scale(0.94); }
        .ws-send-btn .material-symbols-outlined { font-size: 18px; }

        .ws-input-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 4px 0;
        }
        .ws-input-actions { display: flex; gap: 16px; }
        .ws-input-action {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          color: var(--ds-outline);
          cursor: pointer;
          transition: color 0.15s;
          background: none; border: none;
        }
        .ws-input-action:hover { color: var(--ds-on-surface); }
        .ws-input-action .material-symbols-outlined { font-size: 14px; }
        .ws-model-tag { display: flex; align-items: center; gap: 6px; }
        .ws-model-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--ds-outline);
        }
        .ws-model-dot {
          width: 7px; height: 7px;
          border-radius: 50%; background: #10b981;
        }

        /* ── Refinement View ────────────────────────────── */
        .ws-refinement-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          padding-bottom: 80px; /* Space for Save & Proceed */
        }
        .ws-integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .ws-integration-card {
          background: var(--ds-surface-white);
          border-radius: var(--ds-radius-lg);
          box-shadow: var(--ds-shadow-card);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          overflow: hidden;
          border: 1px solid transparent;
        }
        .ws-integration-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--ds-shadow-soft);
        }
        .ws-integration-card.expanded {
          grid-column: 1 / -1;
          cursor: default;
        }
        .ws-integration-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
        }
        .ws-integration-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ws-integration-logo {
          width: 48px;
          height: 48px;
          border-radius: var(--ds-radius-md);
          background: var(--ds-surface-low);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ws-integration-logo img {
          width: 28px;
          height: 28px;
          object-fit: contain;
        }
        .ws-integration-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--ds-on-surface);
        }
        .ws-integration-desc {
          font-size: 12px;
          color: var(--ds-on-surface-var);
          margin-top: 2px;
        }
        .ws-integration-status {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ds-outline);
        }
        .ws-integration-content {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid var(--ds-surface-cnt-high);
          background: var(--ds-surface-low);
        }
        .ws-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .ws-form-label {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 12px;
          color: var(--ds-on-surface);
        }
        .ws-form-input {
          background: var(--ds-surface-white);
          border: 1.5px solid var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-md);
          padding: 10px 14px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          color: var(--ds-on-surface);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ws-form-input:focus {
          border-color: var(--ds-primary);
          box-shadow: 0 0 0 3px rgba(77,68,227,0.08);
        }
        .ws-security-banner {
          background: var(--ds-primary-container);
          border-radius: var(--ds-radius-lg);
          padding: 18px 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 8px;
        }
        .ws-security-icon {
          color: var(--ds-primary);
          font-variation-settings: 'FILL' 1;
        }
        .ws-security-text {
          font-size: 13px;
          line-height: 1.5;
          color: var(--ds-on-primary-cnt);
        }
        .ws-security-text strong {
          font-weight: 700;
        }

        .ws-proceed-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--ds-surface-cnt-high);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 28px;
          z-index: 10;
        }
        .ws-save-btn {
          padding: 12px 24px;
          border-radius: var(--ds-radius-md);
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          color: var(--ds-on-primary);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(77,68,227,0.25);
          transition: transform 0.2s, opacity 0.2s;
        }
        .ws-save-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        /* ── Deployment View Styles ──────────────────────── */
        .dp-root {
          display: flex;
          gap: 20px;
          height: 100%;
          padding: 20px;
        }
        .dp-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 6;
          min-width: 0;
          overflow-y: auto;
          padding-right: 4px;
        }
        .dp-right-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 4;
          min-width: 0;
          overflow-y: auto;
          padding-right: 4px;
        }

        /* General Card */
        .dp-card {
          background: var(--ds-surface-white);
          border-radius: var(--ds-radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid var(--ds-surface-cnt-high2);
          box-shadow: var(--ds-shadow-card);
        }
        .dp-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .dp-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: var(--ds-on-surface);
        }
        .dp-card-subtitle {
          font-size: 13px;
          color: var(--ds-outline);
          margin-top: 4px;
        }

        /* Preview Card */
        .dp-preview-card {
          flex: 1; /* Allow it to grow */
          min-height: 480px;
        }
        .dp-live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #fdf2f8; /* Pinkish for sandbox */
          color: #be185d;
          border-radius: var(--ds-radius-md);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .dp-live-dot {
          width: 6px;
          height: 6px;
          background: #be185d;
          border-radius: 50%;
        }

        /* Browser Frame */
        .dp-browser-frame {
          border: 1px solid var(--ds-surface-cnt-high);
          border-radius: var(--ds-radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .dp-browser-chrome {
          height: 36px;
          background: var(--ds-surface-low);
          border-bottom: 1px solid var(--ds-surface-cnt-high);
          display: flex;
          align-items: center;
          padding: 0 16px;
          justify-content: space-between;
        }
        .dp-browser-dots {
          display: flex;
          gap: 6px;
          width: 60px;
        }
        .dp-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dp-dot-red { background: #ff5f56; }
        .dp-dot-yellow { background: #ffbd2e; }
        .dp-dot-green { background: #27c93f; }
        .dp-browser-url {
          background: var(--ds-surface-white);
          padding: 4px 16px;
          border-radius: var(--ds-radius-sm);
          font-size: 12px;
          color: var(--ds-on-surface-var);
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--ds-surface-cnt-high);
          flex: 1;
          max-width: 300px;
          justify-content: center;
        }

        /* Website Mock */
        .dp-website-mock {
          background: #fafafa;
          flex: 1;
          padding: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 40px;
          overflow: hidden;
        }
        .dp-mock-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dp-mock-logo {
          width: 100px;
          height: 20px;
          background: #e5e7eb;
          border-radius: 4px;
        }
        .dp-mock-nav-links {
          display: flex;
          gap: 16px;
        }
        .dp-mock-link {
          width: 60px;
          height: 12px;
          background: #e5e7eb;
          border-radius: 4px;
        }
        .dp-mock-hero {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          text-align: center;
          margin-top: 40px;
        }
        .dp-mock-line {
          background: #d1d5db;
          border-radius: 6px;
          height: 24px;
        }
        .dp-mock-line-lg { width: 60%; }
        .dp-mock-line-md { width: 40%; }
        .dp-mock-line-sm { width: 25%; height: 16px; background: #e5e7eb; }
        
        .dp-mock-grid {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
        }
        .dp-mock-card-placeholder {
          width: 200px;
          height: 140px;
          background: #e5e7eb;
          border-radius: 8px;
        }

        /* Chat Demo components */
        .dp-chat-trigger {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background: var(--ds-primary);
          color: white;
          border: none;
          border-radius: 30px;
          height: 52px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(77, 68, 227, 0.3);
          transition: transform 0.2s;
        }
        .dp-chat-trigger:hover {
          transform: translateY(-2px);
        }
        .dp-chat-trigger-label {
          font-weight: 600;
          font-size: 14px;
          padding-right: 8px;
        }
        
        .dp-chat-demo {
          position: absolute;
          bottom: 90px;
          right: 24px;
          width: 340px;
          height: 440px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--ds-surface-cnt-high);
          z-index: 100;
        }
        .dp-chat-demo-header {
          padding: 16px;
          background: var(--ds-primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dp-chat-demo-agent {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dp-chat-demo-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .dp-chat-demo-name {
          font-weight: 600;
          font-size: 14px;
        }
        .dp-chat-demo-status {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
        }
        .dp-chat-demo-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.8;
        }
        .dp-chat-demo-close:hover { opacity: 1; }
        
        .dp-chat-demo-body {
          flex: 1;
          padding: 16px;
          background: #f9fafb;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dp-chat-msg {
          display: flex;
        }
        .dp-chat-msg-user { justify-content: flex-end; }
        .dp-chat-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
        }
        .dp-chat-bubble-ai {
          background: white;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .dp-chat-bubble-user {
          background: var(--ds-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .dp-chat-demo-input {
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dp-chat-demo-input input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }
        .dp-chat-send-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--ds-primary);
          color: white;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .dp-chat-send-btn .material-symbols-outlined { font-size: 18px; }

        /* Sandbox Box */
        .dp-sandbox-card {
          flex: 1;
        }
        .dp-run-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--ds-surface-low);
          border: 1px solid var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-md);
          font-weight: 600;
          font-size: 13px;
          color: var(--ds-on-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .dp-run-btn:hover:not(:disabled) {
          background: var(--ds-surface-cnt);
        }
        .dp-run-btn.dp-running {
          background: var(--ds-primary-container);
          color: var(--ds-primary);
          border-color: var(--ds-primary-container);
          cursor: default;
        }
        .dp-run-btn .material-symbols-outlined {
          font-size: 18px;
        }
        
        .dp-status-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .dp-status-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
        .dp-status-chip .material-symbols-outlined { font-size: 14px; }
        .dp-status-pass {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #d1fae5;
        }
        .dp-status-neutral {
          background: var(--ds-surface-low);
          color: var(--ds-on-surface-var);
          border: 1px solid var(--ds-surface-cnt-high);
        }

        .dp-console {
          background: #0d1117; /* Dark theme for console */
          border-radius: var(--ds-radius-md);
          padding: 16px;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 12px;
          height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dp-console::-webkit-scrollbar {
          width: 8px;
        }
        .dp-console::-webkit-scrollbar-track {
          background: transparent;
        }
        .dp-console::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .dp-log-line {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          line-height: 1.4;
        }
        .dp-log-time {
          color: #8b949e;
          min-width: 60px;
        }
        .dp-log-badge {
          font-weight: 700;
          font-size: 10px;
          min-width: 60px;
          text-align: center;
          padding: 1px 4px;
          border-radius: 4px;
        }
        .dp-log-badge-info { background: #1f3a5f; color: #58a6ff; }
        .dp-log-badge-success { background: #133a25; color: #3fb950; }
        .dp-log-badge-warn { background: #4d3a0f; color: #d29922; }
        .dp-log-msg { color: #c9d1d9; word-break: break-all; }
        .dp-log-blink { animation: dp-pulse 2s infinite; }
        @keyframes dp-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        /* Integration Code Block */
        .dp-code-card { flex: 1; }
        .dp-code-tabs {
          display: flex;
          gap: 2px;
          background: var(--ds-surface-low);
          padding: 4px;
          border-radius: var(--ds-radius-md);
        }
        .dp-code-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: none;
          background: transparent;
          font-weight: 600;
          font-size: 13px;
          color: var(--ds-on-surface-var);
          border-radius: calc(var(--ds-radius-md) - 2px);
          cursor: pointer;
          transition: all 0.2s;
        }
        .dp-code-tab .material-symbols-outlined { font-size: 18px; }
        .dp-code-tab:hover { color: var(--ds-on-surface); }
        .dp-code-tab.active {
          background: var(--ds-surface-white);
          color: var(--ds-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .dp-code-block {
          background: #0d1117;
          border-radius: var(--ds-radius-md);
          overflow: hidden;
          position: relative;
        }
        .dp-code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .dp-code-lang {
          font-size: 12px;
          color: #8b949e;
          font-weight: 600;
          text-transform: uppercase;
        }
        .dp-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: #c9d1d9;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dp-copy-btn:hover { background: rgba(255,255,255,0.2); color: white; }
        .dp-copy-btn .material-symbols-outlined { font-size: 14px; }
        
        .dp-code-pre {
          padding: 16px;
          margin: 0;
          overflow-x: auto;
          color: #e6edf3;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .dp-code-note {
          display: flex;
          gap: 10px;
          padding: 12px;
          background: var(--ds-secondary-cnt);
          border-radius: var(--ds-radius-sm);
          color: var(--ds-on-secondary-cnt);
          font-size: 13px;
          line-height: 1.5;
        }
        .dp-code-note .material-symbols-outlined { font-size: 18px; color: var(--ds-primary); }

        /* Health Check Card */
        .dp-verify-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--ds-surface-white);
          border: 1px solid var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-sm);
          font-weight: 600;
          font-size: 12px;
          color: var(--ds-on-surface);
          cursor: pointer;
        }
        .dp-verify-btn .material-symbols-outlined { font-size: 14px; }
        .dp-verify-btn:hover { background: var(--ds-surface-low); }

        .dp-health-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dp-health-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dp-health-icon { font-size: 20px; }
        .dp-health-pass { color: #059669; }
        .dp-health-label {
          font-size: 14px;
          color: var(--ds-on-surface);
        }

        /* Go Live Card */
        .dp-golive-card {
          background: linear-gradient(to right, rgba(77, 68, 227, 0.03), rgba(77, 68, 227, 0.08));
          border-color: var(--ds-primary-container);
        }
        .dp-golive-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .dp-golive-icon {
          font-size: 32px;
          color: var(--ds-primary);
          background: white;
          padding: 8px;
          border-radius: var(--ds-radius-md);
          box-shadow: 0 4px 12px rgba(77, 68, 227, 0.15);
        }
        
        .dp-domain-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dp-domain-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--ds-on-surface);
        }
        .dp-domain-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--ds-surface-white);
          border: 1px solid var(--ds-surface-cnt-high2);
          border-radius: var(--ds-radius-md);
          padding: 0 12px;
          height: 44px;
        }
        .dp-domain-input-wrap:focus-within {
          border-color: var(--ds-primary);
          box-shadow: 0 0 0 3px rgba(77,68,227,0.1);
        }
        .dp-domain-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: var(--ds-on-surface);
        }
        
        .dp-deploy-production-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background: linear-gradient(145deg, var(--ds-primary) 0%, var(--ds-primary-dim) 100%);
          color: white;
          border: none;
          border-radius: var(--ds-radius-md);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(77, 68, 227, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dp-deploy-production-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(77, 68, 227, 0.4);
        }
        
        .dp-deploy-warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--ds-on-surface-var);
          line-height: 1.5;
        }
        .dp-deploy-warning .material-symbols-outlined {
          font-size: 16px;
          color: #d29922;
        }

      ` }} />

      {/* ─────────────── LAYOUT ─────────────────────────── */}
      <div className="ws-root">

        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="ws-sidebar">
          {/* Brand */}
          <div className="ws-brand">
            <div className="ws-brand-icon">
              <span className="material-symbols-outlined">deployed_code</span>
            </div>
            <div>
              <div className="ws-brand-name">{business?.name || 'Studio'}</div>
              <div className="ws-brand-version">v1.2.0-beta</div>
            </div>
          </div>

          {/* CTA */}
          <button className="ws-new-btn">
            <span className="material-symbols-outlined">add</span>
            New Agent
          </button>

          {/* Nav */}
          <nav className="ws-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`ws-nav-item${item.active ? " active" : ""}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer nav */}
          <div className="ws-nav-footer">
            <button className="ws-nav-item">
              <span className="material-symbols-outlined">help</span>
              Help
            </button>
            <button className="ws-nav-item">
              <span className="material-symbols-outlined">chat_bubble</span>
              Feedback
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────── */}
        <div className="ws-main">

          {/* Topbar */}
          <header className="ws-topbar">
            <div className="ws-topbar-left">
              <span className="ws-topbar-brand">Setup Workspace</span>
            </div>
            <nav className="ws-stages">
              <button 
                className={`ws-stage-item ${activeStage === 'Analysis' ? "active" : ""}`}
                onClick={() => setActiveStage('Analysis')}
              >
                <span className="ws-stage-dot" />
                <span className="ws-stage-label">Analysis</span>
              </button>
              <button 
                className={`ws-stage-item ${activeStage === 'Refinement' ? "active" : ""}`}
                onClick={() => setActiveStage('Refinement')}
              >
                <span className="ws-stage-dot" />
                <span className="ws-stage-label">Refinement</span>
              </button>
              <button 
                className={`ws-stage-item ${activeStage === 'Deployment' ? "active" : ""}`}
                onClick={() => setActiveStage('Deployment')}
              >
                <span className="ws-stage-dot" />
                <span className="ws-stage-label">Deployment</span>
              </button>
            </nav>

            <div className="ws-topbar-right">
              <button className="ws-topbar-docs">Docs</button>
              <div className="ws-divider" />
              <div className="flex items-center gap-3 pr-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-semibold text-gray-800 leading-none">{user?.full_name || 'User'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{user?.email}</p>
                </div>
                <img
                  className="ws-avatar"
                  alt="User"
                  src={`https://ui-avatars.com/api/?name=${user?.full_name || 'U'}&background=4d44e3&color=fff`}
                  onClick={() => api.logout()}
                  title="Logout"
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="ws-content">
            {activeStage === 'Analysis' && (
              <div className="ws-canvas">
                {/* ── Left: Knowledge + Engine ───────────── */}
                <div className="ws-left-col">
                  {/* Knowledge Core card */}
                  <div className="ws-card ws-knowledge-card">
                    <div className="ws-card-header">
                      <div>
                        <div className="ws-card-title">Knowledge Core</div>
                        <div className="ws-card-subtitle">Inject raw context for your agents.</div>
                      </div>
                      <div className="ws-card-header-icon">
                        <span className="material-symbols-outlined">database</span>
                      </div>
                    </div>

                    {/* Drop zone */}
                    <div className="ws-drop-zone">
                      <div className="ws-drop-icon-wrap">
                        <span className="material-symbols-outlined">upload_file</span>
                      </div>
                      <div className="ws-drop-title">Drop source files</div>
                      <div className="ws-drop-sub">PDF, TXT, or JSON files up to 50 MB</div>
                      <button className="ws-drop-browse">Browse local storage</button>
                    </div>

                    {/* File list */}
                    <div className="ws-file-list">
                      <div className="ws-file-list-label">Current Indexing</div>
                      {INDEXED_FILES.map((f) => (
                        <div key={f.name} className="ws-file-item">
                          <div className="ws-file-left">
                            <span className="material-symbols-outlined">{f.icon}</span>
                            <span className="ws-file-name">{f.name}</span>
                          </div>
                          <span
                            className="ws-file-badge"
                            style={{ background: f.statusBg, color: f.statusColor }}
                          >
                            {f.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right: Chat ────────────────────────── */}
                <div className="ws-right-col">
                  <div className="ws-card ws-chat-card">
                    {/* Chat header */}
                    <div className="ws-chat-header">
                      <div className="ws-chat-agent">
                        <div className="ws-chat-agent-icon">
                          <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                          <div className="ws-chat-agent-name">Architect Assistant</div>
                          <div className="ws-chat-agent-status">Ready to configure your environment</div>
                        </div>
                      </div>
                      <div className="ws-chat-actions">
                        <button className="ws-icon-btn">
                          <span className="material-symbols-outlined">history</span>
                        </button>
                        <button className="ws-icon-btn">
                          <span className="material-symbols-outlined">settings_suggest</span>
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="ws-messages">
                      <div className="ws-msg-ai">
                        <div className="ws-msg-ai-avatar">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div>
                          <div className="ws-msg-ai-bubble">
                            Hello! I've analyzed your project directory. It looks like you're building a{" "}
                            <strong>Node.js microservice architecture</strong>. I've identified{" "}
                            <strong>4 potential deployment targets</strong>. Should we prioritize the{" "}
                            <strong>Staging environment</strong> first?
                          </div>
                          <div className="ws-suggestions">
                            <button className="ws-suggestion-chip">Yes, start with Staging</button>
                            <button className="ws-suggestion-chip">Let&apos;s do Production</button>
                            <button className="ws-suggestion-chip">Help me choose</button>
                          </div>
                        </div>
                      </div>
                      <div className="ws-msg-user">
                        <div className="ws-msg-user-inner">
                          <div className="ws-msg-user-bubble">
                            Let&apos;s go with Staging. Also, I need to make sure the agent has access to
                            the PostgreSQL schema I just uploaded on the left.
                          </div>
                          <div className="ws-msg-user-time">Just now</div>
                        </div>
                      </div>
                      <div className="ws-msg-typing">
                        <div className="ws-msg-ai-avatar">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <div className="ws-typing-bubble">
                          <span className="ws-typing-dot" />
                          <span className="ws-typing-dot" />
                          <span className="ws-typing-dot" />
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="ws-input-wrap">
                      <div className="ws-input-bar">
                        <button className="ws-attach-btn">
                          <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <input placeholder="Message Architect…" type="text" />
                        <button className="ws-send-btn">
                          <span className="material-symbols-outlined">arrow_upward</span>
                        </button>
                      </div>
                      <div className="ws-input-footer">
                        <div className="ws-input-actions">
                          <button className="ws-input-action">
                            <span className="material-symbols-outlined">tips_and_updates</span>
                            View Suggestions
                          </button>
                          <button className="ws-input-action">
                            <span className="material-symbols-outlined">terminal</span>
                            Run Command
                          </button>
                        </div>
                        <div className="ws-model-tag">
                          <span className="ws-model-label">GPT-4 Turbo</span>
                          <span className="ws-model-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'Refinement' && (
              <div className="ws-refinement-view">
                <div className="ws-security-banner">
                  <span className="material-symbols-outlined ws-security-icon">verified_user</span>
                  <div className="ws-security-text">
                    <strong>Secure Data Isolation:</strong> All API credentials and environment secrets are stored in a 
                    separate, encrypted database vault. These keys are used exclusively for middleware orchestration 
                    and are <strong>never shared with or accessible to AI agents</strong>.
                  </div>
                </div>

                <div className="ws-integration-grid">
                  {[
                    { id: 'razorpay', name: 'Razorpay', desc: 'Accept payments and manage subscriptions.', icon: 'https://cdn.worldvectorlogo.com/logos/razorpay.svg' },
                    { id: 'supabase', name: 'Supabase', desc: 'Secure database and user authentication.', icon: 'https://cdn.worldvectorlogo.com/logos/supabase.svg' },
                    { id: 'zoom', name: 'Zoom', desc: 'Automate meeting scheduling and webinars.', icon: 'https://cdn.worldvectorlogo.com/logos/zoom-communications.svg' },
                    { id: 'stripe', name: 'Stripe', desc: 'Global payment infrastructure for scaling.', icon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg' },
                    { id: 'twilio', name: 'Twilio', desc: 'SMS and communication channel management.', icon: 'https://cdn.worldvectorlogo.com/logos/twilio.svg' },
                  ].map((service) => {
                    const apiKeyName = `${service.name} API Key`;
                    const isConnected = !!vaultEntries[apiKeyName];
                    const isExpanded = expandedCard === service.id;
                    const inputs = vaultInputs[service.id] || { apiKey: '', secretKey: '', url: '' };
                    const isSaving = vaultSaving[service.id];
                    const isSuccess = vaultSuccess[service.id];
                    const errMsg = vaultError[service.id];

                    return (
                    <div 
                      key={service.id} 
                      className={`ws-integration-card ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => !isExpanded && setExpandedCard(service.id)}
                    >
                      <div className="ws-integration-header">
                        <div className="ws-integration-info">
                          <div className="ws-integration-logo">
                            <img src={service.icon} alt={service.name} />
                          </div>
                          <div>
                            <div className="ws-integration-name">{service.name}</div>
                            <div className="ws-integration-desc">{service.desc}</div>
                          </div>
                        </div>
                        <div className="ws-integration-status">
                          {isExpanded ? (
                            <button 
                              className="ws-icon-btn" 
                              onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}
                            >
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          ) : isConnected ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '11px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              Connected
                            </span>
                          ) : (
                            <span style={{ color: 'var(--ds-outline)', fontSize: '11px', fontWeight: 600 }}>Disconnected</span>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="ws-integration-content">
                          {/* Error */}
                          {errMsg && (
                            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--ds-radius-md)', color: '#dc2626', fontSize: '12px', marginTop: '12px' }}>
                              {errMsg}
                            </div>
                          )}
                          {/* Success */}
                          {isSuccess && (
                            <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--ds-radius-md)', color: '#059669', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              Keys saved securely to vault!
                            </div>
                          )}
                          <div className="ws-form-group">
                            <label className="ws-form-label">{service.name} API Key</label>
                            <input
                              className="ws-form-input"
                              type="password"
                              placeholder={`Enter your ${service.name} API Key`}
                              value={inputs.apiKey}
                              onChange={(e) => setVaultInputs(prev => ({ ...prev, [service.id]: { ...inputs, apiKey: e.target.value } }))}
                            />
                          </div>
                          <div className="ws-form-group">
                            <label className="ws-form-label">{service.name} Secret Key</label>
                            <input
                              className="ws-form-input"
                              type="password"
                              placeholder={`Enter your ${service.name} Secret Key`}
                              value={inputs.secretKey}
                              onChange={(e) => setVaultInputs(prev => ({ ...prev, [service.id]: { ...inputs, secretKey: e.target.value } }))}
                            />
                          </div>
                          {service.id === 'supabase' && (
                            <div className="ws-form-group">
                              <label className="ws-form-label">Supabase URL</label>
                              <input
                                className="ws-form-input"
                                type="text"
                                placeholder="https://xyz.supabase.co"
                                value={inputs.url || ''}
                                onChange={(e) => setVaultInputs(prev => ({ ...prev, [service.id]: { ...inputs, url: e.target.value } }))}
                              />
                            </div>
                          )}
                          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                            <button
                              className="ws-deploy-btn"
                              style={{ flex: 1, opacity: isSaving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                              onClick={(e) => { e.stopPropagation(); handleVaultSave(service.id, service.name); }}
                              disabled={isSaving || !inputs.apiKey?.trim()}
                            >
                              {isSaving ? (
                                <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Saving…</>
                              ) : isSuccess ? (
                                <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> Saved!</>
                              ) : (
                                <>Connect {service.name}</>
                              )}
                            </button>
                            <button className="ws-topbar-docs" onClick={() => setExpandedCard(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );})}
                </div>

                <div className="ws-proceed-bar">
                  <button className="ws-save-btn" onClick={() => setActiveStage('Deployment')}>
                    Save and Proceed
                  </button>
                </div>
              </div>
            )}

            {activeStage === 'Deployment' && (
              <DeploymentView
                setIsChatOpen={setIsChatOpen}
                sandboxLogs={sandboxLogs}
                setSandboxLogs={setSandboxLogs}
                embedCode={realEmbedCode}
                apiCode={realApiCode}
                reactCode={realReactCode}
                agentId={agentId}
                businessName={business?.name}
                agentStatus={business?.agent_status}
              />
            )}
          </div>{/* /content */}
        </div>{/* /main */}
      </div>{/* /root */}
    </>
  );
}
