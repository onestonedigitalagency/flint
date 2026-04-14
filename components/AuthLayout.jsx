// src/components/AuthLayout.jsx
import Navbar from "./Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#09090f] relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-25%] left-[50%] translate-x-[-50%] w-[800px] h-[600px] rounded-full bg-violet-600/[0.05] blur-[150px] animate-float-1" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[120px] animate-float-2" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.03] blur-[120px] animate-float-3" />
        <div className="absolute inset-0 grid-pattern animate-pulse-subtle" />
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_0%,#09090f_100%)]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-60px)] px-4 py-10 sm:py-16">
        <div className="w-full max-w-[420px] animate-fade-in-up">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-600">© 2024 FLINT Technologies, Inc.</span>
            </div>
            <div className="flex items-center gap-5">
              {["Privacy", "Terms", "Security", "Status"].map((link) => (
                <a key={link} href="#" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;