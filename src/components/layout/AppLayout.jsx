import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../../context/LanguageContext';

const navItems = [
  { path: '/', icon: '🏠', key: 'dashboard' },
  { path: '/voice', icon: '🎤', key: 'voice' },
  { path: '/crop-doctor', icon: '🌿', key: 'cropDoctor' },
  { path: '/schemes', icon: '📋', key: 'schemes' },
  { path: '/mandi', icon: '📊', key: 'mandi' },
  { path: '/sell', icon: '🏛️', key: 'sell' },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { t, lang, toggleLang } = useLang();

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-secondary/20 shadow-soft">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-heading font-bold">T</span>
            </div>
            <span className="font-heading font-bold text-primary text-lg">Terra</span>
          </Link>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 bg-surface-2 border border-secondary/40 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-primary/30 transition-all"
          >
            <span>{lang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
            <span className="text-text-secondary/40">|</span>
            <span className="text-primary">{lang === 'hi' ? 'EN' : 'हि'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-secondary/20 shadow-strong">
        <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 flex-1"
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-primary' : 'hover:bg-surface-2'
                }`}>
                  <span className="text-lg leading-none">{item.icon}</span>
                </div>
                <span className={`text-[10px] font-medium truncate w-full text-center transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}>
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
