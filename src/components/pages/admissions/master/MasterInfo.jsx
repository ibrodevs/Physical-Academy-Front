import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';
import AddressMap from '../../contacts/AddressMap';

const GraduateStudies = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('applicantInfo');
  const [isVisible, setIsVisible] = useState(false);
  const [masterData, setMasterData] = useState(null);

  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch master data from API
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/admission/master/?lang=${i18n.language}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setMasterData(data.results[0]);
        } else if (data.file_name) {
          setMasterData(data);
        }
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchMasterData();
  }, [i18n.language]);

  const commonInfo = t('graduateStudies.commonInfo', { returnObjects: true });

  const toggleRequirement = (index) => {
    setExpandedRequirement(expandedRequirement === index ? null : index);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Здесь можно добавить отправку формы на соответствующий эндпоинт
      const response = await fetch('/api/admission/application/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          program_type: activeTab,
          language: getApiLanguage()
        })
      });

      if (response.ok) {
        alert(t('graduateStudies.formSuccess'));
        setFormData({ name: '', email: '', program: '' });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(t('graduateStudies.formError'));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const stats = [
    { number: '95%', label: t('graduateStudies.stats.employment'), icon: '💼' },
    { number: '50+', label: t('graduateStudies.stats.professors'), icon: '👨‍🏫' },
    { number: '30+', label: t('graduateStudies.stats.researchLabs'), icon: '🔬' },
    { number: '80%', label: t('graduateStudies.stats.funding'), icon: '💰' }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с спортивными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏃‍♂️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🏆</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⚽</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🏅</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            {t('graduateStudies.masterPage.title')}
          </h1>
          <p className="text-blue-200 text-lg lg:text-xl max-w-2xl mx-auto">
            {t('graduateStudies.masterPage.subtitle')}
          </p>
        </motion.div>

        {/* Навигация вкладок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-12 lg:mb-16"
        >
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('applicantInfo')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${activeTab === 'applicantInfo'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span className="text-2xl">📚</span>
                <span>{t('graduateStudies.masterPage.tabs.applicantInfo')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('contactsAdress')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${activeTab === 'contactsAdress'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span className="text-2xl">📍</span>
                <span>{t('graduateStudies.masterPage.tabs.contactsAdress')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
            {activeTab === 'applicantInfo' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📄
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    {t('graduateStudies.masterPage.tabs.applicantInfo')}
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="text-blue-100 text-lg leading-relaxed mb-6 border-l-4 border-emerald-400 pl-6 py-2 bg-white/5 rounded-r-2xl">
                    {masterData ? (
                      <div dangerouslySetInnerHTML={{ __html: masterData.text }} />
                    ) : (
                      <p>{t('graduateStudies.master.generalInfo.description')}</p>
                    )}
                  </div>

                  {/* Кнопка для скачивания PDF */}
                  <div className="text-center">
                    <motion.a
                      href={masterData?.pdf || "/documents/program-info.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📘</span>
                      <span className="text-lg">Скачать {masterData?.file_name || "program-info.pdf"}</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'contactsAdress' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📍
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    {t('graduateStudies.masterPage.tabs.contactsAdress')}
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Адрес */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        🏛️
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-300 mb-2">{t('graduateStudies.masterPage.address.title')}</h4>
                        <p className="text-white text-lg leading-relaxed">
                          {t('graduateStudies.masterPage.address.text')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Контакты */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        📞
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold text-emerald-300 mb-1">{t('graduateStudies.masterPage.contacts.reception.title')}</h4>
                          <a
                            href="tel:+996312570489"
                            className="text-white text-lg hover:text-emerald-300 transition-colors duration-300"
                          >
                            {t('graduateStudies.masterPage.contacts.reception.phone')}
                          </a>
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-300 mb-1">{t('graduateStudies.masterPage.contacts.commission.title')}</h4>
                          <a
                            href="tel:+996707090952"
                            className="text-white text-lg hover:text-emerald-300 transition-colors duration-300"
                          >
                            {t('graduateStudies.masterPage.contacts.commission.phone')}
                          </a>
                          <p className="text-blue-100 text-sm mt-1">
                            {t('graduateStudies.masterPage.contacts.commission.name')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Часы работы */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        🕐
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-300 mb-2">{t('graduateStudies.masterPage.schedule.title')}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-100">{t('graduateStudies.masterPage.schedule.weekdays')}</span>
                            <span className="text-white font-medium">{t('graduateStudies.masterPage.schedule.weekdaysHours')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-100">{t('graduateStudies.masterPage.schedule.lunch')}</span>
                            <span className="text-white font-medium">{t('graduateStudies.masterPage.schedule.lunchHours')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-100">{t('graduateStudies.masterPage.schedule.weekend')}</span>
                            <span className="text-white font-medium">{t('graduateStudies.masterPage.schedule.weekendHours')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Социальные сети */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        🌐
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold text-purple-300 mb-2">{t('graduateStudies.masterPage.social.instagram')}</h4>
                          <motion.a
                            href="https://www.instagram.com/ksapcs.kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>{t('graduateStudies.masterPage.social.instagramHandle')}</span>
                          </motion.a>
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-300 mb-2">{t('graduateStudies.masterPage.social.facebook')}</h4>
                          <motion.a
                            href="https://www.facebook.com/people/%D0%91%D0%A2%D0%A2%D1%83%D1%80%D1%83%D1%81%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-%D0%B0%D1%82%D1%8B%D0%BD%D0%B4%D0%B0%D0%B3%D1%8B-%D0%9A%D0%9C%D0%94%D0%A2%D0%B6%D0%A1%D0%90/61585145273355/?ref=pl_edit_xav_ig_profile_page_web#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>{t('graduateStudies.masterPage.social.facebookName')}</span>
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
      </div>
    </section>
  );
};

export default GraduateStudies;