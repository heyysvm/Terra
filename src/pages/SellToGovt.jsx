import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const steps = {
  hi: [
    {
      id: 1,
      icon: '📋',
      title: 'पंजीकरण करें',
      color: '#2D5A4A',
      desc: 'सबसे पहले किसान पंजीकरण करना जरूरी है।',
      details: [
        'अपने राज्य के कृषि विभाग की वेबसाइट पर जाएं',
        'Bihar: dbtagriculture.bihar.gov.in',
        'आधार कार्ड, बैंक खाता और ज़मीन की जानकारी तैयार रखें',
        'पंजीकरण संख्या नोट करें — यह हर जगह काम आएगी',
      ],
    },
    {
      id: 2,
      icon: '📅',
      title: 'खरीद केंद्र की जानकारी लें',
      color: '#4F7C59',
      desc: 'नजदीकी सरकारी खरीद केंद्र का पता लगाएं।',
      details: [
        'जिला कृषि कार्यालय से खरीद केंद्र की सूची मांगें',
        'या PM-KISAN हेल्पलाइन: 155261 पर कॉल करें',
        'खरीद की तारीख और समय नोट करें',
        'PACS (प्राथमिक कृषि सहकारी समिति) से भी संपर्क करें',
      ],
    },
    {
      id: 3,
      icon: '🌾',
      title: 'फसल तैयार करें',
      color: '#C86B3C',
      desc: 'सरकारी मानक के अनुसार फसल साफ करें।',
      details: [
        'फसल में नमी की मात्रा मानक के अनुसार हो (गेहूं: 12%, धान: 17%)',
        'कंकड़, मिट्टी और टूटे दाने हटाएं',
        'बोरियां साफ और मजबूत होनी चाहिए',
        'वजन के लिए तैयार रहें — प्रति बोरी वजन नोट करें',
      ],
    },
    {
      id: 4,
      icon: '📄',
      title: 'दस्तावेज तैयार रखें',
      color: '#8B6914',
      desc: 'खरीद केंद्र पर ये कागज़ात जरूर लाएं।',
      details: [
        'आधार कार्ड (मूल + फोटोकॉपी)',
        'बैंक पासबुक (खाता नंबर और IFSC)',
        'भूमि अभिलेख / खतौनी',
        'पंजीकरण संख्या',
        'पासपोर्ट साइज़ फोटो (2-3 कॉपी)',
      ],
    },
    {
      id: 5,
      icon: '🏛️',
      title: 'खरीद केंद्र पर जाएं',
      color: '#1E3D32',
      desc: 'सही समय पर खरीद केंद्र पहुंचें।',
      details: [
        'सुबह जल्दी पहुंचें — कतार कम होती है',
        'टोकन लें और बारी का इंतजार करें',
        'फसल की जांच होगी — गुणवत्ता मानक पास होनी चाहिए',
        'वजन होगा और रसीद मिलेगी — संभालकर रखें',
      ],
    },
    {
      id: 6,
      icon: '💰',
      title: 'भुगतान मिलेगा',
      color: '#2D5A4A',
      desc: 'MSP की राशि सीधे बैंक खाते में आएगी।',
      details: [
        'आमतौर पर 3-7 दिन में बैंक में पैसे आ जाते हैं',
        'SMS से सूचना मिलेगी',
        'अगर देर हो तो जिला कृषि कार्यालय से संपर्क करें',
        'रसीद और बैंक स्टेटमेंट मिलान करें',
      ],
    },
  ],
  en: [
    {
      id: 1,
      icon: '📋',
      title: 'Register as a Farmer',
      color: '#2D5A4A',
      desc: 'Registration is the first step to sell at MSP.',
      details: [
        'Visit your state agriculture department website',
        'Bihar: dbtagriculture.bihar.gov.in',
        'Keep Aadhaar card, bank account and land records ready',
        'Note your registration number — you\'ll need it everywhere',
      ],
    },
    {
      id: 2,
      icon: '📅',
      title: 'Find Procurement Center',
      color: '#4F7C59',
      desc: 'Locate the nearest government procurement center.',
      details: [
        'Contact District Agriculture Office for the list',
        'Or call PM-KISAN helpline: 155261',
        'Note procurement dates and timings',
        'Also contact your local PACS (Primary Agricultural Credit Society)',
      ],
    },
    {
      id: 3,
      icon: '🌾',
      title: 'Prepare Your Crop',
      color: '#C86B3C',
      desc: 'Clean and prepare crop as per government standards.',
      details: [
        'Maintain standard moisture: Wheat 12%, Paddy 17%',
        'Remove stones, mud and broken grains',
        'Use clean, strong bags',
        'Weigh each bag and note it down',
      ],
    },
    {
      id: 4,
      icon: '📄',
      title: 'Prepare Documents',
      color: '#8B6914',
      desc: 'Bring these documents to the procurement center.',
      details: [
        'Aadhaar Card (original + photocopy)',
        'Bank Passbook (account number and IFSC)',
        'Land Records / Khatoni',
        'Registration Number',
        'Passport Size Photos (2-3 copies)',
      ],
    },
    {
      id: 5,
      icon: '🏛️',
      title: 'Visit Procurement Center',
      color: '#1E3D32',
      desc: 'Reach the procurement center on time.',
      details: [
        'Arrive early in the morning — shorter queues',
        'Get a token and wait for your turn',
        'Your crop will be inspected for quality standards',
        'Weight will be measured and receipt given — keep it safe',
      ],
    },
    {
      id: 6,
      icon: '💰',
      title: 'Receive Payment',
      color: '#2D5A4A',
      desc: 'MSP amount will be transferred directly to your bank.',
      details: [
        'Money usually arrives in 3-7 days',
        'You\'ll receive an SMS notification',
        'If delayed, contact District Agriculture Office',
        'Match receipt with bank statement',
      ],
    },
  ],
};

