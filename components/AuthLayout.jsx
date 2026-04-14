// src/components/AuthLayout.jsx
import Navbar from "./Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.07] blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.05] blur-[120px] animate-float-delayed" />
        <div className="absolute top-[30%] right-[15%] w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-rose-500/[0.03] blur-[100px] animate-float-delayed" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none grid-bg" />

      {/* Radial Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_70%)]" />

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 sm:py-16">
        <div className="w-full max-w-md animate-fade-in-up">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2024 FLINT. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Support"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;