import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  MessageSquare,
  Calendar,
  Library,
  Award,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { logout } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function StudentNav({ isOpen, currentSection, onNavigate, onClose, student }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'journey', label: 'My Journey', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'mentor', label: 'Mentor Chat', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleNavigate = (sectionId) => {
    onNavigate(sectionId);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-64 flex-col"
        style={{
          backgroundColor: 'var(--dashboard-bg-secondary)',
          borderRightColor: 'var(--dashboard-border)',
          borderRightWidth: '1px',
        }}
      >
        {/* Profile Section */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {student?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: 'var(--dashboard-text)' }}>
                {student?.name || 'Student'}
              </p>
              <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {student?.college || 'College'}
              </p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
            {student?.targetRole || 'Target Role'} • {student?.id || 'ID'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group"
                style={{
                  backgroundColor: isActive ? 'var(--dashboard-border)' : 'transparent',
                  color: isActive ? '#FF9500' : 'var(--dashboard-text-secondary)',
                }}
                whileHover={{ x: 4 }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1 h-6 rounded-r-full"
                    style={{ backgroundColor: '#FF9500' }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="px-4 pb-8 pt-4 space-y-2 border-t" style={{ borderColor: 'var(--dashboard-border)' }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/5"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            <Settings size={18} />
            <span className="text-sm font-medium flex-1 text-left">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-500/10"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium flex-1 text-left">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed left-0 top-0 z-50 w-64 h-screen flex flex-col lg:hidden"
        style={{
          backgroundColor: 'var(--dashboard-bg-secondary)',
        }}
      >
        {/* Profile Section */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {student?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: 'var(--dashboard-text)' }}>
                {student?.name || 'Student'}
              </p>
              <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
                {student?.college || 'College'}
              </p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--dashboard-text-secondary)' }}>
            {student?.targetRole || 'Target Role'} • {student?.id || 'ID'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--dashboard-border)' : 'transparent',
                  color: isActive ? '#FF9500' : 'var(--dashboard-text-secondary)',
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="px-4 pb-8 pt-4 space-y-2 border-t" style={{ borderColor: 'var(--dashboard-border)' }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/5"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            <Settings size={18} />
            <span className="text-sm font-medium flex-1 text-left">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-500/10"
            style={{ color: 'var(--dashboard-text-secondary)' }}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium flex-1 text-left">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
