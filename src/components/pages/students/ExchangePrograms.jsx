// ExchangePrograms.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Добавляем стили для ограничения строк
const lineClampStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Добавляем стили в head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = lineClampStyles;
  document.head.appendChild(styleElement);
}

const ExchangePrograms = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [isApplying, setIsApplying] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    loading: false,
    error: null,
  });

  const sectionRef = useRef(null);

  // Статичные тексты для трех языков
  const staticTexts = {
    en: {
      mainTitle: "Scholarship Programs and International Exchange Programs",
      subtitle: "Expand your horizons with our partner universities worldwide and gain invaluable international experience."
    },
    ru: {
      mainTitle: "Стипендиальные программы и международные программы обмена",
      subtitle: "Расширьте свои горизонты с нашими университетами-партнерами по всему миру и получите бесценный международный опыт."
    },
    kg: {
      mainTitle: "Стипендиялык программалар жана эларалык алмашуу программалары",
      subtitle: "Дүйнө жүзү боюнча өнөктөш университеттерибиз менен келечегиңизди кеңейтип, баа жеткис эларалык тажрыйба алыңыз."
    }
  };

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      en: "en",
      ru: "ru",
      kg: "kg",
    };
    return langMap[i18n.language] || "en";
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const API_URL = import.meta.env.VITE_API_URL || 'https://physical-academy-backend-3dccb860f75a.herokuapp.com';

      // Новый endpoint для обменных программ с языковым параметром
      const currentLang = getApiLanguage();
      const endpoint = `${API_URL}/api/students/exchange/?lang=${currentLang}`;

      console.log(`Fetching exchange data from: ${endpoint}`);

      const response = await fetch(endpoint);

      // Проверяем content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn(
          "Non-JSON response from exchange page:",
          text.substring(0, 200)
        );
        throw new Error("Invalid response format");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Exchange data received:", data);
      console.log("Programs count:", data.results?.length);

      setBackendData({
        programs: data.results || [],
        loading: false,
        error: null,
      });

      console.log("Backend data state updated");
    } catch (error) {
      console.error("Error fetching exchange data:", error);

      setBackendData({
        programs: [],
        loading: false,
        error: error.message || "Failed to load exchange programs",
      });
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании и перезагрузка при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

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

  // Автопереключение программ
  useEffect(() => {
    if (backendData.programs.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram((prev) => (prev + 1) % backendData.programs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.programs]);

  // Функции для модального окна
  const openModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  // Анимация счетчиков - убираем так как нет статистики в новом API
  /* 
  useEffect(() => {
    if (isVisible && backendData.stats.length > 0) {
      const targetValues = backendData.stats.map((stat) => {
        const value = stat.value || "0";
        return parseInt(value.replace(/\D/g, "")) || 0;
      });

      const duration = 2000;
      const steps = 60;
      const stepValues = targetValues.map((target) => target / steps);

      let currentStep = 0;
      const counterInterval = setInterval(() => {
        currentStep++;
        setCounterValues((prev) =>
          prev.map((value, index) => {
            if (currentStep <= steps) {
              return Math.min(value + stepValues[index], targetValues[index]);
            }
            return value;
          })
        );

        if (currentStep >= steps) {
          clearInterval(counterInterval);
        }
      }, duration / steps);

      return () => clearInterval(counterInterval);
    }
  }, [isVisible, backendData.stats]);
  */



  const toggleProgram = (index) => {
    // Функция больше не используется, но оставляем для совместимости
    console.log('toggleProgram called with index:', index);
  };

  const handleApply = async (programId, programName) => {
    setIsApplying(programId);
    try {
      // Имитация подачи заявки
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        currentLang === 'ru' 
          ? `Заявка на программу "${programName}" успешно отправлена!`
          : currentLang === 'kg'
          ? `"${programName}" программасына арыз ийгиликтүү жөнөтүлдү!`
          : `Application for "${programName}" has been sent successfully!`
      );
    } catch (error) {
      console.error("Application error:", error);
      alert(
        currentLang === 'ru'
          ? 'Ошибка при отправке заявки. Попробуйте снова.'
          : currentLang === 'kg'
          ? 'Арыз жөнөтүүдө ката кетти. Кайра аракет кылыңыз.'
          : 'Error sending application. Please try again.'
      );
    } finally {
      setIsApplying(null);
    }
  };

  const handleFilterChange = (type, value) => {
    // Функция больше не используется, но оставляем для совместимости
    console.log('handleFilterChange called:', type, value);
  };

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
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {currentLang === 'ru' ? 'Ошибка загрузки' :
          currentLang === 'kg' ? 'Жүктөө катасы' :
            'Loading Error'}
      </h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {currentLang === 'ru' ? 'Попробовать снова' :
          currentLang === 'kg' ? 'Кайра аракет кылуу' :
            'Try Again'}
      </button>
    </div>
  );

  // Получение переведенного текста (оставляем для совместимости)
  const getTranslatedText = (item, field) => {
    if (!item) return "";
    return item[field] || "";
  };

  // Получаем текущий язык для статичных текстов
  const currentLang = i18n.language;
  const staticTitle = staticTexts[currentLang]?.mainTitle || staticTexts.en.mainTitle;
  const staticSubtitle = staticTexts[currentLang]?.subtitle || staticTexts.en.subtitle;

  // Компонент модального окна
  const Modal = ({ isOpen, onClose, program }) => {
    if (!isOpen || !program) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header с изображением */}
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img
                src={program.photo || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                alt={program.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Контент */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {program.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {currentLang === 'ru' ? 'Описание программы' :
                      currentLang === 'kg' ? 'Программанын сүрөттөмөсү' :
                        'Program Description'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.desc}
                  </p>
                </div>

                {/* Дополнительная информация */}
                <div className="grid grid-cols-1 gap-4">
                </div>

                {/* Кнопки действий */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">        
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    {currentLang === 'ru' ? 'Закрыть' :
                      currentLang === 'kg' ? 'Жабуу' :
                        'Close'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с международными символами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Международные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          ✈️
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🤝</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {staticTitle}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {staticSubtitle}
          </p>
        </motion.div>

        {/* Секция программ обмена из API */}
        <div className="mb-16">
        
          {/* Состояние загрузки */}
          {backendData.loading && (
            <LoadingSkeleton />
          )}

          {/* Состояние ошибки */}
          {backendData.error && !backendData.loading && (
            <ErrorMessage onRetry={fetchBackendData} />
          )}

          {/* Программы */}
          {!backendData.loading && !backendData.error && backendData.programs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {backendData.programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                  onClick={() => openModal(program)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.photo || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={program.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">
                      {program.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-300">
                        {currentLang === 'ru' ? 'Нажмите для подробностей' :
                          currentLang === 'kg' ? 'Кененирээк үчүн басыңыз' :
                            'Click for details'}
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                        →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}



          {/* Сообщение об отсутствии данных */}
          {!backendData.loading && !backendData.error && backendData.programs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl text-white mb-2">
                {currentLang === 'ru' ? 'Программы скоро появятся' :
                  currentLang === 'kg' ? 'Программалар жакында пайда болот' :
                    'Programs Coming Soon'}
              </h3>
              <p className="text-blue-200">
                {currentLang === 'ru' ? 'Мы работаем над добавлением новых программ обмена' :
                  currentLang === 'kg' ? 'Биз жаңы алмашуу программаларын кошуу үчүн иштеп жатабыз' :
                    'We are working on adding new exchange programs'}
              </p>
            </div>
          )}
        </div>

        {/* Модальное окно */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          program={selectedProgram} 
        />
      </div>
    </section>
  );
};

export default ExchangePrograms;