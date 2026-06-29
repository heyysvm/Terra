import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { mandiPrices } from '../data/mandiData';
import { getMandiAnalysis } from '../utils/gemini';

function PriceCard({ item, index }) {
  const { lang } = useLang();
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const diff = item.price - item.msp;
  const isAbove = diff > 0;
  const isAt = diff === 0;

  const handleAI = async () => {
    if (aiText) { setOpen(o => !o); return; }
    setLoading(true);
    setOpen(true);
    const res = await getMandiAnalysis(item.crop, item.price, lang);
    setAiText(res);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-heading font-bold text-text-primary">
              {lang === 'hi' ? item.crop : item.cropEn}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isAt
                  ? 'bg-blue-50 text-blue-600'
                  : isAbove
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {isAt ? 'MSP' : isAbove ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{item.market}</p>
        </div>

        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-heading font-bold text-xl text-text-primary">
            ₹{item.price.toLocaleString('hi-IN')}
          </p>
          <p className="text-xs text-text-secondary">
            {lang === 'hi' ? 'प्रति क्विंटल' : 'per quintal'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary/20">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-secondary">
            MSP: <span className="font-semibold text-text-primary">₹{item.msp.toLocaleString('hi-IN')}</span>
          </span>
        </div>
        <button
          onClick={handleAI}
          className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          ✨ {lang === 'hi' ? 'AI सलाह' : 'AI Advice'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-secondary/10">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="h-3 bg-surface-2 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{aiText}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MandiPrices() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = mandiPrices.filter(item => {
    const q = search.toLowerCase();
    return (
      item.crop.includes(search) ||
      item.cropEn.toLowerCase().includes(q) ||
      item.market.includes(search)
    );
  });

  const today = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary">{t('mandiTitle')}</h1>
        <p className="text-text-secondary text-sm mt-0.5">{today}</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {[
          { color: 'bg-success/10 text-success', label: lang === 'hi' ? 'MSP से ऊपर' : 'Above MSP' },
          { color: 'bg-blue-50 text-blue-600', label: lang === 'hi' ? 'MSP पर' : 'At MSP' },
          { color: 'bg-danger/10 text-danger', label: lang === 'hi' ? 'MSP से नीचे' : 'Below MSP' },
        ].map(item => (
          <span key={item.label} className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}>
            {item.label}
          </span>
        ))}
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={lang === 'hi' ? '🔍 फसल खोजें...' : '🔍 Search crop...'}
        className="input-field text-sm"
      />

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <PriceCard key={item.cropEn} item={item} index={i} />
          ))
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <p className="text-3xl mb-2">🌾</p>
            <p>{lang === 'hi' ? 'कोई फसल नहीं मिली' : 'No crop found'}</p>
          </div>
        )}
      </div>

      <div className="card bg-warning/5 border border-warning/20">
        <p className="text-xs text-text-secondary leading-relaxed">
          ⚠️ {lang === 'hi'
            ? 'भाव सांकेतिक हैं। खरीद-बिक्री से पहले नजदीकी मंडी से पुष्टि करें।'
            : 'Prices are indicative. Confirm with your local mandi before trading.'}
        </p>
      </div>
    </div>
  );
}
