import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI Selection State
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchVestnikData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lang = i18n.language || 'ru';
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/bulletin/sidebar/?lang=${lang}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const result = await response.json();
      setData(result);

      // Logic 6.2: Auto-select first year and first issue
      if (result.length > 0) {
        setSelectedYear(result[0].year);
        if (result[0].issues && result[0].issues.length > 0) {
          setSelectedIssue(result[0].issues[0]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchVestnikData();
  }, [fetchVestnikData]);

  const handleYearClick = (yearData) => {
    setSelectedYear(yearData.year);
    if (yearData.issues.length > 0) {
      setSelectedIssue(yearData.issues[0]);
    } else {
      setSelectedIssue(null);
    }
  };

  if (error) return <ErrorMessage onRetry={fetchVestnikData} message={error} t={t} />;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <Header t={t} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 p-6 lg:p-8">

          {/* LEFT SIDE: Navigation (4.0) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">📅</span> {t("vestnik.archiveTitle", "Архив")}
            </h3>

            {loading ? <SkeletonNav /> : (
              <div className="space-y-3">
                {data.map((item) => (
                  <div key={item.year} className="space-y-2">
                    <button
                      onClick={() => handleYearClick(item)}
                      className={`w-full flex justify-between p-4 rounded-xl transition-all ${selectedYear === item.year
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-white/5 text-blue-100 hover:bg-white/10"
                        }`}
                    >
                      <span className="font-bold">{item.year}</span>
                    </button>

                    {/* Issues List (4.2) */}
                    <AnimatePresence>
                      {selectedYear === item.year && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="ml-4 border-l-2 border-emerald-400/30 pl-4 space-y-2"
                        >
                          {item.issues.map((issue) => (
                            <button
                              key={issue.id}
                              onClick={() => setSelectedIssue(issue)}
                              className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${selectedIssue?.id === issue.id
                                  ? "text-emerald-400 font-bold bg-emerald-400/10"
                                  : "text-blue-200 hover:text-white"
                                }`}
                            >
                              №{issue.number}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Content (5.0) */}
          <div className="lg:col-span-8 bg-white/5 rounded-2xl p-6 min-h-[500px]">
            {loading ? <SkeletonContent /> : selectedIssue ? (
              <motion.div
                key={selectedIssue.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="prose prose-invert max-w-none"
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedYear} — {t("vestnik.issueNumber", "Выпуск")} №{selectedIssue.number}
                </h2>
                <div className="w-20 h-1 bg-emerald-400 mb-8 rounded-full"></div>

                {/* CKEditor HTML Rendering (5.1) */}
                <div
                  className="vestnik-content text-blue-50 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedIssue.description || `<p>${t("vestnik.noInfo", "Информация отсутствует")}</p>` }}
                />
              </motion.div>
            ) : (
              <EmptyState t={t} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Sub-Components ---

const Header = ({ t }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("vestnik.title", "Вестник")}</h1>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto"></div>
  </div>
);

const ErrorMessage = ({ onRetry, message, t }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
    <div className="text-6xl mb-4">⚠️</div>
    <p className="text-white text-xl mb-6">{t("vestnik.error", "Не удалось загрузить данные")}</p>
    <button onClick={onRetry} className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600">
      {t("vestnik.retry", "Повторить")}
    </button>
  </div>
);

const EmptyState = ({ t }) => (
  <div className="flex flex-col items-center justify-center h-full text-blue-200">
    <div className="text-5xl mb-4">📚</div>
    <p>{t("vestnik.empty", "Данные отсутствуют")}</p>
  </div>
);

const SkeletonNav = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/10 rounded-xl" />)}
  </div>
);

const SkeletonContent = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-white/10 w-1/2 rounded-lg" />
    <div className="h-4 bg-white/10 w-full rounded" />
    <div className="h-4 bg-white/10 w-full rounded" />
    <div className="h-4 bg-white/10 w-3/4 rounded" />
  </div>
);

export default Vestnik;