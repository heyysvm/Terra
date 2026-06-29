import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const crops = ['गेहूं', 'धान', 'मक्का', 'चना', 'सरसों', 'अरहर', 'सोयाबीन', 'जौ', 'अन्य'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLang();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', village: '', district: '', primaryCrop: '' });

  const steps = [
    {
      field: 'name',
      label: t('yourName'),
      placeholder: lang === 'hi' ? 'जैसे: रामलाल यादव' : 'e.g. Ramlal Yadav',
      type: 'text',
    },
    {
      field: 'village',
      label: t('village'),
      placeholder: lang === 'hi' ? 'जैसे: बोधगया' : 'e.g. Bodh Gaya',
      type: 'text',
    },
    {
      field: 'district',
      label: t('district'),
      placeholder: lang === 'hi' ? 'जैसे: गया' : 'e.g. Gaya',
      type: 'text',
    },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      if (step < steps.length - 1) setStep(s => s + 1);
      else setStep(steps.length);
    }
  };

  const handleCropSelect = (crop) => {
    const profile = { ...form, primaryCrop: crop };
    localStorage.setItem('terra_profile', JSON.stringify(profile));
    navigate('/');
  };

  const currentStep = steps[step];
  const isCropStep = step === steps.length;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="px-5 pt-safe-top pt-10 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">T</span>
            </div>
            <span className="font-heading font-bold text-primary text-2xl">Terra</span>
          </div>
        </div>
        <button
          onClick={toggleLang}
          className="text-sm text-text-secondary border border-secondary/50 rounded-full px-3 py-1.5 mt-1"
        >
          {lang === 'hi' ? 'EN' : 'हि'}
        </button>
      </div>

      <div className="flex-1 px-5 pb-10 max-w-sm mx-auto w-full">
        <div className="flex gap-2 mb-8">
          {[...steps, { field: 'crop' }].map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-secondary/40'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!isCropStep ? (
            <>
              <h1 className="font-heading font-bold text-2xl text-text-primary mb-1">
                {step === 0 ? t('welcome') : currentStep.label}
              </h1>
              {step === 0 && (
                <p className="text-text-secondary text-sm mb-6">{t('welcomeSub')}</p>
              )}

              <div className="mt-6 mb-6">
                <label className="label">{currentStep.label}</label>
                <input
                  type={currentStep.type}
                  value={form[currentStep.field]}
                  onChange={e => setForm(f => ({ ...f, [currentStep.field]: e.target.value }))}
                  placeholder={currentStep.placeholder}
                  className="input-field text-base"
                  onKeyDown={e => e.key === 'Enter' && form[currentStep.field] && handleNext()}
                  autoFocus
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!form[currentStep.field].trim()}
                className="w-full btn-primary text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === 'hi' ? 'आगे →' : 'Next →'}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-1">
                {lang === 'hi' ? 'मुख्य फसल चुनें' : 'Select Primary Crop'}
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                {lang === 'hi' ? 'आप मुख्यतः कौन सी फसल उगाते हैं?' : 'What crop do you mainly grow?'}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {crops.map(crop => (
                  <button
                    key={crop}
                    onClick={() => handleCropSelect(crop)}
                    className="bg-surface border-2 border-secondary/30 rounded-2xl py-4 px-2 text-center hover:border-primary hover:bg-primary/5 transition-all active:scale-95 font-medium text-sm text-text-primary"
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
    </div>
  );
}
