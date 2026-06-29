import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { getWeather, getWeatherIcon } from '../utils/weather';
import { getWeatherRecommendations } from '../utils/gemini';

const quickActions = [
  { path: '/voice', icon: '🎤', key: 'voice', color: '#2D5A4A', bg: '#EBF2EF' },
  { path: '/crop-doctor', icon: '🌿', key: 'cropDoctor', color: '#4F7C59', bg: '#EDF4EF' },
  { path: '/schemes', icon: '📋', key: 'schemes', color: '#C86B3C', bg: '#FBF2ED' },
  { path: '/mandi', icon: '📊', key: 'mandi', color: '#1E3D32', bg: '#E8EEE' },
  { path: '/sell', icon: '🏛️', key: 'sell', color: '#8B6914', bg: '#F9F5E8' },
];

function getGreeting(lang) {
  const h = new Date().getHours();
  if (lang === 'hi') {
    if (h < 12) return 'सुप्रभात';
    if (h < 17) return 'नमस्कार';
    return 'शुभ संध्या';
  }
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const { t, lang } = useLang();
  const [profile] = useState(() => JSON.parse(localStorage.getItem('terra_profile') || '{}'));
  const [weather, setWeather] = useState(null);
  const [aiTip, setAiTip] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    async function load() {
      setLoadingWeather(true);
      const w = await getWeather(profile.district || 'Gaya');
      setWeather(w);
      setLoadingWeather(false);

      if (w) {
        setLoadingTip(true);
        const tip = await getWeatherRecommendations(w, lang);
        setAiTip(tip);
        setLoadingTip(false);
      }
    }
    load();
  }, [lang, profile.district]);

  const date = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-2xl p-5 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
        <div className="relative">
          <p className="text-white/70 text-sm">{date}</p>
          <h1 className="font-heading font-bold text-2xl mt-1">
            {getGreeting(lang)}, {profile.name || 'किसान'}! 🌾
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {profile.village && `${profile.village}, `}{profile.district || 'Bihar'} · {profile.primaryCrop || 'खेतीबाड़ी'}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold text-text-primary">{t('todayWeather')}</h2>
          <Link to="/voice" className="text-xs text-primary font-medium">
            {lang === 'hi' ? 'पूछें →' : 'Ask →'}
          </Link>
        </div>

        {loadingWeather ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-heading font-bold text-text-primary">{weather.temp}°</span>
                  <span className="text-text-secondary mb-2">C</span>
                </div>
                <p className="text-text-secondary text-sm capitalize">{weather.description}</p>
                <p className="text-xs text-text-secondary/70 mt-0.5">{weather.city}</p>
                {weather.isMock && (
                  <p className="text-xs text-warning/80 mt-1">⚠️ {lang === 'hi' ? 'नमूना डेटा' : 'Sample data'}</p>
                )}
              </div>
              <span className="text-5xl">{getWeatherIcon(weather.main)}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-secondary/20">
              {[
                { label: t('humidity'), value: `${weather.humidity}%`, icon: '💧' },
                { label: t('wind'), value: `${weather.windSpeed} km/h`, icon: '💨' },
                { label: t('feelsLike'), value: `${weather.feelsLike}°C`, icon: '🌡️' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {(aiTip || loadingTip) && (
          <div className="mt-4 pt-4 border-t border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
              <span className="text-xs font-semibold text-primary">{t('aiRecommendations')}</span>
            </div>
            {loadingTip ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-3 bg-surface-2 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{aiTip}</p>
            )}
          </div>
        )}
      </motion.div>

      <div>
        <h2 className="font-heading font-semibold text-text-primary mb-3">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Link
                to={action.path}
                className="block bg-surface rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all active:scale-95 border border-secondary/10"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: action.bg }}
                >
                  <span className="text-xl">{action.icon}</span>
                </div>
                <p className="font-heading font-semibold text-sm text-text-primary">{t(action.key)}</p>
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/voice"
              className="block bg-primary rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-xl">🤖</span>
              </div>
              <p className="font-heading font-semibold text-sm text-white">
                {lang === 'hi' ? 'Terra से पूछें' : 'Ask Terra'}
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
