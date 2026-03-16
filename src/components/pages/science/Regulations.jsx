import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Search, ArrowRight, Globe } from "lucide-react";

const Regulations = () => {
  const { t, i18n } = useTranslation();
  const [regulations, setRegulations] = useState([]);
  const [filteredRegulations, setFilteredRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getApiLanguage = () => {
    const lang = (i18n.language || "ru").split("-")[0].toLowerCase();
    if (lang === "ky") return "kg";
    if (lang === "en" || lang === "kg" || lang === "ru") return lang;
    return "ru";
  };

  const getLocalizedPdf = (item) => {
    const apiLang = getApiLanguage();
    const langPdf =
      item[`pdf_${apiLang}`] ||
      (apiLang === "kg" ? item.pdf_ky : undefined);

    if (langPdf) return langPdf;
    if (item.pdf) return item.pdf;
    return "";
  };

  const getLocalizedTitle = (item) => {
    const apiLang = getApiLanguage();
    const langTitle =
      item[`title_${apiLang}`] ||
      (apiLang === "kg" ? item.title_ky : undefined);

    if (langTitle) return langTitle;
    if (item.title) return item.title;
    return "";
  };

  const fetchRegulations = async () => {
    setLoading(true);
    try {
      const apiLang = getApiLanguage();
      const response = await fetch(
        `https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/journal/regulations/?lang=${apiLang}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : [];

      const processedData = list.map((item) => ({
        ...item,
        localizedTitle: getLocalizedTitle(item),
        localizedPdf: getLocalizedPdf(item),
      }));

      setRegulations(processedData);
      setFilteredRegulations(processedData);
    } catch (error) {
      console.error("Fetch regulations error:", error);
      setRegulations([]);
      setFilteredRegulations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulations();
  }, [i18n.language]);

  useEffect(() => {
    const results = regulations.filter((item) =>
      item.localizedTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegulations(results);
  }, [searchTerm, regulations]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">
              <Globe size={16} />
              <span>
                {i18n.language === "ru"
                  ? "Наука"
                  : i18n.language === "en"
                    ? "Science"
                    : "Илим"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {t("nav.regulations", "Положения")}
            </h1>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("search_placeholder", "Поиск...")}
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"
              />
            ))
          ) : filteredRegulations.length > 0 ? (
            filteredRegulations.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800">
                        {item.localizedTitle}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          PDF
                        </span>
                        • {t("last_updated", "Обновлено")}: {item.year || "2026"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.localizedPdf ? (
                      <a
                        href={item.localizedPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                      >
                        <span>{t("open_file", "Открыть")}</span>
                        <ArrowRight size={18} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-300 text-slate-500 rounded-xl font-bold cursor-not-allowed"
                      >
                        <span>{t("file_unavailable", "Файл недоступен")}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 italic">
                {t("no_results", "Ничего не найдено")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regulations;
