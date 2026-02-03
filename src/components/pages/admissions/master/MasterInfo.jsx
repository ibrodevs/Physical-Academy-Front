import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const GraduateStudies = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('master');
  const [activeProgram, setActiveProgram] = useState(0);
  const [activeRequirement, setActiveRequirement] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: ''
  });

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    master: {
      documents: [],
      programs: [],
      dates: [],
      requirements: [],
      loading: false,
      error: null
    },
    aspirant: {
      documents: [],
      programs: [],
      dates: [],
      requirements: [],
      loading: false,
      error: null
    }
  });

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

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async (type) => {
    try {
      setBackendData(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: true, error: null }
      }));

      const lang = getApiLanguage();

      const API_URL = import.meta.env.VITE_API_URL;

      const endpoints = {
        master: [
          `${API_URL}/api/admission/master-documents/?lang=${lang}`,
          `${API_URL}/api/admission/master-programs/?lang=${lang}`,
          `${API_URL}/api/admission/master-main-dates/?lang=${lang}`,
          `${API_URL}/api/admission/master-requirements/?lang=${lang}`
        ],
        aspirant: [
          `${API_URL}/api/admission/aspirant-documents/?lang=${lang}`,
          `${API_URL}/api/admission/aspirant-programs/?lang=${lang}`,
          `${API_URL}/api/admission/aspirant-main-dates/?lang=${lang}`,
          `${API_URL}/api/admission/aspirant-requirements/?lang=${lang}`
        ],
        applicatInfo: [],
        contactsAdress: []
      };


      const responses = await Promise.all(
        endpoints[type].map(async (url) => {
          try {
            const response = await fetch(url);

            // Проверяем content-type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await response.text();
              console.warn(`Non-JSON response from ${url}:`, text.substring(0, 200));
              return { results: [] };
            }

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      setBackendData(prev => ({
        ...prev,
        [type]: {
          documents: responses[0].results || [],
          programs: responses[1].results || [],
          dates: responses[2].results || [],
          requirements: responses[3].results || [],
          loading: false,
          error: null
        }
      }));

    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      setBackendData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          error: 'Failed to load data'
        }
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData('master');
    fetchBackendData('aspirant');
  }, []); // Убрали fetchBackendData из зависимостей

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    const currentType = activeTab === 'master' ? 'master' : 'aspirant';
    fetchBackendData(currentType);
  }, [i18n.language, activeTab]); // Убрали



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

  // Автопереключение программ и требований
  useEffect(() => {
    const currentData = backendData[activeTab === 'master' ? 'master' : 'aspirant'];
    if (currentData.programs.length > 0 && currentData.requirements.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram(prev => (prev + 1) % currentData.programs.length);
        setActiveRequirement(prev => (prev + 1) % currentData.requirements.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, backendData]);

  const commonInfo = t('graduateStudies.commonInfo', { returnObjects: true });

  // Получение текущих данных в зависимости от активной вкладки
  const getCurrentData = () => {
    const dataType = activeTab === 'master' ? 'master' : 'aspirant';
    return backendData[dataType];
  };

  const getCurrentPrograms = () => {
    const currentData = getCurrentData();
    return currentData.programs.map(program => ({
      name: program.program_name,
      field: program.description,
      // Преобразуем features в массив, если это строка
      tags: Array.isArray(program.features)
        ? program.features
        : typeof program.features === 'string'
          ? program.features.split(',').map(tag => tag.trim())
          : []
    }));
  };


  const getCurrentRequirements = () => {
    const currentData = getCurrentData();
    return currentData.requirements.map(req => ({
      title: req.title,
      description: req.description
    }));
  };

  const getCurrentDocuments = () => {
    const currentData = getCurrentData();
    return currentData.documents.map(doc => ({
      title: doc.document_name,
      format: doc.file?.split('.').pop()?.toUpperCase() || 'PDF',
      type: 'pdf',
      link: doc.file
    }));
  };

  const getCurrentDates = () => {
    const currentData = getCurrentData();
    return currentData.dates.map(date => ({
      event: date.event_name,
      date: date.date
    }));
  };

  const currentData = getCurrentData();
  const currentPrograms = getCurrentPrograms();
  const currentRequirements = getCurrentRequirements();
  const currentDocuments = getCurrentDocuments();
  const currentDates = getCurrentDates();

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
    setActiveProgram(0);
    setActiveRequirement(0);
    setExpandedRequirement(null);
  };

  const stats = [
    { number: '95%', label: t('graduateStudies.stats.employment'), icon: '💼' },
    { number: '50+', label: t('graduateStudies.stats.professors'), icon: '👨‍🏫' },
    { number: '30+', label: t('graduateStudies.stats.researchLabs'), icon: '🔬' },
    { number: '80%', label: t('graduateStudies.stats.funding'), icon: '💰' }
  ];

  // Компонент загрузки
  const LoadingSkeleton = () => (

    <div className="animate-pulse space-y-4">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="bg-white/10 rounded-2xl h-4 mb-2"></div>
      <div className="bg-white/10 rounded-2xl h-4 w-3/4"></div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-2xl h-20"></div>
        <div className="bg-white/10 rounded-2xl h-20"></div>
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry, type }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('graduateStudies.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData[type].error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('graduateStudies.retry')}
      </button>
    </div>
  );

  // Проверка загрузки и ошибок для текущей вкладки
  const isCurrentTabLoading = currentData.loading;
  const isCurrentTabError = currentData.error;

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
                <span className="text-2xl">🏫</span>
                <span>{t('graduateStudies.applicantTitle')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('master')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${activeTab === 'master'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span className="text-2xl">🎓</span>
                <span>{t('graduateStudies.masterTitle')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('aspirant')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${activeTab === 'aspirant'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span className="text-2xl">📚</span>
                <span>{t('graduateStudies.phdTitle')}</span>
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
                <span className="text-2xl">📞</span>
                <span>{t('graduateStudies.contactsAdressTitle')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {isCurrentTabError ? (
          <ErrorMessage
            onRetry={() => fetchBackendData(activeTab === 'master' ? 'master' : 'aspirant')}
            type={activeTab === 'master' ? 'master' : 'aspirant'}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Основной контент - Информация с PDF кнопкой */}
            <div className="lg:col-span-2 space-y-8">
              {/* Информация с PDF */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📄
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.generalInfo')}
                      </h2>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <p className="text-blue-100 text-lg leading-relaxed mb-6 border-l-4 border-emerald-400 pl-6 py-2 bg-white/5 rounded-r-2xl">
                        {t('graduateStudies.master.generalInfo.description')}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                          <h4 className="font-bold text-blue-300 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                            {t('graduateStudies.duration')}
                          </h4>
                          <p className="text-white text-lg font-semibold">{t('graduateStudies.master.generalInfo.duration')}</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
                          <h4 className="font-bold text-emerald-300 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                            {t('graduateStudies.format')}
                          </h4>
                          <p className="text-white text-lg font-semibold">{t('graduateStudies.master.generalInfo.format')}</p>


                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10 mb-8">
                        <h4 className="font-bold text-white text-xl mb-6 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">⭐</span>
                          {t('graduateStudies.keyFeatures')}
                        </h4>
                        <ul className="space-y-4">
                          {t('graduateStudies.master.generalInfo.features', { returnObjects: true }).map((feature, index) => (
                            <motion.li
                              key={index}
                              className="flex items-start group"
                              whileHover={{ x: 5 }}
                            >
                              <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                              <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Кнопка для скачивания PDF */}
                      <motion.a
                        href="/documents/program-info.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📘</span>
                        <span className="text-lg">Скачать полную информацию (PDF)</span>
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
                  </>
                )}
              </motion.div>
            </div>

            {/* Боковая панель - Контакты и адрес */}
            <div className="space-y-8">
              {/* Контакты и адрес */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📍
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.contactsAdressTitle')}
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
                            <h4 className="font-bold text-blue-300 mb-2">Адрес</h4>
                            <p className="text-white text-lg leading-relaxed">
                              И.Ахунбаева 97 Главный корпус
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
                              <h4 className="font-bold text-emerald-300 mb-1">Приемная</h4>
                              <a
                                href="tel:+996312570489"
                                className="text-white text-lg hover:text-emerald-300 transition-colors duration-300"
                              >
                                +996 312 57 04 89
                              </a>
                            </div>
                            <div>
                              <h4 className="font-bold text-emerald-300 mb-1">Приемная комиссия</h4>
                              <a
                                href="tel:+996707090952"
                                className="text-white text-lg hover:text-emerald-300 transition-colors duration-300"
                              >
                                +996 707 09 09 52
                              </a>
                              <p className="text-blue-100 text-sm mt-1">
                                Халиалдаева Айнура Саматовна
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
                            <h4 className="font-bold text-blue-300 mb-2">График работы</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-blue-100">Пн-Пт:</span>
                                <span className="text-white font-medium">8:00 - 17:00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-100">Обед:</span>
                                <span className="text-white font-medium">12:00 - 13:00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-100">Сб-Вс:</span>
                                <span className="text-white font-medium">Выходные</span>
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
                              <h4 className="font-bold text-purple-300 mb-1">Инстаграм</h4>
                              <a
                                href="https://www.instagram.com/ksapcs.kg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-lg hover:text-purple-300 transition-colors duration-300"
                              >
                                @ksapcs.kg
                              </a>
                            </div>
                            <div>
                              <h4 className="font-bold text-blue-300 mb-1">Фейсбук</h4>
                              <a
                                href="https://www.facebook.com/people/%D0%91%D0%A2%D0%A2%D1%83%D1%80%D1%83%D1%81%D0%B1%D0%B5%D0%BA%D0%BE%D0%B2-%D0%B0%D1%82%D1%8B%D0%BD%D0%B4%D0%B0%D0%B3%D1%8B-%D0%9A%D0%9C%D0%94%D0%A2%D0%B6%D0%A1%D0%90/61585145273355/?ref=pl_edit_xav_ig_profile_page_web#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-lg hover:text-blue-300 transition-colors duration-300"
                              >
                                Б.Турусбеков атындагы КМДТжСА
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Кнопка для связи */}
                      <motion.a
                        href="mailto:info@ksapcs.kg"
                        className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl group-hover:rotate-12 transition-transform duration-300">✉️</span>
                          <span className="text-lg">Написать нам</span>
                        </span>
                      </motion.a>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GraduateStudies;