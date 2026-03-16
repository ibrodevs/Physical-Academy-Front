import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Search, ArrowRight, Globe } from "lucide-react";

const TopicRegistry = () => {
  const { t, i18n } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Backend ожидает ru/en/kg. Для совместимости ky -> kg.
  const getApiLanguage = () => {
    const lang = (i18n.language || "ru").split("-")[0].toLowerCase();
    if (lang === "ky") return "kg";
    if (lang === "en" || lang === "kg" || lang === "ru") return lang;
    return "ru";
  };

  // Функция для получения правильной PDF ссылки в зависимости от языка
  const getLocalizedPdf = (topic) => {
    const apiLang = getApiLanguage();

    // Проверяем наличие поля pdf с кодом языка (pdf_ru, pdf_en, pdf_kg/ky)
    const langPdf =
      topic[`pdf_${apiLang}`] ||
      (apiLang === "kg" ? topic.pdf_ky : undefined);
    if (langPdf) return langPdf;

    // Если нет специфичного для языка PDF, пробуем обычное поле pdf
    if (topic.pdf) return topic.pdf;

    // Если ничего нет, возвращаем пустую строку
    return "";
  };

  // Функция для получения переведенного заголовка
  const getLocalizedTitle = (topic) => {
    const apiLang = getApiLanguage();

    // Проверяем наличие поля title с кодом языка (title_ru, title_en, title_kg/ky)
    const langTitle =
      topic[`title_${apiLang}`] ||
      (apiLang === "kg" ? topic.title_ky : undefined);
    if (langTitle) return langTitle;

    // Если нет специфичного для языка заголовка, пробуем обычное поле title
    if (topic.title) return topic.title;

    // Если ничего нет, возвращаем пустую строку
    return "";
  };

  // Функция загрузки данных
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const apiLang = getApiLanguage();
      const response = await fetch(
        `https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/journal/theme-registry/?lang=${apiLang}`
      );
      const data = await response.json();

      // Обрабатываем данные, добавляя локализованные поля для удобства
      const processedData = data.map(topic => ({
        ...topic,
        localizedTitle: getLocalizedTitle(topic),
        localizedPdf: getLocalizedPdf(topic)
      }));

      setTopics(processedData);
      setFilteredTopics(processedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Перезагружаем данные при смене языка
  useEffect(() => {
    fetchTopics();
  }, [i18n.language]);

  // Живой поиск по локализованным заголовкам
  useEffect(() => {
    const results = topics.filter(topic =>
      topic.localizedTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTopics(results);
  }, [searchTerm, topics]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Шапка с переключателем (визуальным) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">
              <Globe size={16} />
              <span>{i18n.language === 'ru' ? 'Наука' : i18n.language === 'en' ? 'Science' : 'Илим'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {t('nav.topic_registry', 'Реестр тем')}
            </h1>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t('search_placeholder', 'Поиск...')}
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            // Скелетоны при загрузке
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))
          ) : filteredTopics.length > 0 ? (
            filteredTopics.map((item) => (
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
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">PDF</span>
                        • {t('last_updated', 'Обновлено')}: {item.year || '2026'}
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
                        <span>{t('open_file', 'Открыть')}</span>
                        <ArrowRight size={18} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-300 text-slate-500 rounded-xl font-bold cursor-not-allowed"
                      >
                        <span>{t('file_unavailable', 'Файл недоступен')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 italic">{t('no_results', 'Ничего не найдено')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicRegistry;