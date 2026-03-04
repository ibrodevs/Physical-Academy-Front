import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const ScientificPublications = () => {
  const { t, i18n } = useTranslation();

  // Test translations
  const translations = {
    ru: {
      title: "Научные публикации",
      searchPlaceholder: "Поиск по названию, автору…",
      authors: "Авторы",
      download: "Открыть файл",
      noFile: "Файл отсутствует",
      notFound: "Ничего не найдено",
      empty: "Список пуст"
    },
    en: {
      title: "Scientific Publications",
      searchPlaceholder: "Search by title, author…",
      authors: "Authors",
      download: "Open file",
      noFile: "File missing",
      notFound: "Nothing found",
      empty: "List is empty"
    },
    kg: {
      title: "Илимий жарыялоолор",
      searchPlaceholder: "Аталышы, автору боюнча издөө…",
      authors: "Авторлор",
      download: "Файлды ачуу",
      noFile: "Файл жок",
      notFound: "Эч нерсе табылган жок",
      empty: "Тизмеси бош"
    }
  };

  const currentTranslations = translations[i18n.language] || translations.ru;

  // Состояния
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Загрузка данных
  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL || "";
      // В ТЗ указан этот эндпоинт
      const response = await fetch(`${API_URL}/api/science/scientific-publications/?lang=${i18n.language}`);

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setPublications(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Фильтрация (Поиск)
  const filteredPublications = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return publications.filter(pub =>
      pub.title?.toLowerCase().includes(term) ||
      pub.authors?.toLowerCase().includes(term)
    );
  }, [publications, searchTerm]);

  // Хелпер для определения текста (теперь API возвращает на нужном языке)
  const getField = (pub, field) => {
    return pub[field] || "";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 text-white">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Заголовок */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentTranslations.title}
          </h1>
          <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full"></div>
        </header>

        {/* Поиск */}
        <div className="mb-10 relative">
          <input
            type="text"
            className="w-full p-4 pl-12 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-emerald-400 transition-all backdrop-blur-md"
            placeholder={currentTranslations.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-emerald-400"
            >
              ✕
            </button>
          )}
        </div>

        {/* Контент */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} onRetry={fetchPublications} translations={currentTranslations} />
          ) : filteredPublications.length === 0 ? (
            <EmptyState key="empty" isSearch={searchTerm.length > 0} translations={currentTranslations} />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              {filteredPublications.map((pub) => (
                <PublicationCard key={pub.id} pub={pub} getField={getField} translations={currentTranslations} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// --- Подкомпоненты ---

const PublicationCard = ({ pub, getField, translations }) => {
  const title = getField(pub, 'title');
  const authors = getField(pub, 'authors');

  return (
    <motion.div
      layout
      className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-emerald-300">{title}</h3>
          <p className="text-blue-100/80">
            <span className="font-medium text-white">{translations.authors}:</span> {authors}
          </p>
        </div>

        <div className="flex-shrink-0">
          {pub.file ? (
            <a
              href={pub.file}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-transform active:scale-95"
            >
              📄 {translations.download}
            </a>
          ) : (
            <span className="text-sm text-white/40 italic">
              {translations.noFile}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 w-full bg-white/5 animate-pulse rounded-3xl" />
    ))}
  </div>
);

const ErrorState = ({ message, onRetry, translations }) => {
  return (
    <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20">
      <p className="text-xl mb-4 text-red-300">Ошибка загрузки</p>
      <p className="text-sm opacity-60 mb-6">{message}</p>
      <button onClick={onRetry} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
        Повторить
      </button>
    </div>
  );
};

const EmptyState = ({ isSearch, translations }) => {
  return (
    <div className="text-center py-20 opacity-50">
      <span className="text-5xl block mb-4">📂</span>
      <p className="text-xl">
        {isSearch
          ? translations.notFound
          : translations.empty}
      </p>
    </div>
  );
};

export default ScientificPublications;