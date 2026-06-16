import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import StudentNav from './StudentNav';

export default function StudentLayout({ children, currentSection, onNavigate, student }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: 'var(--dashboard-bg)',
        color: 'var(--dashboard-text)',
      }}
    >
      {/* Sidebar */}
      <StudentNav
        isOpen={sidebarOpen}
        currentSection={currentSection}
        onNavigate={onNavigate}
        onClose={() => setSidebarOpen(false)}
        student={student}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl border-b"
          style={{
            borderBottomColor: 'var(--dashboard-border)',
            backgroundColor: 'var(--dashboard-bg)',
            opacity: 0.95,
          }}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left: Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex-1 flex items-center justify-between lg:justify-end gap-4">
              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="relative p-2 rounded-lg hover:bg-white/5 transition"
                  type="button"
                >
                  <Bell size={18} className="text-white/60" />
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#FF9500' }}
                  />
                </button>

                {/* Student Profile */}
                <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: 'var(--dashboard-border)' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {student?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">{student?.name || 'Student'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
