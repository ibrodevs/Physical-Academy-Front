// ExchangePrograms.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const ExchangePrograms = () => {
  const { t, i18n } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [isApplying, setIsApplying] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    title: "",
    subtitle: "",
    stats: [],
    programs: [],
    filters: {
      regions: [],
      durations: [],
    },
    deadlines: {
      title: "",
      list: [],
    },
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

      const lang = getApiLanguage();

      const API_URL = import.meta.env.VITE_API_URL;

      // Правильный endpoint
      const endpoint = `${API_URL}/api/student-clubs/exchange-page/?lang=${lang}`;

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
      console.log("Programs count:", data.programs?.length);
      console.log("Stats count:", data.stats?.length);
      console.log("Filters:", data.filters);

      setBackendData({
        title: data.title || staticTexts[lang]?.mainTitle || staticTexts.en.mainTitle,
        subtitle: data.subtitle || staticTexts[lang]?.subtitle || staticTexts.en.subtitle,
        stats: data.stats || [],
        programs: data.programs || [],
        filters: data.filters || {
          regions: [],
          durations: [],
        },
        deadlines: data.deadlines || {
          title: t("students.exchange.deadlines.title"),
          list: [],
        },
        loading: false,
        error: null,
      });

      console.log("Backend data state updated");
    } catch (error) {
      console.error("Error fetching exchange data:", error);

      // При ошибке используем статичные тексты
      const lang = getApiLanguage();
      setBackendData({
        title: staticTexts[lang]?.mainTitle || staticTexts.en.mainTitle,
        subtitle: staticTexts[lang]?.subtitle || staticTexts.en.subtitle,
        stats: [],
        programs: [],
        filters: {
          regions: [],
          durations: [],
        },
        deadlines: {
          title: "",
          list: [],
        },
        loading: false,
        error: error.message || "Failed to load exchange programs",
      });
    }
  }, [getApiLanguage, t]);

  // Загрузка данных при монтировании и перезагрузка при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language, fetchBackendData]);

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

  // Анимация счетчиков
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

  const filteredPrograms = backendData.programs.filter((program) => {
    const matchesRegion =
      selectedRegion === "all" || program.region == selectedRegion;
    const matchesDuration =
      selectedDuration === "all" || program.duration_type == selectedDuration;

    const university = program.university || "";
    const country = program.country || "";
    const description = program.description || "";

    const matchesSearch =
      university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRegion && matchesDuration && matchesSearch;
  });

  const toggleProgram = (index) => {
    setExpandedProgram(expandedProgram === index ? null : index);
  };

  const handleApply = async (programId, programName) => {
    setIsApplying(programId);
    try {
      // Имитация подачи заявки
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        t("students.exchange.alerts.applicationSent", {
          university: programName,
        })
      );
    } catch (error) {
      console.error("Application error:", error);
      alert(t("students.exchange.alerts.applicationError"));
    } finally {
      setIsApplying(null);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === "region") {
      setSelectedRegion(value);
    } else if (type === "duration") {
      setSelectedDuration(value);
    }
    setExpandedProgram(null);
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
        {t("students.exchange.errorTitle")}
      </h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("students.exchange.retry")}
      </button>
    </div>
  );

  // Получение переведенного текста
  const getTranslatedText = (item, field) => {
    if (!item) return "";

    // Сначала пробуем получить уже локализованное поле из бэкенда
    if (item[field] !== undefined && item[field] !== null) {
      return item[field];
    }

    // Если нет, пробуем поля с суффиксом языка (fallback для старых данных)
    const lang = getApiLanguage();
    const translatedField = `${field}_${lang}`;

    if (item[translatedField]) {
      return item[translatedField];
    }

    // Fallback на английский
    if (item[`${field}_en`]) {
      return item[`${field}_en`];
    }

    // Последний fallback
    return "";
  };

  // Получаем текущий язык для статичных текстов
  const currentLang = i18n.language;
  const staticTitle = staticTexts[currentLang]?.mainTitle || staticTexts.en.mainTitle;
  const staticSubtitle = staticTexts[currentLang]?.subtitle || staticTexts.en.subtitle;
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

        {/* Карточки с новостями */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
            {currentLang === 'ru' ? 'Новости и объявления' :
              currentLang === 'kg' ? 'Жаңылыктар жана жарыялар' :
                'News & Announcements'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Карточка 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Students on campus"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'Новый набор' :
                    currentLang === 'kg' ? 'Жаңы кабыл алуу' :
                      'New Intake'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'Осенний набор на обменные программы 2024' :
                    currentLang === 'kg' ? '2024-жылкы күзгү алмашуу программаларына кабыл алуу' :
                      'Fall 2024 Exchange Programs Intake'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'Открыт прием заявок на осенний семестр 2024 года в университеты-партнеры в Европе и Азии.' :
                    currentLang === 'kg' ? 'Европа жана Азиядагы өнөктөш университеттерге 2024-жылдын күзгү семестрине каттоо ачылды.' :
                      'Applications are now open for the Fall 2024 semester at partner universities in Europe and Asia.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? 'Дедлайн: 15 мая 2024' :
                      currentLang === 'kg' ? 'Акыркы мөөнөт: 2024-жылдын 15-майы' :
                        'Deadline: May 15, 2024'}
                  </span>
                  <button
                    onClick={() => window.open('/exchange/fall-2024', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Подробнее →' :
                      currentLang === 'kg' ? 'Кененирээк →' :
                        'Learn More →'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Карточка 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Scholarship ceremony"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'Стипендия' :
                    currentLang === 'kg' ? 'Стипендия' :
                      'Scholarship'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'Полные стипендии в университетах Германии' :
                    currentLang === 'kg' ? 'Германия университеттеринде толук стипендия' :
                      'Full Scholarships at German Universities'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'DAAD предлагает полные стипендии для магистратуры и PhD в ведущих университетах Германии.' :
                    currentLang === 'kg' ? 'DAAD Германиянын алдыңкы университеттеринде магистратура жана PhD үчүн толук стипендияларды сунуштайт.' :
                      'DAAD offers full scholarships for Master and PhD programs at leading German universities.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? 'До: 30 июня 2024' :
                      currentLang === 'kg' ? 'Чейин: 2024-жылдын 30-июну' :
                        'Until: June 30, 2024'}
                  </span>
                  <button
                    onClick={() => window.open('/scholarships/germany', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Подробнее →' :
                      currentLang === 'kg' ? 'Кененирээк →' :
                        'Learn More →'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Карточка 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Cultural exchange event"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'Мероприятие' :
                    currentLang === 'kg' ? 'Иш-чара' :
                      'Event'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'День международного студента 2024' :
                    currentLang === 'kg' ? 'Эларалык студент күнү 2024' :
                      'International Student Day 2024'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'Присоединяйтесь к празднованию с культурными представлениями, едой и историями студентов по обмену.' :
                    currentLang === 'kg' ? 'Маданий көрүнүштөр, тамак-аш жана алмашуу студенттеринин окуялары менен майрамдоого кошулуңуз.' :
                      'Join the celebration with cultural performances, food, and stories from exchange students.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? '17 ноября 2024' :
                      currentLang === 'kg' ? '2024-жылдын 17-ноябры' :
                        'November 17, 2024'}
                  </span>
                  <button
                    onClick={() => window.open('/events/international-day', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Подробнее →' :
                      currentLang === 'kg' ? 'Кененирээк →' :
                        'Learn More →'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Карточка 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Workshop session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'Воркшоп' :
                    currentLang === 'kg' ? 'Воркшоп' :
                      'Workshop'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'Как успешно подать заявку на программу обмена' :
                    currentLang === 'kg' ? 'Алмашуу программасына ийгиликтүү кантип каттоодон өтүү керек' :
                      'How to Successfully Apply for Exchange Programs'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'Практический воркшоп по подготовке мотивационных писем, рекомендаций и документов.' :
                    currentLang === 'kg' ? 'Мотивация каттарын, сунуштарды жана документтерди даярдоо боюнча практикалык воркшоп.' :
                      'Practical workshop on preparing motivation letters, recommendations, and application documents.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? '25 апреля 2024' :
                      currentLang === 'kg' ? '2024-жылдын 25-апрели' :
                        'April 25, 2024'}
                  </span>
                  <button
                    onClick={() => window.open('/workshops/application', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Зарегистрироваться →' :
                      currentLang === 'kg' ? 'Катталуу →' :
                        'Register →'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Карточка 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-red-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="University partnership signing"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'Партнерство' :
                    currentLang === 'kg' ? 'Өнөктөштүк' :
                      'Partnership'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'Новые партнерства с университетами Японии' :
                    currentLang === 'kg' ? 'Жапония университеттери менен жаңы өнөктөштүктөр' :
                      'New Partnerships with Japanese Universities'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'Подписаны соглашения с 3 университетами Японии для программ обмена и двойных дипломов.' :
                    currentLang === 'kg' ? 'Алмашуу жана кош диплом программалары үчүн Жапониянын 3 университети менен келишимдер кол коюлду.' :
                      'Agreements signed with 3 Japanese universities for exchange and double degree programs.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? 'С марта 2024' :
                      currentLang === 'kg' ? '2024-жылдын мартынан тартып' :
                        'Starting March 2024'}
                  </span>
                  <button
                    onClick={() => window.open('/partnerships/japan', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Подробнее →' :
                      currentLang === 'kg' ? 'Кененирээк →' :
                        'Learn More →'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Карточка 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Student success story"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentLang === 'ru' ? 'История успеха' :
                    currentLang === 'kg' ? 'Ийгилик окуясы' :
                      'Success Story'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {currentLang === 'ru' ? 'Из Кыргызстана в Кембридж: история Айгерим' :
                    currentLang === 'kg' ? 'Кыргызстандан Кембриджге: Айгеримдин окуясы' :
                      'From Kyrgyzstan to Cambridge: Aigerim\'s Story'}
                </h3>
                <p className="text-blue-100 mb-4">
                  {currentLang === 'ru' ? 'Выпускница программы обмена делится опытом учебы в одном из лучших университетов мира.' :
                    currentLang === 'kg' ? 'Алмашуу программасынын бүтүрүүчүсү дүйнөнүн мыкты университеттеринин биринде окуу тажрыйбасын бөлүшөт.' :
                      'An exchange program graduate shares her experience studying at one of the world\'s top universities.'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">
                    {currentLang === 'ru' ? 'Интервью' :
                      currentLang === 'kg' ? 'Интервью' :
                        'Interview'}
                  </span>
                  <button
                    onClick={() => window.open('/stories/cambridge', '_blank')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
                  >
                    {currentLang === 'ru' ? 'Читать →' :
                      currentLang === 'kg' ? 'Окуу →' :
                        'Read →'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Кнопка "Все новости" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => window.open('/news', '_blank')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
            >
              {currentLang === 'ru' ? 'Все новости и объявления' :
                currentLang === 'kg' ? 'Бардык жаңылыктар жана жарыялар' :
                  'All News & Announcements'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExchangePrograms;