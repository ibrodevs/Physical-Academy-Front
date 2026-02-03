import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getDisabilitiesPageData } from "../../../services/api";
import Loading from "../../common/Loading";

const StudentsDisabilities = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("support");
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Translation data for UI elements only, not content
  const uiTranslations = t("students.disabilities", { returnObjects: true });

  // Get current language
  const currentLanguage = i18n.language || "ru";

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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDisabilitiesPageData(currentLanguage);
        setApiData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch disabilities data:", err);
        setError(t("common.errors.apiError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage, t]);

  // Reset active service when data changes
  useEffect(() => {
    setActiveService(0);
  }, [apiData, currentLanguage]);

  // Auto-switching services
  useEffect(() => {
    if (
      apiData &&
      apiData.support_services &&
      apiData.support_services.length > 0
    ) {
      const interval = setInterval(() => {
        setActiveService(
          (prev) => (prev + 1) % apiData.support_services.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [apiData]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с символами инклюзивности */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Символы инклюзивности */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">♿</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🤝
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">❤️</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌍</div>
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
            {apiData?.title || uiTranslations.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {apiData?.subtitle || uiTranslations.subtitle}
          </p>
          {error && (
            <div className="bg-red-500/20 text-red-100 p-3 rounded-lg mt-4 inline-block">
              {error}
            </div>
          )}
        </motion.div>




        {/* Контент */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className="p-6 lg:p-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loading />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "support" && (
                  <SupportServices
                    key="support"
                    data={apiData?.support_services || []}
                    activeService={activeService}
                    onServiceChange={setActiveService}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
                {activeTab === "contacts" && (
                  <Contacts
                    key="contacts"
                    data={{
                      contacts: apiData?.contacts || [],
                      emergency: apiData?.emergency || null,
                    }}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
                {activeTab === "resources" && (
                  <Resources
                    key="resources"
                    data={apiData?.resources || []}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SupportServices = ({ data, activeService, onServiceChange, uiTexts }) => (
  <div className="space-y-8">
    {/* Улучшенный стиль h1 */}
    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight max-w-4xl">
      {uiTexts.mainHeader}
    </h1>

    {/* Линия-разделитель для стиля (опционально) */}
    <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>

    {/* Здесь будет остальной контент (карточки и т.д.) */}
  </div>
);


export default StudentsDisabilities;
