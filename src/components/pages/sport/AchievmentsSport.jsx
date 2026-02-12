import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AchievementsSport = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const achievements = t('achievementsSport.list', { returnObjects: true });

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

  // Анимации для списка
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-7xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-7xl opacity-5">🥇</div>
        <div className="absolute top-2/3 right-1/3 text-7xl opacity-5">🎯</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header - только заголовок и подзаголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t('achievementsSport.title', 'Наши спортсмены')}
          </motion.h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8 rounded-full"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {t('achievementsSport.subtitle', 'Гордость КГАФКиС — наши талантливые спортсмены и их достижения')}
          </motion.p>
        </motion.div>

        {/* Список спортсменов */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Заголовок списка */}
          <div className="bg-white/10 backdrop-blur-lg rounded-t-2xl border border-white/20 border-b-0 p-5">
            <div className="grid grid-cols-12 gap-4 text-blue-200 font-semibold">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">{t('achievementsSport.table.name', 'ФИО спортсмена')}</div>
              <div className="col-span-3">{t('achievementsSport.table.sport', 'Вид спорта')}</div>
              <div className="col-span-3">{t('achievementsSport.table.achievement', 'Достижение')}</div>
            </div>
          </div>

          {/* Контейнер списка */}
          <div className="bg-white/5 backdrop-blur-lg rounded-b-2xl border border-white/20 overflow-hidden">
            {Array.isArray(achievements) && achievements.map((athlete, index) => (
              <motion.div
                key={athlete.id || index}
                variants={itemVariants}
                whileHover={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  transition: { duration: 0.2 }
                }}
                className={`
                  grid grid-cols-12 gap-4 p-5 items-center
                  ${index !== achievements.length - 1 ? 'border-b border-white/10' : ''}
                  transition-all duration-300
                `}
              >
                {/* Номер */}
                <div className="col-span-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 
                                 bg-gradient-to-r from-blue-500 to-emerald-500 
                                 rounded-lg text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>

                {/* ФИО и описание */}
                <div className="col-span-5">
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-lg">
                      {athlete.name}
                    </span>
                    <span className="text-blue-200/70 text-sm leading-relaxed">
                      {athlete.description}
                    </span>
                  </div>
                </div>

                {/* Вид спорта */}
                <div className="col-span-3">
                  <div className="inline-flex items-center px-3 py-1.5 
                                bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <span className="text-blue-300 text-sm mr-1">⚽</span>
                    <span className="text-white text-sm font-medium">
                      {athlete.sport}
                    </span>
                  </div>
                </div>

                {/* Достижение */}
                <div className="col-span-3">
                  {athlete.achievement && (
                    <div className="inline-flex items-center px-3 py-1.5 
                                  bg-gradient-to-r from-amber-500/20 to-orange-500/20 
                                  rounded-lg border border-amber-500/30">
                      <span className="text-amber-400 text-sm mr-1">🏆</span>
                      <span className="text-amber-300 text-sm font-medium">
                        {athlete.achievement}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSport;