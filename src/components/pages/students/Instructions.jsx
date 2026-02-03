// Instructions.jsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Instructions = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);

  const [backendData, setBackendData] = useState({
    title: '',
    subtitle: '',
    documents: [],
    loading: true,
    error: null
  });

  const sectionRef = useRef(null);

  const staticTexts = {
    en: {
      title: "Instructions & Documents",
      subtitle: "Academic documents and instructions for students",
      noDocuments: "No documents available at the moment",
      checkBackLater: "Please check back later for updates"
    },
    ru: {
      title: "Инструкции и Документы",
      subtitle: "Академические документы и инструкции для студентов",
      noDocuments: "На данный момент документы отсутствуют",
      checkBackLater: "Пожалуйста, проверьте позже для обновлений"
    },
    kg: {
      title: "Нускамалар жана Документтер",
      subtitle: "Студенттер үчүн академиялык документтер жана нускамалар",
      noDocuments: "Учурда документтер жок",
      checkBackLater: "Жаңыртуулар үчүн кийинчерэек текшериңиз"
    }
  };

  useEffect(() => {
    // Используем статичные данные
    const currentLang = i18n.language || 'en';
    const texts = staticTexts[currentLang] || staticTexts.en;

    const demoDocuments = [
      {
        id: 1,
        name: currentLang === 'ru' ? "Учебный план 2025" :
          currentLang === 'kg' ? "Окуу планы 2025" :
            "Academic Curriculum 2025",
        description: currentLang === 'ru' ? "Полный учебный план на 2025 учебный год" :
          currentLang === 'kg' ? "2025 окуу жылынын толук окуу планы" :
            "Complete academic curriculum for 2025 academic year",
        format: "PDF",
        size: "1.8 MB",
        version: "2.0",
        pages: 35,
        downloads: 156,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-01-15"
      },
      {
        id: 2,
        name: currentLang === 'ru' ? "Правила проведения экзаменов" :
          currentLang === 'kg' ? "Эмтихан өткөрүү эрежелери" :
            "Examination Rules and Regulations",
        description: currentLang === 'ru' ? "Официальные правила и процедуры проведения экзаменов" :
          currentLang === 'kg' ? "Эмтихан өткөрүүнүн расмий эрежелери жана процедуралары" :
            "Official examination rules and procedures",
        format: "PDF",
        size: "0.9 MB",
        version: "1.5",
        pages: 18,
        downloads: 234,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-02-10"
      },
      {
        id: 3,
        name: currentLang === 'ru' ? "Расписание занятий" :
          currentLang === 'kg' ? "Сабактардын графиги" :
            "Class Schedule",
        description: currentLang === 'ru' ? "Расписание занятий на весенний семестр 2025" :
          currentLang === 'kg' ? "2025-жылдын жазгы семестри үчүн сабактардын графиги" :
            "Class schedule for Spring semester 2025",
        format: "PDF",
        size: "1.2 MB",
        version: "3.1",
        pages: 12,
        downloads: 189,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-01-20"
      },
      {
        id: 4,
        name: currentLang === 'ru' ? "Требования к выпускной работе" :
          currentLang === 'kg' ? "Бүтүрүү ишине талаптар" :
            "Graduation Thesis Requirements",
        description: currentLang === 'ru' ? "Структура и требования к выпускной квалификационной работе" :
          currentLang === 'kg' ? "Бүтүрүү квалификациялык ишинин структурасы жана талаптары" :
            "Structure and requirements for graduation thesis",
        format: "PDF",
        size: "2.1 MB",
        version: "1.8",
        pages: 28,
        downloads: 145,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-01-05"
      },
      {
        id: 5,
        name: currentLang === 'ru' ? "Академический календарь" :
          currentLang === 'kg' ? "Академиялык календарь" :
            "Academic Calendar",
        description: currentLang === 'ru' ? "Важные даты и события академического года 2025-2026" :
          currentLang === 'kg' ? "2025-2026 окуу жылынын маанилүү даталары жана окуялары" :
            "Important dates and events for 2025-2026 academic year",
        format: "PDF",
        size: "0.7 MB",
        version: "2.2",
        pages: 8,
        downloads: 278,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-01-01"
      },
      {
        id: 6,
        name: currentLang === 'ru' ? "Руководство по написанию научных статей" :
          currentLang === 'kg' ? "Илимий макалаларды жазган боюнча колдонмо" :
            "Guide to Writing Research Papers",
        description: currentLang === 'ru' ? "Методические указания по подготовке и оформлению научных статей" :
          currentLang === 'kg' ? "Илимий макалаларды даярдоо жана көркөмдөө боюнча методикалык көрсөтмөлөр" :
            "Methodological guidelines for preparing and formatting research papers",
        format: "PDF",
        size: "1.5 MB",
        version: "1.3",
        pages: 22,
        downloads: 167,
        downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        lastUpdated: "2025-01-25"
      }
    ];

    setBackendData({
      title: texts.title,
      subtitle: texts.subtitle,
      documents: demoDocuments,
      loading: false,
      error: null
    });
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

  const handleDownload = async (documentId, documentName) => {
    setIsDownloading(documentId);
    try {
      // Находим документ
      const document = backendData.documents.find(doc => doc.id === documentId);
      if (document?.downloadUrl) {
        // Открываем PDF в новой вкладке
        window.open(document.downloadUrl, "_blank");
      }

      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setIsDownloading(null);
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse h-48">
          <div className="space-y-3">
            <div className="h-6 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
            <div className="h-10 bg-white/10 rounded mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl text-white mb-4">Error Loading Documents</h3>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  );

  const currentLang = i18n.language || 'en';

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📚</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📋</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">📄</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {backendData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {backendData.subtitle}
          </p>
        </motion.div>

        {backendData.loading ? (
          <LoadingSkeleton />
        ) : backendData.error ? (
          <ErrorMessage onRetry={() => window.location.reload()} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {backendData.documents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 backdrop-blur-sm">
                  📚
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {staticTexts[currentLang]?.noDocuments || staticTexts.en.noDocuments}
                </h3>
                <p className="text-blue-200">
                  {staticTexts[currentLang]?.checkBackLater || staticTexts.en.checkBackLater}
                </p>
              </div>
            ) : (
              backendData.documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-emerald-400/50 transition-all duration-300 group h-full flex flex-col shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Заголовок документа */}
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center text-2xl text-emerald-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                          📄
                        </div>
                        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium">
                          {document.format}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 mb-2 line-clamp-2">
                        {document.name}
                      </h3>

                      <p className="text-blue-100 text-sm line-clamp-2 mb-3">
                        {document.description}
                      </p>
                    </div>

                    {/* Информация о документе */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-blue-300 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <span className="mr-1">📖</span>
                            {document.pages} {currentLang === 'ru' ? 'стр.' : currentLang === 'kg' ? 'бет' : 'pages'}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">⚖️</span>
                            {document.size}
                          </span>
                        </div>
                        <span className="text-emerald-300">
                          v{document.version}
                        </span>
                      </div>

                      {/* Кнопка скачивания */}
                      <button
                        onClick={() => handleDownload(document.id, document.name)}
                        disabled={isDownloading === document.id}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium text-center flex items-center justify-center group/btn disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-emerald-500/30"
                      >
                        {isDownloading === document.id ? (
                          <>
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                            {currentLang === 'ru' ? 'Загрузка...' :
                              currentLang === 'kg' ? 'Жүктөлүүдө...' :
                                'Downloading...'}
                          </>
                        ) : (
                          <>
                            <span className="mr-2 group-hover/btn:translate-x-1 transition-transform duration-300">⬇️</span>
                            {currentLang === 'ru' ? 'Скачать PDF' :
                              currentLang === 'kg' ? 'PDF жүктөө' :
                                'Download PDF'}
                          </>
                        )}
                      </button>

                      {/* Дата обновления */}
                      <div className="text-center mt-3 text-xs text-blue-400">
                        {currentLang === 'ru' ? 'Обновлено' :
                          currentLang === 'kg' ? 'Жаңыртылды' :
                            'Updated'} {document.lastUpdated}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Instructions;