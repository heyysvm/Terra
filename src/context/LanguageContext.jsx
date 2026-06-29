import { createContext, useContext, useState } from 'react';

const translations = {
  hi: {
    dashboard: 'होम',
    voice: 'आवाज़ सहायक',
    cropDoctor: 'फसल डॉक्टर',
    schemes: 'सरकारी योजनाएं',
    mandi: 'मंडी भाव',
    sell: 'सरकार को बेचें',
    welcome: 'Terra में आपका स्वागत है',
    welcomeSub: 'आपकी खेती, आपकी भाषा, आपकी ताकत।',
    yourName: 'आपका नाम',
    village: 'गांव',
    district: 'जिला',
    primaryCrop: 'मुख्य फसल',
    getStarted: 'शुरू करें',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
    weatherIntelligence: 'मौसम जानकारी',
    askAnything: 'कुछ भी पूछें...',
    quickActions: 'त्वरित कार्य',
    todayWeather: 'आज का मौसम',
    humidity: 'नमी',
    wind: 'हवा',
    feelsLike: 'महसूस होता है',
    aiRecommendations: 'AI सुझाव',
    voiceAssistant: 'आवाज़ सहायक',
    voiceSubtitle: 'बोलें या लिखें - Terra आपकी मदद करेगा',
    tapToSpeak: 'बोलने के लिए दबाएं',
    listening: 'सुन रहा हूं...',
    typeQuestion: 'सवाल लिखें...',
    send: 'भेजें',
    cropDoctorTitle: 'फसल डॉक्टर',
    cropDoctorSub: 'फसल की फोटो अपलोड करें, AI बीमारी बताएगा',
    uploadImage: 'फोटो अपलोड करें',
    analyze: 'जांच करें',
    analyzing: 'जांच हो रही है...',
    disease: 'संभावित बीमारी',
    symptoms: 'लक्षण',
    treatment: 'उपचार',
    prevention: 'बचाव',
    schemesTitle: 'सरकारी योजनाएं',
    schemesSub: 'किसानों के लिए सरकारी योजनाएं',
    benefits: 'लाभ',
    eligibility: 'पात्रता',
    documents: 'जरूरी दस्तावेज़',
    howToApply: 'आवेदन कैसे करें',
    explainSimple: 'आसान हिंदी में समझाएं',
    mandiTitle: 'मंडी भाव',
    mandiSub: 'आज के ताज़ा बाज़ार भाव',
    crop: 'फसल',
    market: 'मंडी',
    price: 'भाव (₹/क्विंटल)',
    aiAnalysis: 'AI विश्लेषण',
    sellTitle: 'सरकार को बेचें',
    sellSub: 'MSP पर सीधे सरकार को फसल बेचें',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गड़बड़ हुई',
    retry: 'दोबारा कोशिश करें',
    back: 'वापस',
    lang: 'hi',
  },
  en: {
    dashboard: 'Home',
    voice: 'Voice Assistant',
    cropDoctor: 'Crop Doctor',
    schemes: 'Govt Schemes',
    mandi: 'Mandi Prices',
    sell: 'Sell to Govt',
    welcome: 'Welcome to Terra',
    welcomeSub: 'Your farming, your language, your strength.',
    yourName: 'Your Name',
    village: 'Village',
    district: 'District',
    primaryCrop: 'Primary Crop',
    getStarted: 'Get Started',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    weatherIntelligence: 'Weather Intelligence',
    askAnything: 'Ask anything...',
    quickActions: 'Quick Actions',
    todayWeather: "Today's Weather",
    humidity: 'Humidity',
    wind: 'Wind',
    feelsLike: 'Feels Like',
    aiRecommendations: 'AI Recommendations',
    voiceAssistant: 'Voice Assistant',
    voiceSubtitle: 'Speak or type - Terra will help you',
    tapToSpeak: 'Tap to Speak',
    listening: 'Listening...',
    typeQuestion: 'Type your question...',
    send: 'Send',
    cropDoctorTitle: 'Crop Doctor',
    cropDoctorSub: 'Upload a crop photo and AI will diagnose diseases',
    uploadImage: 'Upload Photo',
    analyze: 'Analyze',
    analyzing: 'Analyzing...',
    disease: 'Possible Disease',
    symptoms: 'Symptoms',
    treatment: 'Treatment',
    prevention: 'Prevention',
    schemesTitle: 'Government Schemes',
    schemesSub: 'Government schemes for farmers',
    benefits: 'Benefits',
    eligibility: 'Eligibility',
    documents: 'Required Documents',
    howToApply: 'How to Apply',
    explainSimple: 'Explain in Simple Language',
    mandiTitle: 'Mandi Prices',
    mandiSub: "Today's fresh market prices",
    crop: 'Crop',
    market: 'Market',
    price: 'Price (₹/Quintal)',
    aiAnalysis: 'AI Analysis',
    sellTitle: 'Sell to Government',
    sellSub: 'Sell your crop directly to government at MSP',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    back: 'Back',
    lang: 'en',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('terra_lang') || 'hi');

  const t = (key) => translations[lang][key] || key;

  const toggleLang = () => {
    const newLang = lang === 'hi' ? 'en' : 'hi';
    setLang(newLang);
    localStorage.setItem('terra_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
