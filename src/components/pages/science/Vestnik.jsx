import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Предположим, используем axios или замените на свой api-клиент

const API_BASE = "/api/journal";

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("about");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Список разделов для навигации
  const menuItems = [
    { id: "about", label: t("vestnik.about", "Сведения о журнале") },
    { id: "aims", label: t("vestnik.aims", "Цели и сфера") },
    { id: "editorial-office", label: t("vestnik.office", "Редакция") },
    { id: "editorial-board", label: t("vestnik.board", "Редколлегия") },
    { id: "guidelines", label: t("vestnik.guidelines", "Руководство для авторов") },
    { id: "latest-issue", label: t("vestnik.latest", "Последний номер") },
    { id: "archive", label: t("vestnik.archive", "Архив") },
    { id: "requirements", label: t("vestnik.reqs", "Требования") },
    { id: "indexing", label: t("vestnik.indexing", "Индексирование") },
    { id: "ethics", label: t("vestnik.ethics", "Этика") },
    { id: "contacts", label: t("vestnik.contacts", "Контакты") },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    const lang = i18n.language?.split("-")[0] || "ru";
    try {
      let url = `${API_BASE}/${activeTab}/?lang=${lang}`;
      // Для текстовых разделов API ожидает /<section>/, для спец. разделов — свои эндпоинты
      const response = await axios.get(url);
      setContent(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, i18n.language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="min-h-screen bg-slate-900 py-12 lg:py-20 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase tracking-wider">
          {t("vestnik.title", "Вестник университета")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Левое меню (Sidebar) */}
          <aside className="lg:col-span-4 space-y-2">
            <div className="sticky top-24 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${activeTab === item.id
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "hover:bg-white/10 text-slate-300"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Правая часть (Контент) */}
          <main className="lg:col-span-8 bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 min-h-[600px] relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <SkeletonLoader key="loader" />
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {renderContent(activeTab, content, t)}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
};

// Функция отрисовки контента в зависимости от раздела
const renderContent = (tab, data, t) => {
  if (!data) return <p className="text-slate-400">{t("no_data", "Данные загружаются или отсутствуют...")}</p>;

  // 1. Редакция (Editorial Office)
  if (tab === "editorial-office") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((person, idx) => (
          <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
            <img src={person.photo} alt={person.full_name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-2 border-emerald-400" />
            <h4 className="text-xl font-bold">{person.full_name}</h4>
            <p className="text-emerald-400 text-sm mt-2">{person.position}</p>
          </div>
        ))}
      </div>
    );
  }

  // 2. Редколлегия (Editorial Board - простой список)
  if (tab === "editorial-board") {
    return (
      <ul className="space-y-3">
        {data.map((name, idx) => (
          <li key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <span className="text-emerald-400 font-mono">{idx + 1}.</span>
            {name}
          </li>
        ))}
      </ul>
    );
  }

  // 3. Последний выпуск и Архив
  if (tab === "latest-issue" || tab === "archive") {
    const items = Array.isArray(data) ? data : [data];
    return (
      <div className="space-y-6">
        {items.map((issue, idx) => (
          <div key={idx} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
            {/* Если есть фото обложки для последнего номера, можно добавить условие */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-emerald-400">{issue.year}</h3>
              <p className="text-xl mb-4">{issue.title}</p>
              <a
                href={issue.pdf_file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-full transition-colors"
              >
                <span>📄 PDF</span>
                <span>{t("download", "Открыть")}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 4. Обычные текстовые разделы (CKEditor контент)
  return (
    <div
      className="prose prose-invert max-w-none text-slate-200 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: data.content || "" }}
    />
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-white/10 w-1/3 rounded"></div>
    <div className="h-4 bg-white/10 w-full rounded"></div>
    <div className="h-4 bg-white/10 w-full rounded"></div>
    <div className="h-4 bg-white/10 w-2/3 rounded"></div>
  </div>
);

export default Vestnik;