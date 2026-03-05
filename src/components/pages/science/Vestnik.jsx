import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../../services/api";

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("about");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Состояния для динамических списков (Архив и Редакция)
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [archiveYears, setArchiveYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const menuItems = [
    { id: "about", label: t("vestnik.about", "Сведения о журнале") },
    { id: "aims", label: t("vestnik.aims", "Цели и сфера") },
    { id: "editorial-office", label: t("vestnik.office", "Редакция") },
    { id: "editorial-board", label: t("vestnik.board", "Редколлегия") },
    { id: "guidelines", label: t("vestnik.guidelines", "Руководство для авторов") },
    { id: "latest-issue", label: t("vestnik.latest", "Последний номер") },
    { id: "archive", label: t("vestnik.archieve", "Архив") },
    { id: "requirements", label: t("vestnik.requirements", "Требования") },
    { id: "indexing", label: t("vestnik.indexing", "Индексирование") },
    { id: "ethics", label: t("vestnik.ethics", "Этика") },
    { id: "contacts", label: t("vestnik.contacts", "Контакты") },
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Запрос отправляет текущий язык (i18n.language), поэтому API вернет нужный PDF
      const response = await apiService.getVestnikData(activeTab, i18n.language);
      const results = response.results || response;

      if (activeTab === "archive" && Array.isArray(results)) {
        const years = results.map(item => item.year);
        setArchiveYears(years);
        if (years.length > 0 && !selectedYear) setSelectedYear(years[0]);
        setData(results);
      }
      else if (activeTab.includes("editorial") && Array.isArray(results)) {
        if (results.length > 0) setSelectedPerson(results[0]);
        setData(results);
      }
      else {
        const sectionData = Array.isArray(results)
          ? results.find(item => item.section === activeTab)
          : results;
        setData(sectionData);
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [activeTab, i18n.language, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMenuClick = (id) => {
    setActiveTab(id);
    if (id !== "archive") setSelectedYear(null);
    if (!id.includes("editorial")) setSelectedPerson(null);
  };

  const renderMainContent = () => {
    if (loading) return <div className="text-emerald-500 animate-pulse font-bold">Загрузка...</div>;
    if (error) return <div className="text-red-400 py-10 text-center">{error}</div>;
    if (!data) return null;

    // 1. РЕНДЕР РЕДАКЦИИ
    if (selectedPerson && activeTab.includes("editorial")) {
      return (
        <motion.div key={selectedPerson.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={selectedPerson.image || "/placeholder-user.png"} className="w-40 h-52 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl" alt={selectedPerson.name} />
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{selectedPerson.name}</h3>
              <p className="text-emerald-400 text-xl font-medium">{selectedPerson.position}</p>
            </div>
          </div>
          <div
            className="prose prose-invert max-w-none pt-6 border-t border-white/10 [&_span]:!text-inherit [&_p]:!text-inherit [&_div]:!text-inherit"
            dangerouslySetInnerHTML={{ __html: selectedPerson.description || "" }}
          />
        </motion.div>
      );
    }

    // 2. РЕНДЕР АРХИВА
    if (activeTab === "archive" && Array.isArray(data)) {
      const currentYearData = data.find(item => item.year === selectedYear);
      const issues = currentYearData ? currentYearData.items : [];
      return (
        <motion.div key={selectedYear} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="grid gap-4">
            {issues.map((issue) => (
              <div key={issue.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all group">
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">{issue.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{selectedYear} {t("vestnik.year_short", "г.")}</p>
                </div>
                {issue.pdf && (
                  <a href={issue.pdf} target="_blank" rel="noreferrer" className="bg-emerald-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-transform hover:scale-105">PDF</a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    // 3. ОБЫЧНЫЙ ТЕКСТ + PDF (about, requirements, indexing...)
    const htmlContent = data.content || (typeof data === 'string' ? data : "");
    const pdfLink = data[`pdf_${i18n.language}`] || data.pdf;
    const isRequirements = activeTab === "requirements";

    const pdfButton = pdfLink && pdfLink.trim() ? (
      <div className={`${isRequirements ? "mb-8 text-center" : "pt-8 border-t border-white/10 text-center"}`}>
        <a
          key={`${activeTab}-${i18n.language}`} // Ключ для смены PDF ссылки при смене языка
          href={pdfLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-emerald-500 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t("vestnik.download", "Скачать PDF версию")}
        </a>
      </div>
    ) : null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeTab} className="flex flex-col h-full">
        {/* В Требованиях PDF кнопка сверху */}
        {isRequirements && pdfButton}

        <div
          className="prose prose-invert max-w-none prose-emerald mb-10 overflow-x-hidden
                     [&_span]:!text-inherit [&_p]:!text-inherit [&_div]:!text-inherit [&_b]:!text-inherit [&_strong]:!text-inherit"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* В остальных разделах PDF кнопка снизу */}
        {!isRequirements && pdfButton}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <nav className="lg:col-span-4 space-y-2">
            <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">{t("vestnik.title", "Вестник")}</h2>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${isActive ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20" : "hover:bg-white/5 text-slate-400"}`}
                  >
                    {item.label}
                  </button>

                  {/* Подменю Редакции */}
                  <AnimatePresence>
                    {isActive && item.id.includes("editorial") && Array.isArray(data) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden flex flex-col ml-6 mt-2 border-l-2 border-emerald-500/20">
                        {data.map((person) => (
                          <button key={person.id} onClick={() => setSelectedPerson(person)} className={`text-left px-4 py-2 text-sm transition-colors ${selectedPerson?.id === person.id ? "text-emerald-400 font-bold" : "text-slate-500 hover:text-white"}`}>
                            • {person.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Подменю Архива */}
                  <AnimatePresence>
                    {isActive && item.id === "archive" && archiveYears.length > 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden flex flex-col ml-6 mt-2 border-l-2 border-emerald-500/20">
                        {archiveYears.map((year) => (
                          <button key={year} onClick={() => setSelectedYear(year)} className={`text-left px-4 py-2 text-sm transition-colors ${selectedYear === year ? "text-emerald-400 font-bold" : "text-slate-500 hover:text-white"}`}>
                            • {year} {t("vestnik.year_short", "г.")}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <main className="lg:col-span-8 bg-slate-900/50 rounded-[2.5rem] p-8 md:p-12 border border-white/5 min-h-[600px] backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {renderMainContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Vestnik;