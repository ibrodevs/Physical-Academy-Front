import React, { useState, useEffect, useRef, useMemo } from "react"; // Добавил useMemo
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getSportAchivements } from "../../../services/api";
const AchievementsSport = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [names, setNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Оборачиваем в useMemo, чтобы не пересчитывать при каждом рендере
  const achievementsBackup = useMemo(() =>
    t('achievementsSport.list', { returnObjects: true }),
    [t]);

  const fetchNames = async () => {
    try {
      setIsLoading(true);

      // Берем только короткий код языка (ru, ky, en)
      const currentLang = i18n.language ? i18n.language.split('-')[0] : 'ru';

      const data = await getSportAchivements(currentLang);

      // Проверяем, что data существует и это массив
      if (data && Array.isArray(data) && data.length > 0) {
        setNames(data);
      } else {
        setNames(Array.isArray(achievementsBackup) ? achievementsBackup : []);
      }
    } catch (error) {
      console.error('Error fetching names:', error);
      setNames(Array.isArray(achievementsBackup) ? achievementsBackup : []);
    } finally {
      setIsLoading(false);
    }
  };

  // Вызывается при первом рендере и при смене языка
  useEffect(() => {
    fetchNames();
  }, [i18n.language, achievementsBackup]);

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

  // --- Анимации ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 text-7xl opacity-5">🏆</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('achievementsSport.title', 'Наши спортсмены')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('achievementsSport.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-t-2xl border border-white/20 p-5">
            <div className="grid grid-cols-12 gap-4 text-blue-200 font-semibold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-11">{t('achievementsSport.table.name')}</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-b-2xl border border-white/20 overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-white animate-pulse">
                {t('common.loading', 'Загрузка...')}
              </div>
            ) : (
              names.map((athlete, index) => (
                <motion.div
                  key={athlete.id || index}
                  variants={itemVariants}
                  className={`grid grid-cols-12 gap-4 p-5 items-center ${index !== names.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                >
                  <div className="col-span-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  <div className="col-span-11">
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-lg uppercase">
                        {athlete.full_name || athlete.name}
                      </span>
                      <div
                        className="text-blue-200/70 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: athlete.description }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSport;