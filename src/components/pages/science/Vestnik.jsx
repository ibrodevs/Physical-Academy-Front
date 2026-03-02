import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../../services/api";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-10 bg-white/5 w-1/3 rounded-xl"></div>
    <div className="space-y-3">
      <div className="h-4 bg-white/5 w-full rounded"></div>
      <div className="h-4 bg-white/5 w-full rounded"></div>
      <div className="h-4 bg-white/5 w-2/3 rounded"></div>
    </div>
  </div>
);

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("about");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const result = await apiService.getVestnikData(activeTab, i18n.language);
      setData(result);
    } catch (err) {
      console.error("Ошибка загрузки вкладки:", activeTab, err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [activeTab, i18n.language]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-red-400 py-10 text-center">{error}</div>;
    if (!data) return null;

    if (activeTab === "editorial-office" && Array.isArray(data)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((person, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-5">
              <img
                src={person.photo || "/placeholder-user.png"}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
                alt={person.full_name}
              />
              <div>
                <h4 className="text-white font-bold">{person.full_name}</h4>
                <p className="text-emerald-400 text-sm">{person.position}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "editorial-board" && Array.isArray(data)) {
      return (
        <div className="flex flex-col gap-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white text-lg font-medium hover:bg-white/10 transition-all"
            >
              {typeof item === 'string' ? item : item.full_name}
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "archive" || activeTab === "latest-issue") {
      const items = Array.isArray(data) ? data : [data];
      return (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase">{item.year}</span>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
              </div>
              {item.pdf_file && (
                <a href={item.pdf_file} target="_blank" rel="noreferrer" className="bg-emerald-500 text-slate-900 px-5 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-colors">
                  PDF
                </a>
              )}
            </div>
          ))}
        </div>
      );
    }

    const htmlContent = data.content || (typeof data === 'string' ? data : "");
    return (
      <div
        // Добавлен принудительный класс text-white и переопределение стилей для всех вложенных элементов
        className="prose prose-invert max-w-none prose-emerald text-white [&_*]:text-white/90"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };
  

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <nav className="lg:col-span-4 space-y-2">
            {/* ИСПРАВЛЕНИЕ: Заголовок теперь использует t() для перевода */}
            <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">
              {t("vestnik.title", "Вестник")} 
            </h2>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                  ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20"
                  : "hover:bg-white/5 text-slate-400"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <main className="lg:col-span-8 bg-slate-900/50 rounded-[2.5rem] p-8 md:p-12 border border-white/5 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + loading}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Vestnik;