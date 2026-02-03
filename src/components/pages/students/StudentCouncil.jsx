// StudentCouncil.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const StudentCouncil = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedMember, setExpandedMember] = useState(null);
  const [expandedInitiative, setExpandedInitiative] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    members: [],
    initiatives: [],
    events: [],
    stats: [],
    loading: false,
    error: null,
  });

  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      en: "en",
      ru: "ru",
      kg: "kg",
    };
    return langMap[i18n.language] || "ru";
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
      const response = await fetch(
        `${API_URL}/api/student-clubs/council-page/?lang=${lang}`
      );

      // Проверяем content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn(
          "Non-JSON response from council page:",
          text.substring(0, 200)
        );
        setBackendData((prev) => ({
          ...prev,
          loading: false,
          error: "Invalid response format",
        }));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setBackendData({
        members: data.members || [],
        initiatives: data.initiatives || [],
        events: data.events || [],
        stats: data.stats || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching council data:", error);
      setBackendData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
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

  const commonInfo = t("studentCouncil.commonInfo", { returnObjects: true });

  const toggleMember = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  const toggleInitiative = (index) => {
    setExpandedInitiative(expandedInitiative === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedMember(null);
    setExpandedInitiative(null);
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Map app language codes to valid Intl locales.
    // i18n is using 'kg' for Kyrgyz; Intl expects 'ky' or a region-tag like 'ky-KG'.
    const localeMap = {
      en: "en-US",
      ru: "ru-RU",
      kg: "ky-KG",
    };

    const locale = localeMap[i18n.language] || i18n.language || "ru-RU";

    try {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      // Fallback in case the provided locale is not supported in the environment
      console.warn(
        "Locale not supported for date formatting, falling back to ru-RU:",
        locale,
        err
      );
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Получение статуса события
  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (event.status === "past" || eventDate < now) {
      return {
        status: "past",
        color: "bg-gray-500/20 text-gray-300",
        label: t("studentCouncil.past"),
      };
    } else if (
      event.status === "ongoing" ||
      eventDate.toDateString() === now.toDateString()
    ) {
      return {
        status: "ongoing",
        color: "bg-emerald-500/20 text-emerald-300",
        label: t("studentCouncil.ongoing"),
      };
    } else {
      return {
        status: "upcoming",
        color: "bg-blue-500/20 text-blue-300",
        label: t("studentCouncil.upcoming"),
      };
    }
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
        {t("studentCouncil.errorTitle")}
      </h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("studentCouncil.retry")}
      </button>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-green-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Символы студенческой активности */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">👥</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🎯
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📢</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌟</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("studentCouncil.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 rounded-full"></div>
        </motion.div>
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-10 shadow-2xl border border-white/20">
          <div className="space-y-8">
            {/* Декоративные элементы */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl"></div>

            {/* Заголовок с иконкой */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {i18n.language === 'ru' ? 'Наша Цель' :
                  i18n.language === 'en' ? 'Our Vision' :
                    'Биздин Көз Караш'}
              </h3>
            </div>

            {/* Текст в градиентной рамке */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
                <p className="text-lg lg:text-xl leading-relaxed text-white/90 font-light tracking-wide">
                  {i18n.language === 'ru'
                    ? 'Мы создаем инклюзивную среду, где каждый студент может раскрыть свой потенциал через участие в студенческих инициативах, развивая лидерские качества и профессиональные навыки для будущих достижений.'
                    : i18n.language === 'en'
                      ? 'We foster an inclusive environment where every student can unlock their potential through participation in student initiatives, developing leadership qualities and professional skills for future achievements.'
                      : 'Ар бир студент потенциалын ачып, студенттик демилгелерге катышуу аркылуу келечектеги жетишкендиктер үчүн лидердик сапаттарды жана кесиптик көндүмдөрдү өнүктүрүүгө мүмкүнчүлүк берген инклюзивдүү чөйрө түзөбүз.'}
                </p>

                {/* Подчеркивание */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span className="animate-pulse">✨</span>
                    <span>
                      {i18n.language === 'ru' ? 'Развиваем лидерство · Создаем возможности · Формируем будущее' :
                        i18n.language === 'en' ? 'Developing leadership · Creating opportunities · Shaping the future' :
                          'Лидердикти өнүктүрүү · Мүмкүнчүлүктөрдү түзүү · Келечекти түзүү'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentCouncil;  