const msps = [
  { crop: 'गेहूं / Wheat', msp: 2275, season: 'रबी / Rabi' },
  { crop: 'धान / Paddy', msp: 2183, season: 'खरीफ / Kharif' },
  { crop: 'मक्का / Maize', msp: 1870, season: 'खरीफ / Kharif' },
  { crop: 'चना / Chickpea', msp: 5440, season: 'रबी / Rabi' },
  { crop: 'सरसों / Mustard', msp: 5650, season: 'रबी / Rabi' },
  { crop: 'अरहर / Toor Dal', msp: 7000, season: 'खरीफ / Kharif' },
];

const helplines = [
  { name: 'PM-KISAN हेल्पलाइन', number: '155261', icon: '📞' },
  { name: 'किसान कॉल सेंटर', number: '1800-180-1551', icon: '☎️' },
  { name: 'कृषि मंत्रालय', number: '011-23382012', icon: '🏛️' },
];

export default function SellToGovt() {
  const { t, lang } = useLang();
  const [activeStep, setActiveStep] = useState(null);
  const stepsData = steps[lang];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading font-bold text-2xl text-text-primary">{t('sellTitle')}</h1>
        <p className="text-text-secondary text-sm mt-0.5">{t('sellSub')}</p>
      </div>

      <div className="bg-primary rounded-2xl p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">
          {lang === 'hi' ? '2024-25 न्यूनतम समर्थन मूल्य' : '2024-25 Minimum Support Price'}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {msps.map(m => (
            <div key={m.crop} className="bg-white/10 rounded-xl p-2.5">
              <p className="text-white/70 text-xs">{m.crop}</p>
              <p className="font-heading font-bold text-white">₹{m.msp.toLocaleString('hi-IN')}</p>
              <p className="text-white/50 text-xs">{m.season}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading font-semibold text-text-primary mb-3">
          {lang === 'hi' ? '📍 कैसे बेचें — पूरी प्रक्रिया' : '📍 How to Sell — Complete Process'}
        </h2>
        <div className="space-y-2">
          {stepsData.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                className="w-full flex items-center gap-3 text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${step.color}15` }}
                >
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: step.color }}
                    >
                      {step.id}
                    </span>
                    <p className="font-heading font-semibold text-text-primary text-sm">{step.title}</p>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">{step.desc}</p>
                </div>
                <span
                  className={`text-text-secondary transition-transform duration-200 flex-shrink-0 ${
                    activeStep === step.id ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {activeStep === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-secondary/20">
                      <ul className="space-y-2">
                        {step.details.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span
                              className="font-bold flex-shrink-0 mt-0.5"
                              style={{ color: step.color }}
                            >
                              {idx + 1}.
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading font-semibold text-text-primary mb-3">
          {lang === 'hi' ? '📞 सहायता के लिए संपर्क करें' : '📞 Helpline Numbers'}
        </h2>
        <div className="space-y-2">
          {helplines.map(h => (
            <a
              key={h.number}
              href={`tel:${h.number.replace(/-/g, '')}`}
              className="card flex items-center gap-3 hover:shadow-medium transition-all active:scale-98"
            >
              <span className="text-2xl">{h.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm text-text-primary">{h.name}</p>
                <p className="text-primary font-heading font-bold">{h.number}</p>
              </div>
              <span className="text-primary text-lg">📲</span>
            </a>
          ))}
        </div>
      </div>

      <div className="card bg-success/5 border border-success/20">
        <p className="text-sm text-text-secondary leading-relaxed">
          💡 <span className="font-semibold text-text-primary">
            {lang === 'hi' ? 'सुझाव:' : 'Tip:'}
          </span>{' '}
          {lang === 'hi'
            ? 'मंडी भाव MSP से ऊपर होने पर मंडी में बेचना फायदेमंद होता है। MSP गारंटी केवल सरकारी केंद्रों पर मिलती है।'
            : 'When mandi prices are above MSP, selling in the open market can be more profitable. MSP guarantee is only at government procurement centers.'}
        </p>
      </div>
    </div>
  );
}
