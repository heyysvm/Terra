import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import { schemesData } from '../data/mandiData';
import { explainScheme } from '../utils/gemini';

function SchemeCard({ scheme }) {
  const { lang, t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('benefits');
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleExplain = async () => {
    if (aiExplanation) return;
    setLoadingAi(true);
    const explanation = await explainScheme(scheme.fullName, lang);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  const tabs = [
    { key: 'benefits', label: t('benefits'), icon: '💰' },
    { key: 'eligibility', label: t('eligibility'), icon: '✅' },
    { key: 'documents', label: t('documents'), icon: '📄' },
    { key: 'apply', label: t('howToApply'), icon: '📝' },
  ];

  const content = {
    benefits: scheme.benefits,
    eligibility: scheme.eligibility,
    documents: scheme.documents,
    apply: scheme.howToApply,
  };

  return (
    <motion.div
      layout
      className="card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 text-left"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${scheme.color}15` }}
        >
          {scheme.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-text-primary">{scheme.name}</p>
          <p className="text-xs text-text-secondary truncate">{scheme.fullName}</p>
        </div>
        <span className={`text-text-secondary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-secondary/20">
              <div className="flex gap-1 overflow-x-auto pb-1 mb-4">
                {tabs.map(tb => (
                  <button
                    key={tb.key}
                    onClick={() => setTab(tb.key)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                      tab === tb.key
                        ? 'text-white'
                        : 'bg-surface-2 text-text-secondary'
                    }`}
                    style={tab === tb.key ? { background: scheme.color } : {}}
                  >
                    {tb.icon} {tb.label}
                  </button>
                ))}
              </div>

              <ul className="space-y-2 mb-4">
                {content[tab].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span
                      className="font-bold flex-shrink-0 mt-0.5"
                      style={{ color: scheme.color }}
                    >
                      {tab === 'apply' ? `${i + 1}.` : '•'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleExplain}
                disabled={loadingAi}
                className="w-full border rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2"
                style={{ borderColor: scheme.color, color: scheme.color }}
              >
                {loadingAi ? (
                  <>
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${scheme.color}30`, borderTopColor: scheme.color }} />
                    {lang === 'hi' ? 'AI समझा रहा है...' : 'AI explaining...'}
                  </>
                ) : (
                  <>✨ {t('explainSimple')}</>
                )}
              </button>

              {aiExplanation && (
                <div
                  className="mt-3 p-3 rounded-xl text-sm text-text-secondary leading-relaxed whitespace-pre-wrap"
                  style={{ background: `${scheme.color}08` }}
                >
                  {aiExplanation}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GovernmentSchemes() {
  const { t } = useLang();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary">{t('schemesTitle')}</h1>
        <p className="text-text-secondary text-sm mt-0.5">{t('schemesSub')}</p>
      </div>

      <div className="space-y-3">
        {schemesData.map((scheme, i) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <SchemeCard scheme={scheme} />
          </motion.div>
        ))}
      </div>

      <div className="card bg-primary/5 border border-primary/20">
        <p className="text-sm text-text-secondary">
          💡 {' '}
          <span className="font-medium text-text-primary">
            {t('lang') === 'hi' ? 'टिप:' : 'Tip:'}
          </span>
          {' '}किसी भी योजना के बारे में आवाज़ से पूछने के लिए Voice Assistant का उपयोग करें।
        </p>
      </div>
    </div>
  );
}
