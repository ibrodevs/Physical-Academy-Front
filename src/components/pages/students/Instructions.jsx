// Instructions.jsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getStudentInstructions } from "../../../services/api";

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
    const fetchInstructions = async () => {
      try {
        setBackendData(prev => ({ ...prev, loading: true, error: null }));
        const currentLang = i18n.language || 'en';
        const instructions = await getStudentInstructions(currentLang);

        // Transform the data to match the expected format
        const documents = instructions.map(item => ({
          id: item.id,
          name: item.file_name,
          downloadUrl: item.pdf,
          format: "PDF", // Assuming all are PDFs, but could be determined from URL
        }));

        const texts = staticTexts[currentLang] || staticTexts.en;

        setBackendData({
          title: texts.title,
          subtitle: texts.subtitle,
          documents: documents,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching instructions:", error);
        const texts = staticTexts[i18n.language || 'en'] || staticTexts.en;
        setBackendData({
          title: texts.title,
          subtitle: texts.subtitle,
          documents: [],
          loading: false,
          error: error.message || "Failed to load instructions"
        });
      }
    };

    fetchInstructions();
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
      <div className="text-red-400 mb-4 flex justify-center">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      </div>
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

        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
          </svg>
        </div>
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
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
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
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-emerald-400/50 transition-all duration-300 group shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="p-6 text-center">
                    {/* Название документа */}
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 mb-6">
                      {document.name}
                    </h3>

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
                            <svg className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          {currentLang === 'ru' ? 'Скачать PDF' :
                            currentLang === 'kg' ? 'PDF жүктөө' :
                              'Download PDF'}
                        </>
                      )}
                    </button>
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